# Drum Dog for Ableton Live: puts Bass & Biscuits' drum kits on the real APC64, four at a time.
# A control surface script (pick "drum_dog" as a Control Surface in Settings, Link, Tempo & MIDI, with Input and Output
# None, so Akai's own APC64 script keeps the pads). It listens on this PC only (port 38771). When a kit is dropped
# on a quarter of the board on Bass & Biscuits' page (preview-my-apc64-tool), the page sends the kit's 16 sounds as WAV
# files; this script keeps them in the User Library (Samples/Drum Dog/<kit>) and loads them into that quarter's 16 pads
# of the Drum Rack on the "Drum Dog" track, which it makes the first time, named and coloured like the kit.
# Astra, 2026-11-05: "make a feature of the Drum Dog for me to drag it to the main board, then it loads it immediately
# on the irl one", "4 at a time". Claude Opus 5.5 (claude-opus-5-5), 2026-11-05.
# The folder is drum_dog and the file __init__.py because Ableton loads a control surface as a Python package.
from __future__ import absolute_import

import base64
import hashlib
import json
import os
import re
import socket
import threading
import time

try:
    import queue
except ImportError:  # Python 2 (Live 10 and older)
    import Queue as queue

from _Framework.ControlSurface import ControlSurface

PORT = 38771
TRACK_NAME = 'Drum Dog'
# The first Drum Rack note of each quarter; each quarter's 16 pads go bottom row first, left to right, on the notes
# after it. This is Live's 64-pad drum layout; check it against the APC64 with a MIDI Monitor before trusting it.
QUARTER_NOTES = {'bottom-left': 36, 'bottom-right': 52, 'top-left': 68, 'top-right': 84}
# Only Bass & Biscuits' page may send kits: on this PC, or the hub's own site.
ORIGINS = re.compile(r'^(https?://(localhost|127\.0\.0\.1|\[::1\])(:\d+)?|https://findastra\.github\.io)$')
MAX_BODY = 24 * 1024 * 1024
SAMPLES = os.path.join(os.path.expanduser('~'), 'Documents', 'Ableton', 'User Library', 'Samples', 'Drum Dog')
# Soft taps louder, hard taps still loudest (Astra's Velocity settings, 2026-11-03).
VELOCITY = {'Drive': 0.65, 'Out Low': 50}


def create_instance(c_instance):
    return DrumDog(c_instance)


def safe_name(text, fallback):
    name = re.sub(r'[^A-Za-z0-9 _-]+', '', str(text or '')).strip()[:40]
    return name or fallback


class Server(threading.Thread):
    """Takes kits from the page and hands them to Live's main thread (only it may touch the set)."""

    def __init__(self, jobs, log):
        threading.Thread.__init__(self)
        self.daemon = True
        self.jobs = jobs
        self.log = log
        self.stopping = False

    def run(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('127.0.0.1', PORT))
        except Exception as e:
            self.log('Drum Dog: port %d is taken (%s)' % (PORT, e))
            return
        sock.listen(4)
        sock.settimeout(0.5)
        self.log('Drum Dog: listening on this PC, port %d' % PORT)
        while not self.stopping:
            try:
                conn, _ = sock.accept()
            except socket.timeout:
                continue
            except Exception:
                break
            try:
                self.handle(conn)
            except Exception as e:
                self.log('Drum Dog: %s' % e)
                try:
                    self.reply(conn, 400, {'ok': False, 'message': 'Drum Dog could not read that kit.'}, '')
                except Exception:
                    pass
            finally:
                conn.close()
        sock.close()

    def handle(self, conn):
        conn.settimeout(10)
        data = b''
        while b'\r\n\r\n' not in data:
            chunk = conn.recv(65536)
            if not chunk or len(data) > 65536:
                return
            data += chunk
        head, body = data.split(b'\r\n\r\n', 1)
        lines = head.decode('latin-1').split('\r\n')
        method, path = (lines[0].split(' ') + ['', ''])[:2]
        headers = {}
        for line in lines[1:]:
            if ':' in line:
                k, v = line.split(':', 1)
                headers[k.strip().lower()] = v.strip()
        origin = headers.get('origin', '')
        if origin and not ORIGINS.match(origin):
            return self.reply(conn, 403, {'ok': False, 'message': 'Only Bass & Biscuits may send kits.'}, '')
        if method == 'OPTIONS':
            return self.reply(conn, 204, None, origin)
        if method == 'GET' and path == '/':
            return self.reply(conn, 200, {'ok': True, 'message': 'Drum Dog is listening.'}, origin)
        if method != 'POST' or path != '/kit':
            return self.reply(conn, 404, {'ok': False, 'message': 'Not here.'}, origin)
        size = int(headers.get('content-length', '0') or 0)
        if size <= 0 or size > MAX_BODY:
            return self.reply(conn, 413, {'ok': False, 'message': 'That kit is too big.'}, origin)
        while len(body) < size:
            chunk = conn.recv(262144)
            if not chunk:
                return
            body += chunk
        job = {'data': json.loads(body[:size].decode('utf-8')), 'done': threading.Event(), 'result': None}
        self.jobs.put(job)
        if not job['done'].wait(40):
            job['result'] = {'ok': False, 'message': 'Ableton took too long to load the kit.'}
        self.reply(conn, 200, job['result'], origin)

    def reply(self, conn, code, obj, origin):
        text = {200: 'OK', 204: 'No Content', 400: 'Bad Request', 403: 'Forbidden', 404: 'Not Found', 413: 'Too Large'}[code]
        body = json.dumps(obj).encode('utf-8') if obj is not None else b''
        head = ['HTTP/1.1 %d %s' % (code, text), 'Content-Type: application/json', 'Content-Length: %d' % len(body),
                'Connection: close', 'Access-Control-Allow-Origin: %s' % (origin or '*'),
                'Access-Control-Allow-Methods: GET, POST, OPTIONS', 'Access-Control-Allow-Headers: Content-Type',
                'Access-Control-Allow-Private-Network: true', 'Vary: Origin']
        conn.sendall(('\r\n'.join(head) + '\r\n\r\n').encode('latin-1') + body)


class DrumDog(ControlSurface):

    def __init__(self, c_instance):
        ControlSurface.__init__(self, c_instance)
        self._jobs = queue.Queue()
        self._work = None
        self._server = Server(self._jobs, self.log_message)
        self._server.start()

    def disconnect(self):
        self._server.stopping = True
        ControlSurface.disconnect(self)

    # Live calls this about ten times a second on its main thread: one step of the current kit at a time.
    def update_display(self):
        ControlSurface.update_display(self)
        try:
            self._step()
        except Exception as e:
            self.log_message('Drum Dog: %s' % e)
            self._finish(False, 'Ableton could not load the kit: %s' % e)

    def _finish(self, ok, message):
        if self._work:
            job = self._work['job']
            job['result'] = {'ok': ok, 'message': message}
            job['done'].set()
            self._work = None

    def _step(self):
        if self._work is None:
            try:
                job = self._jobs.get_nowait()
            except queue.Empty:
                return
            self._work = {'job': job}
            self._start(job['data'])
        if self._work is not None:
            self._load_pending()

    # Write the kit's sounds to the User Library, then load them pad by pad as Live's browser sees them.
    def _start(self, data):
        quarter = data.get('quarter')
        if quarter not in QUARTER_NOTES:
            return self._finish(False, 'Which quarter?')
        pads = data.get('pads') or []
        if len(pads) != 16:
            return self._finish(False, 'A kit has 16 pads.')
        kit = data.get('kit') or {}
        wavs = [base64.b64decode(p.get('wav') or '') for p in pads]
        digest = hashlib.sha1(b''.join(wavs)).hexdigest()[:8]
        folder_name = '%s-%s' % (safe_name(kit.get('name'), 'Kit'), digest)
        folder = os.path.join(SAMPLES, folder_name)
        if not os.path.isdir(folder):
            os.makedirs(folder)
        pending = []
        for i, (pad, wav) in enumerate(zip(pads, wavs)):
            if not wav.startswith(b'RIFF'):
                continue
            file_name = '%02d %s.wav' % (i + 1, safe_name(pad.get('name'), 'Pad'))
            path = os.path.join(folder, file_name)
            if not os.path.exists(path):
                with open(path, 'wb') as f:
                    f.write(wav)
            pending.append({'note': QUARTER_NOTES[quarter] + i, 'path': path, 'file': file_name,
                            'name': safe_name(pad.get('name'), 'Pad'), 'color': pad.get('color') or ''})
        self._work.update({'folder': folder_name, 'pending': pending, 'deadline': time.time() + 20,
                           'kit': safe_name(kit.get('name'), 'Kit'), 'quarter': quarter})
        self._drum_dog()

    def _load_pending(self):
        work = self._work
        track, rack = self._drum_dog()
        song = self.song()
        browser = self.application().browser
        folder = self._find(self._find(self._find(browser.user_library, 'Samples'), 'Drum Dog'), work['folder'])
        left = []
        for p in work['pending']:
            pad = rack.drum_pads[p['note']]
            simpler = self._simpler(pad)
            if simpler is not None and hasattr(simpler, 'replace_sample'):
                simpler.replace_sample(p['path'])
            else:
                item = self._find(folder, p['file'])
                if item is None:
                    left.append(p)
                    continue
                song.view.selected_track = track
                song.view.select_device(rack)
                rack.view.selected_drum_pad = pad
                browser.load_item(item)
            self._dress(pad, p)
        work['pending'] = left
        if not left:
            song.view.selected_track = track
            return self._finish(True, '%s is on the %s pads.' % (work['kit'], work['quarter']))
        if time.time() > work['deadline']:
            return self._finish(False, "Ableton's browser hasn't found %d of the sounds yet. Try again in a moment."
                                % len(left))

    # The pad's chain takes the sound's name and the kit's colour (Live picks its nearest colour).
    def _dress(self, pad, p):
        if not pad.chains:
            return
        chain = pad.chains[0]
        try:
            chain.name = p['name']
        except Exception:
            pass
        if re.match(r'^#[0-9a-fA-F]{6}$', p['color']):
            try:
                chain.color = int(p['color'][1:], 16)
            except Exception:
                pass

    def _simpler(self, pad):
        for chain in pad.chains:
            for d in chain.devices:
                if d.class_name in ('OriginalSimpler', 'Simpler'):
                    return d
        return None

    def _find(self, parent, name):
        if parent is None:
            return None
        for c in parent.children:
            if c.name == name or os.path.splitext(c.name)[0] == os.path.splitext(name)[0]:
                return c
        return None

    # The Drum Dog track with its Drum Rack (and Astra's Velocity settings), made the first time a kit comes.
    def _drum_dog(self):
        song = self.song()
        browser = self.application().browser
        track = None
        for t in song.tracks:
            if t.name == TRACK_NAME and t.has_midi_input:
                track = t
                break
        if track is None:
            song.create_midi_track(-1)
            track = song.tracks[-1]
            track.name = TRACK_NAME
        for d in track.devices:
            if d.can_have_drum_pads:
                return track, d
        song.view.selected_track = track
        velocity = self._find(browser.midi_effects, 'Velocity')
        if velocity is not None:
            browser.load_item(velocity)
            for d in track.devices:
                if d.class_name == 'MidiVelocity':
                    for prm in d.parameters:
                        if prm.name in VELOCITY:
                            prm.value = max(prm.min, min(prm.max, VELOCITY[prm.name]))
        browser.load_item(self._find(browser.instruments, 'Drum Rack'))
        for d in track.devices:
            if d.can_have_drum_pads:
                return track, d
        raise RuntimeError('no Drum Rack on the Drum Dog track')
