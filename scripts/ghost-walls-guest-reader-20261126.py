# White Hat Lab's Ghost In The Walls reader (white-hat-lab-v1.0-ghost-in-the-walls-tool-v1.0): who is on the guest network.
#
# Astra, 2026-11-20: "I want you to track attempted password logins to it somehow." The router keeps no record of wrong
# guest passwords, so this lists every device on the guest network instead; ghost-walls-watch-20261126.mjs keeps the
# record of who joined, when and how often. Read only: it signs in, reads the device list, signs out. It never changes a
# setting.
#
# The router login comes from the Windows user environment variable WHITE_HAT_LAB_ROUTER_PASSWORD (API Fairy's key
# request 20261126-white-hat-lab-white-hat-lab-router-password; Astra adds it herself, never a chat). It is never
# printed, logged or written anywhere.
#
# Third-party: tplinkrouterc6u (PyPI, MIT), which speaks the router's encrypted web login. The router allows one admin
# sign-in at a time, so a read while Astra is signed in at tplinkwifi.net fails politely (exit 4) and is tried later.
#
#   python scripts/ghost-walls-guest-reader-20261126.py [--host http://tplinkwifi.net]
#
# Prints one JSON object: {"ok": true, "guests_total": n, "guests": [{"mac", "ip", "name", "band"}]} or
# {"ok": false, "why": "...", "code": n}. Exit 0 ok, 2 no login set, 3 library missing, 4 sign-in failed, 5 read failed.
# Claude Opus 5.5 (claude-opus-5-5), 2026-11-26.
import json
import os
import sys

KEY = "WHITE_HAT_LAB_ROUTER_PASSWORD"


def say(obj, code=0):
    print(json.dumps(obj))
    sys.exit(code)


def fail(why, code):
    say({"ok": False, "why": why, "code": code}, code)


def band(kind):
    """'guest_2g' style connection names to a plain band; None when it is not a guest device."""
    text = str(getattr(kind, "value", kind) or "").lower()
    if "guest" not in text:
        return None
    for b in ("6", "5", "2"):
        if b + "g" in text:
            return {"2": "2.4 GHz", "5": "5 GHz", "6": "6 GHz"}[b]
    return "guest"


def guests_from(status):
    out = []
    for d in getattr(status, "devices", None) or []:
        b = band(getattr(d, "type", None))
        if b is None:
            continue
        out.append({
            "mac": str(getattr(d, "macaddr", "") or "").upper().replace("-", ":"),
            "ip": str(getattr(d, "ipaddr", "") or ""),
            "name": str(getattr(d, "hostname", "") or ""),
            "band": b,
        })
    return out


def main(argv):
    host = "http://tplinkwifi.net"
    if "--host" in argv:
        host = argv[argv.index("--host") + 1]
    password = os.environ.get(KEY, "")
    if not password:
        fail(f"No router login yet: {KEY} is not set (API Fairy key request).", 2)
    try:
        from tplinkrouterc6u import TplinkRouterProvider
    except Exception:
        fail("The tplinkrouterc6u library is not installed for this Python.", 3)
    try:
        client = TplinkRouterProvider.get_client(host, password)
        client.authorize()
    except Exception as e:
        fail(f"Could not sign in to the router ({type(e).__name__}); someone may be signed in at {host}.", 4)
    try:
        status = client.get_status()
        guests = guests_from(status)
        total = getattr(status, "guest_clients_total", None)
        say({"ok": True, "guests_total": total if isinstance(total, int) else len(guests), "guests": guests})
    except SystemExit:
        raise
    except Exception as e:
        fail(f"Signed in, but reading the device list failed ({type(e).__name__}).", 5)
    finally:
        try:
            client.logout()
        except Exception:
            pass


if __name__ == "__main__":
    main(sys.argv[1:])
