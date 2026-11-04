# Physical robots with expressive faces: mirroring, predicting and puppeteering human expressions (status as of 2026-11-03)

Method note for the report writer: these notes come from about 30 web searches run on 2026-11-03. Fetching full pages failed in this session (arxiv.org and engineering.columbia.edu did not resolve through the sandbox network), so every finding below rests on search-result snippets and summaries of the cited pages, not on full-text reads. Primary sources (journals, arXiv, lab and university pages) are cited wherever the search surfaced them. Weaker sources (aggregators, blogs, AI wikis) are flagged inline.

## 1. Columbia Creative Machines Lab (Hod Lipson, Yuhang Hu): EVA, Emo, and the newest lip-sync work

### Takeaway
The newest Columbia result is a Science Robotics paper from January 2026, "Learning realistic lip motions for humanoid face robots" (Hu et al., Sci. Robot. 11, eadx3017). In it the 26-motor face robot first learns its own face by watching its reflection, then learns human lip motion from hours of YouTube video. It follows EVA (2021, mirrors human expressions it sees) and Emo (Science Robotics, March 2024, predicts a smile about 839 ms ahead and smiles at the same time as the person). The lead author, Yuhang Hu, also founded the Shanghai face-robot startup AheadForm.

### Cited Findings
**Lip-sync robot (January 2026, newest)**
- Columbia announced the work on 2026-01-14. The paper is Hu et al., "Learning realistic lip motions for humanoid face robots," Science Robotics 11, eadx3017 (2026). Lead author: PhD student Yuhang Hu. Lab director: Hod Lipson — [Columbia Engineering news](https://www.engineering.columbia.edu/about/news/robot-learns-lip-sync); [Nanowerk, 2026-01-15](https://www.nanowerk.com/news2/robotics/newsid=68459.php); [paper PDF on lab site](https://www.creativemachineslab.com/uploads/6/9/3/4/69340277/lipsync_sciencerobotics.pdf)
- Method: the robot learned what its 26 facial motors do by watching itself in a mirror while making thousands of random expressions and lip gestures. It then learned human lip motion from hours of YouTube videos — [Newswise](https://www.newswise.com/articles/a-robot-learns-to-lip-sync); [Earth.com](https://www.earth.com/news/robots-are-finally-learning-how-to-move-their-lips-like-humans)
- It was tested on speech in several languages and on singing, including songs from an AI-generated album called "hello world" — [Eurasia Review](https://www.eurasiareview.com/16012026-a-robot-learns-to-lip-sync/); [ISPR, 2026-02-03](https://ispr.info/2026/02/03/columbia-u-engineers-build-a-robot-that-learns-to-lip-sync-to-speech-and-song)
- The researchers reported trouble with hard sounds such as "B" and with puckered-lip sounds such as "W" — [Newswise](https://www.newswise.com/articles/a-robot-learns-to-lip-sync)
- Hu argues that lip sync combined with conversational AI could deepen human-robot connection — [Columbia Engineering news](https://www.engineering.columbia.edu/about/news/robot-learns-lip-sync)
- Outlets disagree on the robot's name: eWeek calls it EMO, others leave it unnamed — [eWeek](https://www.eweek.com/de/news/columbia-emo-robot-learns-lip-sync/); [Nautilus, longer feature](https://nautil.us/the-quest-for-the-perfect-lip-synching-robot-1261380); [BGR](https://www.bgr.com/2127492/humanoid-robot-learns-watching-youtube-videos-uncanny-valley)

**Emo (2024): predicting a smile and smiling at the same time**
- "Human-Robot Facial Co-expression," Hu et al., Science Robotics, March 2024. The robot learns to forecast a coming smile about 839 ms before the human smiles, then smiles together with them (press rounds this to about 840 ms) — [Duke Scholars abstract](https://scholars.duke.edu/publication/1622406); [Science News](https://www.sciencenews.org/article/robot-predicts-smile-facial-expression); [ScienceDaily, 2024-03-27](https://www.sciencedaily.com/releases/2024/03/240327154854.htm)
- Emo has 26 actuators under a soft silicone face and cameras in its eyes. It learned which facial movements come before which expressions from about 800 videos — [Columbia "Robot, can you say 'Cheese'?"](https://www.engineering.columbia.edu/about/news/robot-can-you-say-cheese); [Interesting Engineering](https://interestingengineering.com/innovation/synced-smiles-next-gen-facial-robot-masters-human-mimicry)
- Columbia's reasoning: delayed facial mimicry looks insincere, while expressing at the same moment feels more genuine — [Columbia news](https://www.engineering.columbia.edu/about/news/robot-can-you-say-cheese)
- Video and further coverage: [IEEE Spectrum Video Friday](https://spectrum.ieee.org/video-friday-co-expression); [Hackster.io](https://www.hackster.io/news/emo-tional-intelligence-in-robots-8c859fd459e3)

**EVA (2021, older): mirroring a person's expressions**
- EVA is an animatronic face that watches a person through a camera and mirrors their expressions, without a library of preset expressions — [Columbia "Robot can mimic your facial expression by watching you"](https://www.engineering.columbia.edu/robot-can-mimic-your-facial-expression-watching-you); [Creative Machines Lab EVA page](https://www.creativemachineslab.com/eva.html)
- Paper: "Smile Like You Mean It: Driving Animatronic Robotic Face with Learned Models" (2021) — [arXiv 2105.12724](https://arxiv.org/abs/2105.12724v1)
- EVA was designed to cost about US$900 in parts and is reported to use MG90S micro servos (one summary says 25) — [Creative Machines Lab EVA page](https://www.creativemachineslab.com/eva.html)

**Yuhang Hu → AheadForm**
- Several sources say Yuhang Hu, the Columbia PhD researcher behind Emo, founded AheadForm (Shanghai AheadForm Technology, 首形科技) in 2024 — [Mike Kalil blog](https://mikekalil.com/blog/aheadform-elf-robot/); [AI Wiki (aggregator)](https://aiwiki.ai/wiki/aheadform). See section 2 for the company.

### Inferences
- Columbia's work has moved from "copy what you see" (EVA, 2021) to "predict and express at the same moment" (Emo, 2024) to "learn your own face from a mirror, then learn from video" (lip sync, 2026). Each step reduces hand-written mapping and replaces it with learned self-models. For Astra, the "watch yourself in a mirror" step is the same calibration problem she would face mapping VRCFaceTracking parameters onto real servos.
- Because Yuhang Hu both leads the newest Columbia papers and founded AheadForm, the lab's methods and the most visible Chinese face-robot product now share one lineage. That makes him the single most relevant person to follow.

### Gaps
- No Columbia face-robot paper newer than January 2026 turned up. I could not confirm whether anything was published between February and November 2026.
- I could not read the full lip-sync paper, so I could not confirm whether its robot is the same physical head as Emo or a new build.

## 2. Major companies and labs: Ameca, Sophia, Geminoids, Nikola, Disney, Furhat, and Chinese firms (2025–2026)

### Takeaway
Japan (Ishiguro's Geminoids, RIKEN's Nikola) still leads research androids and robot copies of real people. Engineered Arts' Ameca leads the Western market for expressive event and research robots. In 2025–2026 the fastest-moving companies are Chinese face-and-head startups, chiefly AheadForm, plus Ex-Robots, DroidUp and others. Disney's realistic-face work that appeared in this search is mostly older or patents, and recent news on Furhat and Sophia is thin.

### Cited Findings
**Hiroshi Ishiguro: Geminoids, android copies of himself (Osaka University / ATR)**
- Geminoid HI-6 is Ishiguro's sixth android replica of himself. It is teleoperated, and its main new feature is answering audience questions. It cannot walk, and its voice is not an exact copy of his (2024 coverage) — [CNBC Africa, 2024](https://cnbcafrica.com/2024/father-of-humanoids-meet-the-engineer-who-made-six-robot-versions-of-himself); [BGR](https://bgr.com/tech/a-scientist-built-a-robot-clone-to-give-lectures-and-answer-audience-questions/); [Interesting Engineering](https://interestingengineering.com/innovation/man-duplicates-himself-robot-hiroshi-ishiguro)
- Ishiguro produced the "Future of Life" signature pavilion at Expo 2025 Osaka, which included a Geminoid modelled on him talking with visitors — [nippon.com Expo guide](https://www.nippon.com/en/guide-to-japan/expo2025007/future-of-life-amplification-of-lives.html); [Gulf Times](https://www.gulf-times.com/article/711904/qatar/expo-2025-osaka-nears-close-after-attracting-millions-to-glimpse-a-sustainable-future/amp); [ANSA, April 2025](https://www.ansa.it/amp/english/news/2025/04/16/the-master-of-japanese-robotics-visits-italy-pavilion_c5e8921f-789a-4870-a3ab-3479727cb80d.html)
- After the Expo, seven androids from the pavilion were to move to Kyoto Prefecture — [Adnkronos, 2025-10-12](https://english.adnkronos.com/2025/10/12/osaka-expo-androids-to-be-moved-to-kyoto/)
- A "Future of Life+" media preview with Geminoid HI-6 ("Ishiguroid") and other androids is listed with a filming date of 2026-07-24. This was the most recent Ishiguro item found — [HAPPYELL](https://happyell.co.jp/world/video/8IuxoztTMJ0/)
- Ishiguro leads JST Moonshot Goal 1, which aims at an "avatar-symbiotic society" by 2050 — [JST Moonshot progress report](https://www.jst.go.jp/moonshot/en/program/goal1/appeal/11_ishiguro_ap01.html); lab robot list: [Ishiguro Lab robots](https://eng.irl.sys.es.osaka-u.ac.jp/robot)
- Older background: [IEEE Spectrum, "Hiroshi Ishiguro: The Man Who Made a Copy of Himself"](https://spectrum.ieee.org/hiroshi-ishiguro-the-man-who-made-a-copy-of-himself)

**RIKEN Guardian Robot Project: Nikola child android (Wataru Sato)**
- Nikola is an android head of a hairless boy with 29 pneumatic facial actuators plus 6 for head and eyes. The actuators were placed according to FACS (the Facial Action Coding System). A 2022 Frontiers in Psychology study found people recognised six basic emotions above chance, but disgust was hard to read because the silicone skin wrinkles less than human skin (2022, older) — [RIKEN press release](https://www.riken.jp/en/news_pubs/research_news/pr/2022/20220210_1/index.html); [Newswise](https://www.newswise.com/articles/introducing-nikola-the-emotional-android-kid); [RIKEN "Nikola's facial action units"](https://itaintmagic.riken.jp/?p=9414)
- 2025 follow-up: a Hiroshima University / RIKEN study in the International Journal of Social Robotics gave Nikola a furrowed-brow "thinking face". In a 89-person crowdsourced study it was rated more genuine, more human-like and less eerie than a neutral face — [Asia Research News](https://www.asiaresearchnews.com/node/21133); [Springer IJSR](https://link.springer.com/article/10.1007/s12369-024-01163-9)

**Engineered Arts (UK): Ameca**
- Ameca is Engineered Arts' expressive humanoid. The company rents it for events and demos — [Wikipedia: Ameca](https://en.wikipedia.org/wiki/Ameca_(robot))
- 2026 appearances: the Economist Government Roundtable in Athens on 2026-07-10 ([IMAGO photo listing](https://www.imago-images.de/de/collections/stock/746262/griechenland-economist-government-roundtable-in-athen)), the European Space Conference 2026 (per [Wikipedia](https://en.wikipedia.org/wiki/Ameca_(robot))), and a viral clip covered on 2026-09-11 ([NTN24](https://www.ntn24.com/noticias-ciencia-y-tecnologia/no-hay-que-preocuparse-nunca-dominaremos-el-mundo-dice-robot-humanoide-de-la-compania-engineered-arts-400376))
- An AI-wiki aggregator (low reliability) says 29 Ameca units had been deployed worldwide by 2025 and that full-size and desktop versions are planned — [AI Wiki (aggregator)](https://aiwiki.ai/wiki/engineered_arts_ameca/raw)

**Hanson Robotics (Hong Kong): Sophia**
- A 2025 documentary, *My Robot Sophia* (directors Jon Kasbe and Crystal Moselle), follows David Hanson's team — [Mike Kalil blog tag page](https://mikekalil.com/tag/my-robot-sophia/)
- Sophia still appears at events, such as the Volcano Summit 2025 in Guatemala — [News in America](https://newsinamerica.com/pdcc/noticias/gerenciales/2025/sophia-the-robot-hanson-robotics-llegan-a-guatemala-para-el-volcano-summit-2025/)
- Hanson's earlier lifelike androids (for example BINA48 and the Philip K. Dick android) are well known, but this search did not surface a source for them.

**Disney Research / Imagineering**
- "Physical Face Cloning" (SIGGRAPH 2012, older) by Bickel, Kaufmann, Skouras, Thomaszewski, Bradley, Beeler, Jackson, Marschner, Matusik and Gross. It designs and fabricates synthetic silicone skin, plus actuation settings, so an animatronic copies a specific real person's face and expressions — [Disney Research](https://la.disneyresearch.com/publication/physical-face-cloning/); [MIT CDFG](https://cdfg.mit.edu/publications/physical-face-cloning)
- "Realistic and Interactive Robot Gaze": an animatronic bust that imitates human saccades and attention (date not confirmed in this search) — [Blooloop](https://blooloop.com/technology/news/disney-interactive-robot-gaze/)
- Disney patent application US20250278879A1 (filed 2024-03-01, published 2025-09-04) covers real-time projection onto a "mechanically animated surface" such as an animatronic face — [WDWMagic](https://www.wdwmagic.com/other/walt-disney-imagineering/news/12sep2025-disney-patent-targets-real-time-projection-on-animatronic-faces.htm)

**Furhat Robotics (Stockholm)**
- Private company, about 30 employees as of 2026 per PitchBook. Funding figures disagree: about $4.62M ([PitchBook](https://pitchbook.com/profiles/company/167233-42)) versus $7.1M ([CB Insights](https://www.cbinsights.com/investor/furhat-robotics))
- Reported March 2026 trial at a UK social-housing complex, where residents found it useful for drinks service and conversation (secondary source) — [Origin of Bots](https://www.originofbots.com/news/furhat-robot-serves-drinks-sparks-bonds-in-uk-housing-trial)
- Newsroom: [furhatrobotics.com newsroom](https://www.furhatrobotics.com/de/newsroom)

**China: AheadForm (首形科技, Shanghai, founded 2024)**
- Origin M1 head (2025): about 25 micro motors driving lifelike expressions, eye movement and synchronised speech. Viewers split between "most realistic robot face to date" and "creepy" — [Live Science](https://www.livescience.com/technology/robotics/chinese-company-develops-creepy-ultra-lifelike-robot-face-watch-it-blink-twitch-and-nod); [Interesting Engineering](https://interestingengineering.com/innovation/china-humanoid-robot-face-lifelike-expressions)
- Elf V1 (October 2025): a fantasy-elf head reported with about 30 artificial muscles. A lower-cost Lan series has soft skin and about 10 degrees of freedom (DOF), and the Origin F1 desktop platform has 26 DOF — [Interesting Engineering](https://interestingengineering.com/innovation/china-aheadform-humanoid-robot-expression); [designboom, 2025-10-16](https://www.designboom.com/technology/realistic-humanoid-robots-mimic-people-lifelike-skin-facial-expressions-aheadform-10-16-2025/); [Mike Kalil blog](https://mikekalil.com/blog/aheadform-elf-robot/)
- Funding: five consecutive rounds since the second half of 2025, with one late-2025 round co-led by the China Internet Investment Fund and Ant Group — [Gasgoo "Seeds"](https://autonews.gasgoo.com/articles/news/seeds-aheadform-raises-hundreds-of-millions-in-financing-2041516640645062657)
- Conflict: Dealroom lists the headquarters as New York ([Dealroom](https://dealroom.co/companies/aheadform/)), while other sources say Shanghai ([AI Wiki](https://aiwiki.ai/wiki/aheadform))
- Search summaries say AheadForm exhibited at WAIC 2026 in Shanghai. I could not confirm which page carries this claim. It appears in coverage at [Mike Kalil blog](https://mikekalil.com/blog/aheadform-xuan-origin-m1/), and it is unverified.

**China: Ex-Robots (Dalian)**
- Reuters (June 2024, older) showed a robot head copying an employee's head turn, smile and tongue-out in real time using small motors in the head. CEO Li Boyang said the robots are mainly for museums, with healthcare and education planned. Build time is 2 weeks to a month, and prices are 1.5–2 million yuan — [IoT World Today](https://iotworldtoday.com/robotics/humanoid-robots-with-realistic-facial-expressions-revealed); [Express Tribune](https://tribune.com.pk/story/2471034/china-develops-humanoids-with-more-facial-movement-and-emotions)

**China: other 2025–2026 names (secondary coverage, unverified details)**
- Yansyn-X2, demonstrated at the 2026 Inclusion Conference in Shanghai, sheds a tear on request — [ProPakistani, 2026-09-28](https://propakistani.pk/2026/09/28/humanoid-robots-just-learned-how-to-cry/amp/)
- AnyWit Robotics (a game-character replica head; plans to ship standard head and face components in 2026) and DroidUp's "Moya" android (European debut at a Davos tech summit) are covered in [Mike Kalil, "China's Obsession with Lifelike Robots"](https://mikekalil.com/blog/china-lifelike-robot-obsession/)
- Academic work at Hohai and Changzhou universities on a two-stage method for more complex humanoid expressions. An earlier head had only 9 facial micro motors — [Ripples Nigeria (Xinhua relay)](https://ripplesnigeria.com/china-scientists-develop-robots-with-human-like-facial-features); [Ukranews](https://ukranews.com/en/news/1023740-chinese-scientists-develop-humanoid-robots-with-realistic-facial-expressions)

**Other robot copies of real people / custom likeness**
- Realbotix (US) Aria, shown at CES 2025: 17 face motors and swappable faces recognised by RFID, priced around $150k–$175k (sources differ). At CES 2026 Realbotix offered custom faces from about +$20,000 — [Interesting Engineering](https://interestingengineering.com/photo-story/meet-aria-humanoid-robot-girlfriend); [heise](https://heise.de/-11133524); [Vice, CES 2025](https://www.vice.com/en/article/most-unsettling-robots-of-ces-2025/)
- University of Tokyo (Shoji Takeuchi): a robot face covered in lab-grown living skin that smiles, anchored with collagen-gel "perforation-type anchors". Published in Cell Reports Physical Science on 2024-06-25 — [Smithsonian](https://www.smithsonianmag.com/smart-news/researchers-make-a-smiling-robotic-face-from-living-skin-180984613/); [Dezeen](https://www.dezeen.com/2024/06/28/living-skin-smile-robot-tokyo-university/amp/)

**Academic expressive faces from 2025 (learned control)**
- Morpheus (RSS 2025, Tsinghua; corresponding author Hao Zhao): a neural-driven animatronic face with hybrid actuation and diverse emotion control. The hardware design and code are released on GitHub — [arXiv 2507.16645](https://arxiv.org/html/2507.16645v1); [RSS 2025 proceedings](https://roboticsproceedings.org/rss21/p080.html)
- Rena (IROS 2025; Zhu, Li, Qian, Zhou, Yuan, Li, Liu, Zhang): a general animatronic face that learns, by imitation learning from human faces, to map facial features to servo commands. It reports a 4.4% servo control error — [arXiv 2510.23059](https://arxiv.org/html/2510.23059v1)

### Inferences
- The industry is splitting into high-end realistic heads (AheadForm, Ex-Robots, Realbotix, Engineered Arts) sold or rented at five- to seven-figure prices, and research faces (Columbia, Tsinghua's Morpheus, Rena), some with open hardware. Open-hardware research faces are the most useful starting point for a hobbyist.
- Several Chinese firms are now selling "face and head" modules on their own, without a body. That suggests a future market in face modules that a hobbyist might eventually buy instead of build.

### Gaps
- No verified 2026 primary-source news from Engineered Arts, Hanson Robotics or Furhat. Furhat's back-projected face design was not re-verified in this session.
- No Disney Research face paper from 2024–2026 was found; only the 2012 work and a 2025 patent.
- Unitree and other mainstream humanoid makers did not appear with expressive faces in these searches. I found no evidence either way.
- AheadForm pricing has not been published.

## 3. Teleoperation and puppeteering: mapping a human's face tracking (webcam, ARKit, MediaPipe, VR headsets) onto a robot face

### Takeaway
Real-time mapping of a human operator's face onto a robot face exists in both research and products. The current method reads blendshape or action-unit values from a VR headset (Quest Pro, HTC Vive Facial Tracker, Vive Pro Eye) or a webcam (MediaPipe), retargets them to motors, then smooths or learns the mapping to handle latency and mechanical limits. This is the same data Astra already produces through VRCFaceTracking. The closest research matches are the Yui android avatar (Japan), iCub3 (Italian Institute of Technology), Honda Research Institute Europe's Quest Pro system, and ExFace. The closest open-source and hobbyist matches are PyLips (an on-screen face), Blinki, and MediaPipe-to-Arduino servo repositories.

### Cited Findings
**Headset-driven android faces**
- **Yui cybernetic android avatar (Japan).** The operator wears a VR headset with face and eye tracking, and the HTC VIVE Facial Tracker drives Yui's face, gaze and mouth. The head has 28 facial actuation points and can show 7 main expressions plus eye and head movement. The authors say basic emotions work but precision needs improving. Yui succeeds an earlier android called "ibuki" — [arXiv 2312.06310 / IEEE Access 2024](https://arxiv.org/html/2312.06310v1); [IEEE Access via DOAJ](https://doaj.org/article/f8c041502c934f529ff0e99ee1b7bc4c); [HTC Vive blog](https://blog.vive.com/us/remote-control-robot-mimics-humans-with-vive-tech); [Interesting Engineering](https://interestingengineering.com/culture/meet-yui-a-human-like-android-avatar-for-operators); [UEC press release PDF](https://www.uec.ac.jp:443/about/publicity/news_release/2024/pdf/20240311_6060.pdf)
- **Yui, June 2026 update.** "Cybernetic Android Avatar 'Yui': System Integration, Field Deployment, and Evaluation". Blendshape weights from the headset's face-tracking API drive the android's face, with a hand-tuned mapping so the operator's expressions are reproduced as faithfully as possible. An aggregator says this version adds a 55-DOF body, a mobile base and hands (not verified) — [arXiv 2606.08099](https://arxiv.org/pdf/2606.08099); [Emergent Mind summary](https://www.emergentmind.com/papers/2606.08099)
- **iCub3 avatar system (Italian Institute of Technology, Daniele Pucci).** The operator uses an HTC Vive Pro Eye, the VIVE Facial Tracker and the iFeel suit. Eye gaze, eyelids and mouth are retargeted to the robot's face, with the operator demonstrated about 400 km away. A later paper says iCub3's expression reproduction is limited because human expressions combine many movements — [arXiv 2203.06972](https://arxiv.org/html/2203.06972v2); [IEEE Spectrum, "iCub is growing up"](https://spectrum.ieee.org/icub-is-growing-up); [ICRA 2023 Avatar workshop slides, Pucci](https://www.ais.uni-bonn.de/ICRA2023AvatarWS/ICRA_2023_Avatar_Invited_Presentation_Pucci_iCub3.pdf)
- **Honda Research Institute Europe (Chao Wang, Michael Gienger, Fan Zhang), arXiv 2508.08999.** Posted August 2025 and revised January 2026. A Unity app on a **Meta Quest Pro** teleoperates a robot with LED eyes, actuated ears, a neck and arms. Of Quest Pro's roughly 70 per-muscle blendshapes (values 0–1), the authors use the 7 that most affect perceived emotion. A flow-matching model learns from these demonstrations to generate expressions on its own in real time. They note the robot's neck responds more slowly than a human head — [arXiv 2508.08999 (HTML v2)](https://arxiv.org/html/2508.08999v2)
- **ExFace (arXiv 2504.14477, 2025).** Diffusion Transformers map human blendshapes to a humanoid robot face's motor values. It generates control commands at 60 fps and executes them within 0.15 s of detecting a human expression — [arXiv 2504.14477](https://arxiv.org/html/2504.14477v1)
- **Ex-Robots (Dalian).** Live demo of a robot head copying an employee's head turn, smile and tongue-out (2024) — [IoT World Today](https://iotworldtoday.com/robotics/humanoid-robots-with-realistic-facial-expressions-revealed)
- **Geminoids** are by design teleoperated androids of Ishiguro — [CNBC Africa](https://cnbcafrica.com/2024/father-of-humanoids-meet-the-engineer-who-made-six-robot-versions-of-himself)

**Learned "watch a human, copy it" without an operator rig**
- Columbia EVA (2021) mirrors a person seen by a camera — [Columbia news](https://www.engineering.columbia.edu/robot-can-mimic-your-facial-expression-watching-you). Rena (IROS 2025) learns face-to-servo mapping by imitation — [arXiv 2510.23059](https://arxiv.org/html/2510.23059v1)

**Software building blocks**
- **PyLips** (interaction-lab GitHub organisation): an open-source Python robot face controlled by FACS action units (intensity 0–1; left and right sides can be driven separately). Its "Teleoperate the Face" tutorial uses MediaPipe on a webcam to map blendshapes to action units and replays them live, with smoothing. Note that it is a screen face, not a servo face — [PyLips teleoperation tutorial](https://pylips.readthedocs.io/en/latest/tutorials/teleoperate.html); [PyLips expressions doc](https://pylips.readthedocs.io/en/latest/usage/making_expressions.html)
- **Apple ARKit** gives 52 blendshape coefficients from 0 to 1 and needs a TrueDepth camera or an A12 chip or later. Epic's Live Link Face can export recordings as CSV for replay — [Unity Live Capture face docs](https://docs.unity3d.com/Packages/com.unity.live-capture@1.0/manual/face-capture.html); [Unity ARKit face tracking](https://docs.unity3d.com/Packages/com.unity.xr.arkit@6.1/manual/arkit-face-tracking.html); [Apple sample, virtual robot head driven by face tracking](https://developer.apple.com/documentation/arkit/combining-user-face-tracking-and-world-tracking.md)
- **Meta Quest Pro**: five IR sensors inside (three for the eyes and upper face, two for the lower face). Face tracking is off by default. Meta's Movement SDK exposes FACS-based expression values — [MIXED](https://mixed-news.com/en/meta-quest-pro-what-the-new-eye-and-face-tracking-can-do/)
- **VRCFaceTracking** bridges tracking hardware to VRChat's OSC (Open Sound Control) server. Its docs say the parameters are meant for avatar eyes and lips via simple blend states, "but what the parameters control is completely up to you." Its module registry adds hardware support. No existing module or project driving physical servos was found — [VRCFaceTracking GitHub](https://github.com/benaclejames/VRCFaceTracking)
- **Kalidokit** turns MediaPipe or TensorFlow.js face, eye and pose outputs into blendshapes and rig values — [Kalidokit](https://gittrend.io/repo/yeemachine/kalidokit)

**Hobbyist and open-source face-tracked heads**
- **Blinki** by Vikas: an ongoing teleoperated robot head built with OpenCV and MediaPipe. It follows the maker's head movement and shows expressions, using a Waveshare ST3215 serial-bus servo and an 8×8 LED matrix for eyes. Code is said to be on GitHub, with a demo on YouTube (repository URL not obtained) — [Let's Data Science article](https://www.letsdatascience.com/news/robotic-head-tracks-user-with-opencv-84fd0bea)
- **alcarazolabs/python-face-tracking-servo-arduino**: Python + OpenCV + MediaPipe + pyserial controlling an Arduino servo. Basic pan/tilt starter — [GitHub](https://github.com/alcarazolabs/python-face-tracking-servo-arduino/search?l=python)
- **Emiliano-Rodriguez/AnimatronicFace**: full source for an animatronic face, including a servo driver (whether it uses face tracking is unconfirmed) — [GitHub](https://github.com/Emiliano-Rodriguez/AnimatronicFace)
- **MediaPipe face-landmark robot** on a Raspberry Pi or Jetson, with servo eyes and head, based on the InMoov face design — [Electronics For You](https://www.electronicsforu.com/electronics-projects/face-object-tracking-diy-ai-robot)
- **WPI thesis**: "Designing and Constructing an Animatronic Head Capable of Human Motion Programmed using Face-Tracking Software" — [WPI Digital](https://digital.wpi.edu/show/td96k2606)
- A maker's small robot copying his webcam expressions (2018, older) — [Boing Boing](https://boingboing.net/2018/08/23/this-guy-made-a-little-robot-t.html)

### Inferences
- Astra's existing pipeline (Quest Pro → VRCFaceTracking → OSC) already outputs the same kind of normalised 0–1 blendshape stream that Yui, iCub3 and Honda Research Institute Europe feed to their robots. The missing piece is a small OSC listener (Python on a PC or Raspberry Pi) that turns selected parameters (jaw open, eyelids, gaze, brows, smile left/right) into servo angles, with per-servo calibration and smoothing. This is the same "pick the few blendshapes that matter" step Honda's team used, where 7 of about 70 carried most of the emotion.
- Academic results suggest starting with a few channels (eyes, lids, brows, jaw, mouth corners) rather than trying to copy all 52–70 blendshapes. Even 28-actuator research androids report limited fidelity.
- Latency and slow actuators are the main problem everyone reports: Honda's slow neck, and ExFace's 0.15 s target. Predictive approaches like Emo's 839 ms forecasting exist partly to hide this delay.

### Gaps
- No public project was found that drives a physical servo face from VRCFaceTracking or from VRChat OSC specifically. This appears to be an open niche, but absence from search results is not proof.
- No hobbyist project was confirmed to use ARKit blendshapes to drive physical servos, although the software side is well documented.
- The Blinki repository URL and the PyLips authors and institution (the GitHub organisation is "interaction-lab") were not confirmed.

## 4. Uncanny valley and HRI research on robot facial expressions

### Takeaway
Recent studies find that small, socially fitting facial movements (a "thinking" frown, smiling at the same moment as the person rather than after) make androids seem more genuine and less eerie. Persistent weak points are the upper face (brows and forehead lines), skin that wrinkles too little, unnatural blinking and gaze, and timing delays. Public reactions to hyper-realistic heads such as AheadForm's Origin M1 split sharply between admiration and "creepy."

### Cited Findings
- Hiroshima University / RIKEN (2025): Nikola's furrowed-brow "thinking face" was rated more thoughtful, genuine and human-like, and less eerie, than a neutral face (89 crowdsourced raters, International Journal of Social Robotics) — [Asia Research News](https://www.asiaresearchnews.com/node/21133); [Springer IJSR](https://link.springer.com/article/10.1007/s12369-024-01163-9); [Hiroshima University](https://www.hiroshima-u.ac.jp/node/89922)
- An Osaka University motion-capture study comparing android and human expressions found androids fail to reproduce the curved "flow lines" of human faces, especially in the upper face. The likely cause is the mechanics under the skin (Frontiers in Robotics and AI; date not confirmed, probably older) — [Courthouse News](https://www.courthousenews.com/scientists-work-to-make-android-faces-less-unsettling/)
- Nikola's silicone skin was less elastic than human skin, so disgust (nose wrinkling) was hard to recognise — [RIKEN](https://www.riken.jp/en/news_pubs/research_news/pr/2022/20220210_1/index.html)
- Dynamic faces (human, android, CG) shown upright and inverted: configural processing moderates how human-likeness affects uncanniness. The authors caution that their fitted curve is not itself evidence of an uncanny valley (2023) — [PMC10497116](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10497116/)
- NTU Singapore: the uncanny valley effect was similar for brief and longer exposure (date unconfirmed) — [NTU](https://www.ntu.edu.sg/research/research-hub/news/detail/taking-robots-at-face-value)
- Columbia: delayed mimicry seems disingenuous, while expressing at the same moment seems genuine. This is the reason Emo predicts smiles — [Columbia](https://www.engineering.columbia.edu/about/news/robot-can-you-say-cheese)
- AheadForm Origin M1: praised as the "most realistic robot face to date" but also called creepy, especially for unnatural blinking and a fixed gaze — [Live Science](https://www.livescience.com/technology/robotics/chinese-company-develops-creepy-ultra-lifelike-robot-face-watch-it-blink-twitch-and-nod); [Futurism](https://futurism.com/the-byte/video-aheadform-robot-realistic-facial-expressions)
- The University of Tokyo's living-skin lead, Shoji Takeuchi, acknowledged "There's still a bit of that creepiness to it" — [Smithsonian](https://www.smithsonianmag.com/smart-news/researchers-make-a-smiling-robotic-face-from-living-skin-180984613/)
- Columbia's 2026 lip-sync coverage is framed around the uncanny valley ("the results are terrifying") — [BGR](https://www.bgr.com/2127492/humanoid-robot-learns-watching-youtube-videos-uncanny-valley)

### Inferences
- For a hobbyist, a stylised, non-realistic face (cartoon, creature, screen or LED eyes, as in Blinki or Honda's LED-eye robot) avoids most uncanny-valley risk while still showing expression clearly. Copying timing and gaze well probably matters more than realistic skin.

### Gaps
- No 2025–2026 meta-review on the uncanny valley for physical robot faces was found. Mori's original 1970 essay and the Mathur & Reichling studies were not re-sourced in this session.

## 5. Telepresence: avatar robots (ANA Avatar XPRIZE) and VR + face tracking for embodying a robot

### Takeaway
The ANA Avatar XPRIZE finals (2022-11-05, Long Beach; older but still the reference point) were won by Team NimbRo from the University of Bonn (Sven Behnke). NimbRo showed the operator's own animated face on the robot, generated from cameras inside the VR headset. Pollen Robotics (France) came second and Team Northeastern third. Since then, telepresence face work has moved from on-screen faces (NimbRo) to physical android faces driven by headset face tracking (iCub3, Yui), and to learned models trained on teleoperated demonstrations (Honda Research Institute Europe, 2025–2026).

### Cited Findings
- ANA Avatar XPRIZE finals, 2022-11-05, Long Beach: NimbRo (University of Bonn) won the $5M grand prize, Pollen Robotics (Bordeaux) took second ($2M), and Team Northeastern (Boston) third ($1M). Seventeen teams from 10 countries competed. NimbRo finished in about 5:50, about half of Pollen's time — [XPRIZE announcement](https://go.xprize.org/news/ana-avatar-xprize-winners); [Northeastern](https://coe.northeastern.edu/news/northeastern-robotics-team-wins-1m-for-third-place-finish-in-global-competition/); [UploadVR](https://uploadvr.com/nimbro-wins-5-million-xprize/)
- NimbRo's operator wore a VR headset with exoskeletal hand controls — [UploadVR](https://uploadvr.com/nimbro-wins-5-million-xprize/)
- NimbRo facial animation (Rochow, Schwarz, Schreiber, Behnke, IROS 2022): a mouth camera and two eye cameras inside the headset estimate the operator's expression and gaze, which animate a still photo of the operator taken without the headset. Eye tracking trains in under a minute, and a new operator needs about 15 minutes of preprocessing — [IROS 2022 paper (Bonn)](https://www.ais.uni-bonn.de/papers/IROS_2022_Rochow.pdf); [arXiv 2304.12051](https://arxiv.org/abs/2304.12051v1)
- Follow-up (IROS 2023) adds attention over source images and mouth-camera images. The authors credit facial animation as part of NimbRo's finals win — [arXiv 2312.09750](https://arxiv.org/html/2312.09750v1)
- Behnke's IROS 2023 keynote on the NimbRo avatar system — [slides PDF](https://www.ais.uni-bonn.de/behnke/talks/IROS_2023_Keynote_Sven_Behnke.pdf). The ICRA 2023 Avatar workshop, hosted by Bonn, brought together avatar teams including iCub3 — [Dafarra contribution](https://www.ais.uni-bonn.de/ICRA2023AvatarWS/contributions/ICRA_2023_Avatar_WS_Dafarra.pdf)
- iCub3 (IIT): full-body embodiment with VR plus facial tracker, with facial expressions retargeted to the robot — [arXiv 2203.06972](https://arxiv.org/html/2203.06972v2); [IEEE Spectrum](https://spectrum.ieee.org/icub-is-growing-up)
- Yui (Japan): an android head and face embodied through a VR headset with face tracking. A 2026 paper reports field deployment — [arXiv 2312.06310](https://arxiv.org/html/2312.06310v1); [arXiv 2606.08099](https://arxiv.org/pdf/2606.08099)
- Ishiguro's Moonshot Goal 1 programme targets a "cybernetic avatar" society by 2050. Expo 2025 coverage had planned remote-controlled avatars for online visitors (whether these were deployed was not confirmed) — [JST Moonshot](https://www.jst.go.jp/moonshot/en/program/goal1/appeal/11_ishiguro_ap01.html); [Kathmandu Post, 2024-11](https://kathmandupost.com/science-technology/2024/11/04/osaka-kansai-expo-robot-avatars-to-be-operated-by-online-visitors)

### Inferences
- The telepresence field shows two practical options for Astra. (a) A screen or LED face on the robot showing her tracked expressions, as NimbRo and Honda's LED eyes do. This is cheap and avoids the uncanny valley. (b) A mechanical face driven by servos, as in Yui and iCub3. This is harder and has lower fidelity per dollar.

### Gaps
- No ANA-style competition after 2022 focused on facial telepresence was found. The current activity of Pollen Robotics and Team Northeastern in facial telepresence was not researched.

## 6. What a hobbyist needs to build a face-tracked expressive robot head today (parts, servos, software, cost)

### Takeaway
A face-tracked expressive head is realistic for a solo hobbyist in the roughly US$300–$1,000 range for parts. It needs: 3D-printed skull and eye mechanisms (Will Cogley / Nilheim Mechatronics, InMoov), roughly 10–25 micro servos (MG90S-class or better), a 16-channel PCA9685 servo driver or serial-bus servos, a Raspberry Pi or Arduino, and optionally a silicone skin. Columbia's EVA was designed around a ~$900 bill of materials, and a 2025 student head with 16 servos and a Raspberry Pi 5 cost about $300. The software bridge from VRCFaceTracking/OSC or MediaPipe/ARKit to servos is a small custom script; no ready-made VRCFaceTracking-to-servo tool was found.

### Cited Findings
**Reference designs**
- **Will Cogley (Nilheim Mechatronics, UK YouTube maker):** an open-sourced 3D-printed animatronic eye mechanism that others have reused and modified. One reuse describes four MG90S servos moving the eyes, and one builder estimates at least a 1 kg reel of PLA for head plus eyes — [brainforest/robot-head (GitHub)](https://github.com/brainforest/robot-head); [UC Berkeley ME102B project](https://edg.berkeley.edu/wp-content/uploads/2020/12/2020Fall_ME102B_gerhardtkatelyn.pdf)
- Will Cogley's realistic animatronic head with silicone skin attached to the skull by magnets, controlled by an Arduino Mega shield (December 2024) — [Arduino Blog](https://blog.arduino.cc/2024/12/09/this-frighteningly-realistic-animatronic-head-features-expressive-silicone-skin/)
- **InMoov i2Head** (InMoov open-source humanoid): recommends JX PDI-1109MG servos and warns that cheap SG90s wear out quickly. Uses a PCA9685 and a wiring spreadsheet, with a Smooth-On 00-10 silicone skin (about 500 g per skin) tinted lightly with pigment — [InMoov i2Head](https://inmoov.fr/i2head-for-inmoov/)
- **"Robowaifu Animatronic Head (1:1 human sized)"**: printable files — [MyMiniFactory](https://www.myminifactory.com/object/3d-print-166251)
- **Columbia EVA**: about $900 design cost, MG90S servos — [Creative Machines Lab](https://www.creativemachineslab.com/eva.html)
- **Morpheus** (Tsinghua, RSS 2025): research-grade animatronic face with hardware and code released on GitHub — [arXiv 2507.16645](https://arxiv.org/html/2507.16645v1)

**Costs and sizing**
- Fab Academy 2025 (Puebla) student animatronic-face projects list per-part prices (PCA9685, Dragon Skin silicone). One 16-servo head with a Raspberry Pi 5 came to about $300 in AliExpress parts — [Fab Academy, J. Osorio](https://fabacademy.org/2025/labs/puebla/students/javier-osorio/finalproject.html); [Fab Academy, E. Vivar](https://fabacademy.org/2025/labs/puebla/students/erwin-vivar/final-project.html)
- Pulling a silicone face likely needs at least about 2 kg·cm of servo torque (forum estimate). Total cost is hard to pin down because sculpting, moulding and casting add up — [RobotShop community](https://community.robotshop.com/forum/t/simple-robotic-face-rig-supplies/25519)
- Serial-bus servos (Waveshare ST3215) used in the Blinki head-tracking build — [Let's Data Science](https://www.letsdatascience.com/news/robotic-head-tracks-user-with-opencv-84fd0bea)
- Commercial comparison: Realbotix Aria is about $150k–$175k ([Interesting Engineering](https://interestingengineering.com/photo-story/meet-aria-humanoid-robot-girlfriend)), and Ex-Robots heads cost 1.5–2M yuan ([IoT World Today](https://iotworldtoday.com/robotics/humanoid-robots-with-realistic-facial-expressions-revealed))

**Software path (sources for each piece)**
- Face data: Quest Pro FACS-based values via Meta's Movement SDK ([MIXED](https://mixed-news.com/en/meta-quest-pro-what-the-new-eye-and-face-tracking-can-do/)), VRCFaceTracking to OSC ([GitHub](https://github.com/benaclejames/VRCFaceTracking)), ARKit's 52 blendshapes ([Unity docs](https://docs.unity3d.com/Packages/com.unity.live-capture@1.0/manual/face-capture.html)), or MediaPipe on a webcam ([PyLips tutorial](https://pylips.readthedocs.io/en/latest/tutorials/teleoperate.html))
- Blendshape-to-motor mapping examples: Honda Research Institute Europe uses 7 selected Quest Pro blendshapes ([arXiv 2508.08999](https://arxiv.org/html/2508.08999v2)); ExFace learns the mapping with diffusion ([arXiv 2504.14477](https://arxiv.org/html/2504.14477v1)); Yui uses a hand-tuned mapping ([arXiv 2606.08099](https://arxiv.org/pdf/2606.08099))
- Starter code: MediaPipe → pyserial → Arduino servo ([alcarazolabs repo](https://github.com/alcarazolabs/python-face-tracking-servo-arduino/search?l=python))

### Inferences
- A plausible first build for Astra: Quest Pro → VRCFaceTracking (already working) → OSC → a Python script (for example python-osc) on her PC → USB serial to an Arduino or ESP32 with a PCA9685, or I2C from a Raspberry Pi → about 8–12 servos. Those servos would cover two eyes (pan/tilt), upper and lower lids, two brows, the jaw, and the left and right mouth corners. Calibrate each servo's range in a "mirror" step, as Columbia's self-modelling does, and add low-pass smoothing. Her Unity and Blender skills transfer directly: she can prototype the mapping on a Blender or Unity model of the head before printing.
- A screen or LED-matrix face (Blinki, PyLips, NimbRo-style) is the cheapest way to test the full pipeline before committing to servos and silicone.
- Suggested people to follow or contact, in order of relevance: Yuhang Hu and Hod Lipson (Columbia / AheadForm); the Yui team (arXiv 2312.06310, 2606.08099); Chao Wang and Michael Gienger (Honda Research Institute Europe, Quest Pro teleoperation); Sven Behnke's NimbRo team (VR facial animation); Daniele Pucci (IIT iCub3); Will Cogley (maker); the PyLips maintainers.

### Gaps
- No itemised, sourced cost breakdown for a complete face-tracked head was obtained. The $300 and $900 figures are single data points.
- The licence terms for Will Cogley's Nilheim designs were not found.
- The Quest Pro's sale status in 2026 was not checked, nor whether alternative face-tracking headsets are current. This matters if Astra's hardware needs replacing.
