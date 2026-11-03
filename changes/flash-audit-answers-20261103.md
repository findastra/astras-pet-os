# The Flash Audit against the pages: Astra's eight answers

2026-11-03, Claude Opus 5.5 (`claude-opus-5-5`), branch `claude/flash-audit-answers-20261103` (the "Friendly Farmer"
chat), on top of `claude/pet-chat-helper-20261103` (#285).

Astra answered the deck "Friendly Farmer: Flash Audit vs the pages" (eight questions where the Flash Audit and the
pages disagreed): "i like the phone on data dealer, its program needs its own chat, all other reccd".

What changed:

- **Data Dealer's chat is Data Chip's own phone** (answer 2). On `apps/pet-programs/data-dealer-20261018.html` the
  `data-chip-chat` tool's open button is the little yellow phone from Data Dealer's dashboard, his face from its
  original drawing (`drawPet`, happy, eyes open) on its screen, and the window opens as the phone: the neon shell, its
  antenna and heavy outline, the LCD screens, "DATA CHIP>" before his lines. It is the same chat as every pet's (the
  same ids, page script and pet chat helper). Every other page keeps the arrow and the plain window.
- **Awake shows its own drawing** (answer 1: A): the `blink` frame with its two yellow twinkles, in the emotions panel
  and in the cyberhome, instead of the idle face. The Model Pet Program's awake drawing now has open eyes; a real pet's
  keeps its own until Astra OKs new art.
- **Play with and Care for** (answer 4: A): two tricks, `play-with` and `care-for`, in L2 on every page, off until L3
  can run them in the chat.
- **More details on every panel** (answer 8: A): the same four lines in the same order, How it works, Where it comes
  from, Your rules (her dated decisions, with a link to PET-PROGRAM-FRAMEWORK.md section 3) and Not built yet, on all
  16 panels. The cyberhome, the System Map box and the chat show only the arrow until it is opened.
- **No change to the pages** for answers 3 (no L3 activity bubble), 5 (pills keep names only), 6 (the blueprint; a
  pet's own colours only when she asks) and 7 (the wide page, no sideways scroll): the Flash Audit's rows now say so.
- `docs/flash-audit-20261014.md`: A03, A22, A37, A44, A45, A46, A47, A49, A50, A52 rewritten to her answers; A20, A48,
  A51 and A61 brought up to her later decisions; the 2026-10-15 notes marked where they were replaced; a table of the
  eight answers. `PET-PROGRAM-FRAMEWORK.md` section 3: the colours, the wide page, More details, L2's two tricks, item
  7 (awake) and item 10 (Data Dealer's phone).
- Tests: `test/pet-program-pages-test-20261018.mjs` checks the four lines on every panel, the phone on Data Dealer only,
  the awake drawing and the two tricks; `test/model-pet-program-test-20261102.mjs` counts the two tricks.

Checked in the browser pane from this branch (not live): Data Dealer's page at 1280×900 and 375×812, the phone open,
a quick answer with "DATA CHIP>", no sideways scroll; the Model Pet Program's open-eyed awake drawing.
