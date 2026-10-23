# Startup Star no longer shows as a block (2026-10-23)

Astra, 2026-10-23: "The startup star is sometimes appearing in the bottom right-hand corner as a block and not the
star. Then when I click on it, the image comes up."

- The desktop star is see-through by a magenta colour key. After a lock, sleep or screen change Windows can drop that
  drawing and show a plain block. With the pets hidden the small star stopped its timer and never repainted, so the
  block stayed until a click redrew it.
- The star now repaints itself on unlock, wake and screen changes (and redraws the tray star at the same time), and
  repaints every five seconds as a backstop. The self-test checks the redraw.
- Installed on Astra's PC 2026-10-23 16:53; the old exe is `bin/desktop-pets-before-block-repaint-20261023.exe`.

By Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-23.
