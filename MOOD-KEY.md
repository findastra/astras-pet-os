# Mood key

*What each mood means, for every pet. Generated from `mood_key` and each pet's `audit` in [pets.json](pets.json) by `npm run build`. The Farmer's desk shows the same key with each pet's current mood and bubble.*

Every pet uses the same meanings, so a face reads the same everywhere. `{subject}` is what the pet checks; `{needs}` is what it asks Astra for when it is curious. The meanings are Astra's sketch of 2026-10-18 ([PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md), section 3), most urgent first: when several apply, the first one shows.

| Mood | Means |
|---|---|
| `alarmed` | Alarmed: a connected source reports an alarm, or there may be a security breach. |
| `sick` | Sick: too many of my tools are broken, or my program is. |
| `curious` | Curious: I need your OK or your input: {needs}. |
| `worried` | Worried: something slipped with {subject}: a missed run, a missed check, a failed audit or too many tokens. |
| `happy` | Happy: something new is ready: fresh work on {subject}, a suggestion or an idea. |
| `sad` | Sad: you haven't opened me in more than two weeks. |
| `idle` | Idle: my program is open, but you haven't used it for a while. |
| `blink` (awake) | Awake: my program is open and you've used it recently. |
| `sleep` (sleepy) | Sleepy: I'm running in the background. {Subject} needs nothing from you. |

## Each pet

A pet changes its own lines by submitting `moods` (and `audit`) in `cage.submit` in its pet.json. See [PET-FILES.md](PET-FILES.md).

| Pet | Checks | How often | When it is curious it needs |
|---|---|---|---|
| **Friendly Farmer** | the pet registry and the System Map | daily | a FARMER_TOKEN secret so I can see the private pet repos |
| **GitHub Goldfish** | the findastra GitHub account | weekly, Monday | a GitHub token that can read the private repos |
| **Data Chip** | Data Dealer's repo | weekly, Tuesday | your answer to a decision on the ops dashboard |
| **API Fairy** | Pet Program source, shared controls and declared tool behavior | weekly, Wednesday | Local source review; real runtime and desktop actions require separate verification |
| **Unity Unicorn** | your Unity and VRChat project notes | weekly, Thursday | a project opened in Unity so I can check it |
| **Python Panther** | your Python lessons | weekly, Friday | you to do the next lesson |
| **Astra Wisp** | AI Astra: her mind, VRChat body and voice | weekly, Saturday | the AI Astra app started on your PC |
| **Health Hummy** | my own files (never your check-ins) | weekly, Sunday | a check-in only you can make |
| **Finance Finch** | my own files (never your entries) | weekly, Monday | an entry only you can add |
| **Mommy's Mommies** | Mommy's classes and events | weekly, Tuesday | a date or teacher confirmed for a session |
| **Paper Patty** | the science desk and its live site | weekly, Wednesday | a look at the live site |
| **File Master** | your PC's folders and projects | weekly, Thursday | the scanner run on your PC |
| **Discord Damsel** | the OpenAI and Anthropic presence apps | weekly, Friday | Discord open with activity sharing on |
| **Portfolio Puffer** | your updates worth sharing | weekly, Saturday | a drafted update approved or posted |
| **Drum Dog** | your track ideas and samples | weekly, Sunday | a sample permission confirmed |
| **VSCode Angel** | your code cleanup worklist | weekly, Monday | a finding reviewed |
| **Gone Ghost** | your security checklist | weekly, Tuesday | a security step only you can do |
| **Project Parrot** | your project ideas | weekly, Wednesday | a yes or no on an idea that is due |
| **Voicemeeter Bug** | the app's build, fake-API recovery checks, and selected output reconnect monitoring | weekly, Thursday | a compatible installed Voicemeeter Remote API; a listening check when audible distortion persists |
| **Platform Platypus** | how Astra's pages look across iPhone, Android, iPad and desktop | weekly, Friday | something only you can do |
| **Log Lynx** | the farm’s logs and crash windows | weekly, Saturday | a look at a crash I caught |
| **Packet Piranha** | the network: loss, latency, DNS and routes | weekly, Sunday | a host to trace |
| **Forensic Ferret** | cases and their chains of custody | weekly, Monday | what you saw at a moment with no crash record |
| **Spoonfed Sugarcube** * | Spoonfed’s restaurant discovery, saved spots, and sample-data labels | weekly, Tuesday | review of Spoonfed Sugarcube draft artwork and a live restaurant provider before real recommendations |
| **Claude Bot** * | the Claude Bot plan and build | weekly, Wednesday | a decision on the plan |
| **RGBee** * | your RGB lights and scenes | weekly, Thursday | the brand and model of each light |
| **Mine Mole** * | the crypto mining research | weekly, Friday | your power price and graphics card model |
| **Mail Snail** * | my plan | weekly, Saturday | a job: what should Mail Snail do |
| **Patch Cat** * | my plan | weekly, Sunday | a job: what should Patch Cat do |
| **Meme Fiend** * | your saved memes (on your PC only) | weekly, Monday | a meme folder chosen |
| **Gif Giraffe** * | my plan | weekly, Tuesday | a job: what kind of GIFs should I make |
| **Backup Beaver** * | my plan | weekly, Wednesday | a job: what should Backup Beaver back up |
| **Rift Rabbit** * | your VR software and performance notes | weekly, Thursday | your headset and PC details |
| **Fuzzboi Friend** * | the Fuzzboi maker and its live site | weekly, Friday | your OK to register me in the Cage |
| **Wifi Butterfly** * | my plan | weekly, Saturday | a job: what should Wifi Butterfly do |
| **Deck Duck** * | my plan | weekly, Sunday | a job: what should Deck Duck do |
| **Mesh Moth** * | the Meshtastic node plan | weekly, Monday | a job: what should Mesh Moth watch |
| **Raspberry Pi Berry** * | Astra's Raspberry Pi projects | weekly, Tuesday | site storage allowed for the page (custom lines: happy, worried, sad, sick, alarmed) |
| **Role Fairy** * | every Discord bot: its servers, roles, permissions and health | weekly, Wednesday | a bot's access to its server, or your OK for a new bot |
| **Chat Rat** * | the chats it has filed and their index | weekly, Thursday | where your Claude and OpenAI chats are saved |
| **Workflow Whale** * | pairing, capture privacy, feedback delivery and device acceptance | weekly, Friday | native iPad verification and a verified chat adapter |
| **Linux Penguin** * | the Linux computers on the farm, MacAttack first | weekly, Saturday | his first check on a real Linux computer (the Kali MacBook) |

\* in the pipeline: on GitHub, not registered yet.
