# Who tracks real faces and drives VR avatars, VTuber models and digital humans (2024–2026)

> Researched 2026-11-03 for Astra (Quest Pro, VRCFaceTracking over OSC, Unity, Blender, OSCGoesBrrr).
> Method note for the report writer: this session's network blocked direct fetches of mixed-news.com, uploadvr.com,
> docs.vrchat.com, creators.vrchat.com, vr.org, docs.vrcft.io, hashout.jp and nature.com. Claims about those pages
> rest on search-engine summaries of them and are marked "(search summary)". github.com pages were fetched directly.
> GitHub contributor graphs could not be loaded, so names below come from release notes and credits pages.

## 1. Who maintains the open-source VR face-tracking ecosystem, and what state is each project in (2026)?

### Takeaway
The open stack Astra uses is still alive, but the big 2026 change is that **VRChat now has native face tracking**
(open beta 23 Oct 2026, live in client 2026.4.1 on 28 Oct 2026) built on VRCFaceTracking's **Unified Expressions**
standard, with an OSC input at `/tracking/face/v1`. VRCFaceTracking (benaclejames and contributors) moved to Steam
and has an active 2026 cross-platform fork; Project Babble has become a small hardware company (Baballonia app on
Steam, a Steam Frame mouth tracker announced Sept 2026) and appears to have absorbed EyeTrackVR's licensing.

### Cited Findings

**VRCFaceTracking (VRCFT)**
- Creator/owner: **benaclejames** (Ben). Repo describes itself as "OSC App to allow VRChat avatars to interact with
  eye and facial tracking hardware"; Apache-2.0; 917 stars, 149 forks, 1,220 commits, 36 open issues and 15 open PRs
  when fetched on 2026-11-03. Links: docs at docs.vrcft.io, Discord at discord.com/invite/vrcft —
  [GitHub benaclejames/VRCFaceTracking](https://github.com/benaclejames/VRCFaceTracking)
- A tracker site recorded the last push as 21 Apr 2026 and about 877 stars, which is older than the count above —
  [gittrend.io](https://gittrend.io/repo/benaclejames/VRCFaceTracking)
- GitHub release history (years not shown on the page): 5.2.3.0 (10 Apr) is marked "WE DO NOT SUPPORT THIS VERSION
  ANYMORE" and credits **hyblocker**, **RantiMess** and **kusomaigo**. The 5.0.x–5.1.x releases (Apr–Jul) are by
  benaclejames and kusomaigo, with translation contributors **P4tr0ll, stlenx, nkotech, VirtualMarten**. 5.1.0.0
  added face calibration and SteamVR auto-start —
  [VRCFT releases](https://github.com/benaclejames/VRCFaceTracking/releases)
- VRCFT now ships on Steam (app 3329480) — [Steam: VRCFaceTracking](https://store.steampowered.com/app/3329480/VRCFaceTracking/).
  A Steam stats site shows monthly average players rising from 725 (Jan 2026) to 1,137 (Apr 2026) (search summary) —
  [stmstat](https://stmstat.com/pt/app/3329480)
- Earlier v4.0.0 "UI Release" credited **dfgHiatus** (VRCFT OSC UI, PR #81) and **regzo2** (user-folder parser fix,
  PR #85) — [VRCFT v4.0.0 release](https://github.com/benaclejames/VRCFaceTracking/releases/tag/v4.0.0)
- The **VRCFaceTracking GitHub org** hosts SRanipalTrackingModule, VRCFT-Module-Backend and VRCFTModuleExample (the
  starting point for anyone writing a module) — [github.com/VRCFaceTracking](https://github.com/VRCFaceTracking)
- **2026 fork:** **RealWhyKnot/VRCFaceTracking** v2026.9.18.0 (18 Sep 2026) lists benaclejames/VRCFaceTracking as
  upstream. It ships Windows, Linux and macOS builds (x64 and arm64), replaces the WinUI app with an Avalonia app,
  adds multi-module tracking, in-app updates and eye/mouth/brow "assist" options, and removes Sentry crash reporting.
  Named contributors: RealWhyKnot, benaclejames, **Happyrobot33** (gaze outputs), **lumeyisnotyou**,
  **yuki-maruyama**. The page does not say whether the fork is endorsed upstream —
  [RealWhyKnot release](https://github.com/RealWhyKnot/VRCFaceTracking/releases/tag/v2026.9.18.0)

**Unified Expressions (UE) standard**
- VRCFT introduced the Unified Expressions standard, described as 142 supported blendshapes (search summary of VRCFT
  docs) — [VRCFT parameters docs](https://docs.vrcft.io/docs/tutorial-avatars/tutorial-avatars-extras/parameters)
- VRChat's creator docs say the new avatar Face Tracking section supports "the Unified Expressions standard from VRCFT"
  and that external apps can send UE data to `/tracking/face/v1` (search summary) —
  [VRChat Creators: Face Tracking](https://creators.vrchat.com/avatars/face-tracking/)
- ChilloutVR has an open request for built-in Unified Expressions —
  [ChilloutVR-Issues #1104](https://github.com/ChilloutVR-Team/ChilloutVR-Issues/issues/1104)

**VRChat native face tracking (new in Oct 2026)**
- Open beta reported 23 Oct 2026 with Avatars SDK 3.10.6-beta.1: a new Face Tracking section in the Avatar Descriptor.
  Synced face data does not count against the synced-parameter budget (search summary) —
  [UploadVR](https://www.uploadvr.com/vrchat-gets-native-face-tracking-support-in-open-beta/)
- SDK 3.10.6 release notes (dated ~30 Oct 2026): Unified Expressions tracking keys, "Parameter Behaviors" to combine
  inputs and drive blendshapes, Selfie Expression (webcam) on desktop and Android, OSC input at `/tracking/face/v1`,
  face tracking statistics in Performance Ranks (search summary) —
  [VRChat SDK Release 3.10.6](https://creators.vrchat.com/releases/release-3-10-6/)
- Client **2026.4.1 went live 28 Oct 2026** ("Improved Face Tracking", Safety Center, new login flow). It is not
  network-compatible with older clients — [VRChat on X](https://x.com/VRChat/status/2115512628550205783); patch notes
  say it syncs all 102 Unified Expressions values without using the parameter budget and adds a Face Tracking debug
  page and an OSC endpoint (search summary) — [VRChat 2026.4.1 notes](https://docs.vrchat.com/docs/vrchat-202641)
- A vr.org explainer is titled "Sixteen Meshes and 512 Instructions: VRChat's Face Tracking Moved Into the SDK",
  which suggests per-avatar limits; the article body could not be fetched —
  [vr.org](https://vr.org/articles/vrchat-native-face-tracking-avatars-sdk-open-beta-unified-expressions-2026)
- Community tooling already exists for the native system. **PawlygonStudio's VRC-Facetracking** Unity tool matches
  blendshapes by UE names and ARKit aliases and has a Face Tracking Emulation feature —
  [PawlygonStudio/VRC-Facetracking README](https://github.com/PawlygonStudio/VRC-Facetracking/blob/main/README.md)
- A Japanese creator explains "What changes with VRChat's official facial tracking?" —
  [note.com (ぺとりこーる)](https://note.com/petoriko_ru_/n/n73c5d960ba09?hl=en)
- VRChat feedback thread asking for VRCFT UE support in Selfie Expression —
  [VRChat feedback #1601](https://feedback.vrchat.com/sdk-bug-reports/p/1601-add-support-for-vrcft-unified-expressions-for-selfie-expression)

**Project Babble (DIY/commercial mouth tracking) and Baballonia**
- **Baballonia** is "Cross-platform, hardware-agnostic XR eye and face tracking" (608 commits, 207 stars). It
  supports the official Babble Face Tracker, DIY Babble trackers, the Vive Facial Tracker, DIY EyeTrackVR, Bigscreen
  Beyond 2E eyes, Vive Pro Eye, Varjo Aero, HP Reverb G2 Omnicept and Pimax Crystal eyes (some through BrokenEye). It
  outputs to VRChat (through VRCFT or "VRC Native Eyelook"), Resonite and ChilloutVR. Windows/Linux builds; macOS from
  source. Website babble.diy, docs docs.babble.diy —
  [GitHub Project-Babble/Baballonia](https://github.com/Project-Babble/Baballonia)
- Baballonia is on Steam — [Steam app 4091970](https://store.steampowered.com/app/4091970/Project_Babble_Baballonia/)
- Developer credits on an aggregator (not official): **Sierra, RedInjector, aeroscripts, RamesTheGeneric, summer_ai,
  SummerSigh, dfgHiatus, FrozenReflex** (search summary) —
  [Steambase: Baballonia](https://steambase.io/games/project-babble-baballonia/info)
- On 26 Sep 2026 Project Babble announced a Steam Frame mouth tracker: two cameras, on-device processing, no
  calibration step. Price and date were not announced. The report names CEO **Sameer Suri** (single Japanese source,
  search summary) — [hashout.jp](https://hashout.jp/gadget/11472/)
- A "Babble Frame Runtime" adds Steam Frame eye tracking through Babble's OSC driver, and Resonite added Steam Frame
  eye tracking. Mouth tracking still needs a USB face tracker (search summary) —
  [mixed-news](https://mixed-news.com/en/?p=38877)
- **NARE FACIAL TRACKER**, a third-party Japanese tracker, went on general sale on 4 Jul 2026 at ¥32,450. It requires
  Baballonia and VRCFaceTracking on Windows (search summary) — [MoguraVR](https://www.moguravr.com/?p=317592)
- Linux setup guides for Baballonia and the Vive Facial Tracker. Resonite's native Babble path only does lower face
  until Resonite issue #5533 is fixed —
  [VR on Linux wiki: Baballonia](https://wiki.vronlinux.org/docs/hardware/trackers/baballonia/),
  [VR on Linux wiki: Vive Facial Tracker](https://wiki.vronlinux.org/docs/hardware/trackers/vive-facial-tracker/)
- HTC's Sept 2025 explainer notes Babble covers the lower face only —
  [VIVE blog](https://blog.vive.com/us/what-is-face-tracking-in-vr-and-why-does-it-matter)

**EyeTrackVR (DIY eye tracking)**
- "Source First and affordable VR eye tracker platform" for VRChat over OSC/UDP. 1.2k stars, 1,043 commits. README
  still says "in active development and is not fully finished". It now runs **standalone on the Steam Frame** through a
  Linux ARM64 build installed with FrameDrop. Software license is now the **Babble Software Distribution License
  1.0**. Badges point to **RedHawk989/EyeTrackVR** (likely the original repo). ESP32 firmware **OpenIris** is by
  **lorow**. Docs docs.eyetrackvr.dev, Discord discord.gg/kkXYbVykZX —
  [GitHub EyeTrackVR/EyeTrackVR](https://github.com/EyeTrackVR/EyeTrackVR),
  [OpenIris](https://github.com/EyeTrackVR/OpenIris),
  [EyeTrackVR-Hardware](https://github.com/EyeTrackVR/EyeTrackVR-Hardware)
- An older SummerSigh/EyeTrackVR repo exists — [github.com/SummerSigh/EyeTrackVR](https://github.com/SummerSigh/EyeTrackVR)

**ALVR / Virtual Desktop face-tracking forwarding**
- VRCFT's Quest Pro guide lists four face-tracking PCVR routes: **ALVR, ALXR, Steam Link and Virtual Desktop**.
  Virtual Desktop is the paid one with more features (search summary) —
  [VRCFT docs: Quest Pro](https://docs.vrcft.io/docs/hardware/vr/meta/quest-pro)
- The **compdoge/VRCFT-ALVR-UE** fork of alvr-org/VRCFT-ALVR adds a generic Unified Expressions UDP segment, so
  any client can send UE values that no OpenXR extension exposes (pupil dilation, extra tongue shapes) —
  [compdoge/VRCFT-ALVR-UE releases](https://github.com/compdoge/VRCFT-ALVR-UE/releases)

### Inferences
- With VRChat native face tracking, VRCFT shifts from "the only path" to one OSC source among several. Astra's
  face-transfer and rigging tools could target UE names plus ARKit aliases, which both VRCFT and VRChat's SDK accept.
- The same few handles recur across VRCFT and Babble (dfgHiatus on both; Summer/SummerSigh on EyeTrackVR and
  Babble). Babble's license now covers EyeTrackVR software. The DIY face/eye ecosystem looks like it is consolidating
  around the Babble team.
- The RealWhyKnot fork (Linux/macOS, multi-module) and the compdoge UE-over-UDP fork are both small, recent projects
  whose maintainers might welcome contact.

### Gaps
- Could not load GitHub contributor graphs or docs.vrcft.io, so there is no verified full list of the VRCFT core
  team or of who designed Unified Expressions.
- Could not confirm the current official VRCFT version on Steam or whether benaclejames endorses the RealWhyKnot fork.
- No official Babble team page was fetched. Founder names rest on an aggregator and one Japanese article.
- ALVR's current face-tracking status in its main repo and Virtual Desktop's developer were not verified.

## 2. Face-tracking hardware after the Quest Pro (2025–2026)

### Takeaway
The Quest Pro is gone (sales ended Jan 2025) and Meta sells no face- or eye-tracking headset. In late 2026 the main
built-in face-tracking headset is **Samsung Galaxy XR**, which reaches PC VRChat through Virtual Desktop and VRCFT.
Eye-only headsets (Steam Frame, Bigscreen Beyond 2e, Pimax Dream Air, Vive Focus Vision) need add-ons such as the
Vive Facial Tracker or a Babble tracker for the mouth.

### Cited Findings
- Meta discontinued the Quest Pro in Sept 2024 in favour of Quest 3S and stopped selling it in Jan 2025 —
  [Road to VR](https://roadtovr.com/meta-discontinues-quest-pro/), [UploadVR](https://uploadvr.com/quest-pro-officially-discontinued/),
  [Wikipedia: Meta Quest Pro](https://en.wikipedia.org/wiki/Meta_Quest_Pro)
- After that, Meta no longer sells any headset with eye or face tracking. Reports of a Meta/ASUS headset with eye and
  face tracking are unconfirmed (search summary) — [mixed-news](https://mixed-news.com/en/quest-pro-successor-bloomberg-report/)
- **Samsung Galaxy XR (Android XR):** built-in eye and face tracking exposed through Google's OpenXR
  `XR_ANDROID_face_tracking` extension (blendshape weights; the docs ask for explicit consent before face data is
  stored or sent) — [Android XR: XR_ANDROID_face_tracking](https://developer.android.com/develop/xr/openxr/extensions/XR_ANDROID_face_tracking?hl=de)
- VRCFT has a Galaxy XR hardware page (search summary) —
  [VRCFT docs: Galaxy XR](https://docs.vrcft.io/docs/hardware/vr/samsung/galaxy-xr)
- Galaxy XR face tracking in VRChat works on PC through Virtual Desktop plus VRCFT. There is no standalone Android XR
  VRChat yet, and Samsung Game Link did not support face tracking at review time —
  [Spacebar: Galaxy XR + VRChat guide](https://www.spacebar.news/samsung-galaxy-xr-pc-vr-vrchat-guide/),
  [Spacebar review](https://www.spacebar.news/samsung-galaxy-xr-review/)
- A Japanese creator posted a Galaxy XR VRChat face-tracking test and said tongue tracking would come later —
  [ミスターVR on X](https://x.com/3DVR3/status/1981230296927522946)
- **Valve Steam Frame:** built-in eye tracking (two inward cameras, used for foveated streaming) and no built-in face
  tracking. Valve said the expansion port could carry face tracking. Release dates conflict across sources; Wikipedia
  lists 18 Sep 2026 — [Wikipedia: Steam Frame](https://en.wikipedia.org/wiki/Steam_Frame), [vr.org specs](https://vr.org/steam-frame-specs)
- Steam Frame face tracking comes from third parties: Babble's announced Steam Frame mouth tracker and EyeTrackVR
  running standalone on the Frame — [hashout.jp](https://hashout.jp/gadget/11472/),
  [EyeTrackVR README](https://github.com/EyeTrackVR/EyeTrackVR)
- **Bigscreen Beyond 2e:** optional eye tracking with a VRCFT module. Bigscreen's support roadmap lists per-eye wink,
  gradual blink, eye wideness and pupil dilation for 2026 (not confirmed shipped). No first-party face tracking;
  Bigscreen points users to Babble —
  [Bigscreen 2e VRChat setup guide](https://store.bigscreenvr.com/blogs/beyond/beyond-2e-eyetracking-setup-guide-with-vrchat),
  [How eyetracking works in 2e](https://store.bigscreenvr.com/blogs/beyond/how-eyetracking-works-in-bigscreen-beyond-2e),
  [UploadVR announcement](https://www.uploadvr.com/bigscreen-beyond-2-and-beyond-2e-announced/)
- **Pimax:** Dream Air ships with Tobii eye tracking (vendor claim). A 2025 PCGH report says its announced face
  tracking was still in development. Pimax guides recommend VRCFT for Crystal Super eye tracking on PC —
  [Pimax store blog](https://store.pimax.com/blogs/highlights/pimax-dream-air-vs-other-lightweight-vr-headsets-where-does-pimax-win),
  [PCGH](https://www.pcgameshardware.de/Virtual-Reality-Hardware-258542/News/Pimax-Dream-Air-Tragekomfort-Faceplate-1551308/),
  [Pimax Crystal Super VRChat guide](https://pimax.com/blogs/blogs/how-to-enable-eye-tracking-in-vrchat-on-pimax-crystal-super)
- **HTC Vive:** the Focus Vision has built-in eye tracking. The Facial Tracker for VIVE Focus Series costs $119 and
  tracks 38 blendshapes at 60 Hz. HTC says Focus Vision, Focus 3 and XR Elite support eye and face tracking in PC and
  standalone VRChat for VRCFT avatars —
  [VIVE shop](https://shop-us.vive.com/products/21045006),
  [VIVE support FAQ](https://business.vive.com/nz/support/focusvision/faq/how-to-make-vrchat-support-full-face-tracking.html)
- **Apple Vision Pro:** Personas got a major upgrade in visionOS 26 (2025), and Apple confirmed in Oct 2025 that
  Personas use Gaussian splatting. There is no public API for apps to display splats —
  [Road to VR](https://roadtovr.com/vision-pro-persona-avatar-upgrade-visionos-26/),
  [Radiance Fields](https://radiancefields.com/apple-confirms-personas-use-gaussian-splatting),
  [Apple dev forums](https://developer.apple.com/forums/thread/807309)

### Inferences
- Astra's Quest Pro is now rare hardware. Her nearest upgrade paths are Galaxy XR (built-in face tracking, PC only
  via Virtual Desktop), or an eye-tracking headset plus a Babble-style mouth tracker.
- Galaxy XR's tongue and other shapes may differ from Quest Pro's. That is a natural problem for Astra's
  face-transfer tool (mapping between expression sets).

### Gaps
- No primary source found on Play For Dream or other 2026 Chinese headsets' face tracking.
- Steam Frame release date, price and first face-tracking accessory are inconsistent across sources.
- No confirmation that Galaxy XR tongue tracking shipped.

## 3. Academic and industry research on expression-driven avatars (newest work)

### Takeaway
Industry research has moved to **Gaussian-splat avatars**. Meta's Codec Avatars Lab in Pittsburgh is publishing
universal and relightable Gaussian avatars, and Apple ships splat Personas. At IEEE VR 2026, KAIST showed photoreal
Gaussian heads driven by the same headset blendshape signals Astra already gets (OFERA). NVIDIA open-sourced
Audio2Face in Sept 2025, and Epic supports real-time MetaHuman animation from iPhone, Android and mono video.

### Cited Findings
- **Meta Codec Avatars Lab (Pittsburgh).** Research scientist **Shunsuke Saito** keeps a publication page —
  [shunsukesaito.github.io](https://shunsukesaito.github.io/)
- **URAvatar: Universal Relightable Gaussian Codec Avatars** (SIGGRAPH Asia 2024, Tokyo): **Junxuan Li, Chen Cao,
  Gabriel Schwartz, Rawal Khirodkar, Christian Richardt, Tomas Simon, Yaser Sheikh, Shunsuke Saito**. A universal model
  trained on hundreds of multi-view light-stage scans is fine-tuned from a **phone scan** into a personal relightable
  avatar — [project page](https://junxuan-li.github.io/urgca-website/), [arXiv 2410.24223](https://arxiv.org/pdf/2410.24223),
  [ACM](https://dl.acm.org/doi/fullHtml/10.1145/3680528.3687653)
- **Relightable Full-Body Gaussian Codec Avatars** (SIGGRAPH 2025, Vancouver): **Shaofei Wang**, Tomas Simon, Igor
  Santesteban, Timur Bagautdinov, Junxuan Li, … Jason Saragih, Michael Zollhoefer, Andreas Geiger, Siyu Tang, Shunsuke
  Saito (Yaser Sheikh not confirmed on this one) — [ACM DOI 10.1145/3721238.3730739](https://dl.acm.org/doi/10.1145/3721238.3730739),
  [PDF](https://www.cvlibs.net/publications/Wang2025SIGGRAPH.pdf)
- **Gaussian Pixel Codec Avatars: A Hybrid Representation for Efficient Rendering** (arXiv, Dec 2025) —
  [arXiv 2512.15711](https://arxiv.org/pdf/2512.15711)
- **Fast Registration of Photorealistic Avatars for VR Facial Animation** (ECCV 2024), about driving photoreal avatars
  from headset cameras — [PDF](https://chaitanya100100.github.io/FastRegistration/PatelFastRegistrationECCV2024.pdf)
- **OFERA: Blendshape-Driven 3D Gaussian Control for Occluded Facial Expression to Realistic Avatars in VR** (IEEE VR
  2026 / IEEE TVCG): **Seokhwan Yang, Boram Yoon, Seoyoung Kang, Hail Song, Woontack Woo** (KAIST). Drives photoreal
  Gaussian heads in real time from **commercial headset blendshape signals**, with a user study on expression
  fidelity — [arXiv 2602.01748](https://arxiv.org/abs/2602.01748), [TVCG DOI](https://doi.org/10.1109/tvcg.2026.3680590)
- **VRGaussianAvatar** (IEEE VR 2026 / TVCG): full-body Gaussian avatars in VR from headset tracking only. Facial
  expression tracking is named as future work — [project page](https://vrgaussianavatar.github.io/),
  [arXiv 2602.01674](https://www.alphaxiv.org/abs/2602.01674)
- **RelightAnyone: A Generalized Relightable 3D Gaussian Head Model** (arXiv, Jan 2026) — [arXiv 2601.03357](https://arxiv.org/pdf/2601.03357)
- **HeadGaS** (2023) real-time Gaussian head avatars at over 200 fps (older baseline) — [arXiv 2312.02902](https://arxiv.org/html/2312.02902)
- **NVIDIA Audio2Face** open-sourced in late Sept 2025: Audio2Face (lip sync) and Audio2Emotion models, the SDK, Maya
  and Unreal plugins, and the training framework for fine-tuning on custom characters —
  [Gigazine](https://gigazine.net/gsc_news/en/20250926-nvidia-audio2face-open-sources),
  [OpenSourceForU](https://www.opensourceforu.com/2025/09/nvidia-moves-audio2face-technology-to-open-source/),
  [GitHub NVIDIA/Audio2Face-3D-SDK](https://github.com/NVIDIA/Audio2Face-3D-SDK)
- **Epic MetaHuman / Live Link Face:** real-time MetaHuman animation requires Unreal Engine 5.6+ and the MetaHuman
  Live Link plugin. Sources include iPhone (Live Link Face, also offline depth solving), Android (real-time only) and a
  mono video source —
  [Epic: real-time animation](https://dev.epicgames.com/documentation/metahuman/realtime-animation-for-metahumans-in-unreal-engine),
  [Epic: terminology](https://dev.epicgames.com/documentation/metahuman/terminology)
- **Apple Personas** use Gaussian splatting (confirmed Oct 2025) —
  [Radiance Fields](https://radiancefields.com/apple-confirms-personas-use-gaussian-splatting)
- Older academic headset-camera work: **SpecTracle** (2023), wearable face tracking from peripheral cameras —
  [arXiv 2308.07502](https://arxiv.org/pdf/2308.07502); CMU Robotics Institute face tracking project page —
  [CMU RI](https://www.ri.cmu.edu/project/face-and-facial-feature-tracking)

### Inferences
- OFERA is the closest academic match to Astra's own work, since it maps headset blendshapes onto a different avatar
  representation. Woontack Woo's KAIST lab is a plausible contact.
- Open-sourced Audio2Face gives a speech-driven fallback for mouth shapes when no mouth tracker is present, which could
  be blended with eye tracking from headsets like Steam Frame or Beyond 2e.

### Gaps
- No verified 2025–2026 CVPR or SIGGRAPH 2026 face-tracking paper list. Proceedings were not searched directly.
- USC ICT and Stanford VHIL's 2025–2026 avatar-expression papers were not found in this session.
- License terms for the Audio2Face GitHub release were not checked.

## 4. VTubing: webcam and iPhone face tracking tools and their builders

### Takeaway
Webcam and phone VTubing runs on a few open trackers (OpenSeeFace, MediaPipe, ARKit 52 blendshapes) and some
long-running solo developers. **Emiliana (emilianavt)** builds VSeeFace and OpenSeeFace and keeps a VTuber software
list that was still being updated in Oct 2026.

### Cited Findings
- **emilianavt (Emiliana)**, developer of VSeeFace, maintains a "Best VTuber Software" list (last active 27 Oct 2026).
  It catalogues tracking methods: VSeeFace and VTube Studio use OpenSeeFace 66-point webcam tracking, VTube Studio
  also takes iPhone ARKit/ARCore, Warudo uses MediaPipe or OpenSeeFace, and VMagicMirror uses Dlib 17-point —
  [gist: Best VTuber Software](https://gist.github.com/emilianavt/cbf4d6de6f7fb01a42d4cce922795794)
- **VSeeFace** — [vseeface.icu](https://www.vseeface.icu/); **OpenSeeFace** (open webcam tracker) —
  [github.com/emilianavt/OpenSeeFace](https://github.com/emilianavt/OpenSeeFace/)
- **VTube Studio** (Live2D) by **DenchiSoft** — [denchisoft.com](https://denchisoft.com/), [denchisoft.github.io](https://denchisoft.github.io/)
- **Warudo** (3D, node graph, webcam and iPhone ARKit) — [Steam: Warudo](https://store.steampowered.com/app/2079120/Warudo/)
- **VNyan** by **Suvidriel** (camera, ARKit, Leap Motion, SteamVR, VMC) — [suvidriel.itch.io/vnyan](https://suvidriel.itch.io/vnyan)
- **VMagicMirror** by **malaybaku** — [VMagicMirror](https://malaybaku.github.io/VMagicMirror/en/index)
- VRChat's own **Selfie Expression** (webcam face tracking on desktop and Android) now feeds the native UE pipeline
  (search summary) — [VRChat SDK 3.10.6](https://creators.vrchat.com/releases/release-3-10-6/)
- A 2026 comparison says iPhone ARKit tracking is available in VTube Studio and Warudo but not VSeeFace. Secondary
  blog sources disagree on details —
  [tech-insider](https://tech-insider.org/vtube-studio-vs-vseeface-vs-warudo-2026/), [kudos.tv](https://kudos.tv/blogs/stream-blog/the-best-vtuber-software)

### Inferences
- VMC protocol and OSC are the shared buses between VTubing and VR. Astra's OSC skills carry over directly.
- Webcam UE input in VRChat (Selfie Expression) makes VTuber-style tracking relevant to VR avatar creators.

### Gaps
- No primary source found naming Warudo's developer team, XR Animator's author, iFacialMocap's or MeowFace's
  developers, or Google's MediaPipe face-blendshape maintainers.
- No individual named for VTube Studio beyond the DenchiSoft brand.

## 5. Why facial expressions matter for social presence and connection in VR

### Takeaway
Evidence mostly, though not entirely, supports tracked faces. The key Stanford VHIL study (Kruzic, Kruzic, Herrera and
Bailenson, 2020) found facial expressions mattered more than body movement for conversational outcomes, and 2025–2026
work (a scoping review, a hyperscanning preprint, CHI and IEEE studies) links tracked expressions to higher social
presence. Some studies find no effect, depending on task and avatar style.

### Cited Findings
- **Kruzic, Kruzic, Herrera & Bailenson (Stanford VHIL), "Facial expressions contribute more than body movements to
  conversational outcomes in avatar-mediated virtual environments"** (Scientific Reports, 2020). Tracked faces and
  bodies of over 200 people talking while embodied in avatars —
  [ResearchGate](https://www.researchgate.net/publication/346539774_Facial_expressions_contribute_more_than_body_movements_to_conversational_outcomes_in_avatar-mediated_virtual_environments),
  [Nature link](https://www.nature.com/articles/s41598-020-76672-4) (full text not fetched)
- **"Let's Face It: Influence of Facial Expressions on Social Presence in Collaborative Virtual Reality"** (CHI 2023) —
  [ACM DOI 10.1145/3544548.3580707](https://dl.acm.org/doi/10.1145/3544548.3580707)
- **"Avatar facial expressions enhance social presence and inter-brain synchronization in virtual reality"** (bioRxiv
  preprint, Jan 2026; fNIRS hyperscanning with amplified, natural and no-expression conditions). It concludes avatar
  expressions "strengthen the sense of presence and psychological connectedness" (not peer reviewed) —
  [bioRxiv](https://www.biorxiv.org/content/10.64898/2026.01.28.702209v1.full)
- A 2026 Frontiers in Virtual Reality scoping review reports that tracked facial expressions drew more gaze and higher
  social presence (search summary) — [Frontiers](https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2026.1738000/full)
- **"Making Faces: Evaluating Facial Control Methods in VR for Live Conversations"** (Chandran et al., Computer
  Animation and Virtual Worlds, 2026) — [Wiley](https://onlinelibrary.wiley.com/doi/10.1002/cav.70137)
- **"Investigating Personalised Avatars with Face Tracking in Social VR"** (ACM, 2026) —
  [ACM DOI 10.1145/3772363.3799372](https://dl.acm.org/doi/10.1145/3772363.3799372)
- **"Effect of avatar stylization and facial expression intensity in virtual interactions"** (Virtual Reality, Springer,
  2025) — [Springer](https://link.springer.com/article/10.1007/s10055-025-01238-6)
- Counterpoint: an IEEE TVCG 2024 mixed-reality study found adding an avatar head does not necessarily raise social
  presence, but the amount of facial expression does —
  [ACM/IEEE TVCG 2024](https://dl.acm.org/doi/10.1109/TVCG.2024.3372051)
- Null result: **"Face-off"** (Journal of Computer-Mediated Communication) found no interaction between disclosing
  facial expressions and proxemic norm violations on politeness, social presence, privacy intrusion or arousal —
  [JCMC](https://academic.oup.com/jcmc/article/31/5/zmag021/8832613)

### Inferences
- The most cited claim for Astra's motivation ("faces matter more than bodies") comes from Bailenson's lab. The newest
  work suggests expression intensity and avatar style shape the effect, which suits a stylised-avatar builder.

### Gaps
- Exact effect sizes from Kruzic et al. 2020 could not be verified (nature.com blocked).
- No 2025–2026 VHIL paper on face tracking was found. The JCMC paper's publication year (2025 vs 2026) is unclear.
- No studies specific to trust or empathy in VRChat were found.

## 6. Communities and events where Astra could share work or meet these people

### Takeaway
The live hubs are project Discords and GitHub repos (VRCFT, EyeTrackVR, Babble), VRChat's feedback board and creator
docs, Booth and Gumroad face-tracking creators, the VR on Linux wiki, and the academic venues where this work appears
(IEEE VR, SIGGRAPH and SIGGRAPH Asia, CHI).

### Cited Findings
- **VRCFaceTracking Discord** discord.com/invite/vrcft, linked from the repo —
  [GitHub VRCFT](https://github.com/benaclejames/VRCFaceTracking)
- **EyeTrackVR Discord** discord.gg/kkXYbVykZX and docs docs.eyetrackvr.dev —
  [GitHub EyeTrackVR](https://github.com/EyeTrackVR/EyeTrackVR)
- **Project Babble**: babble.diy, docs.babble.diy, and its open docs repo, which accepts pull requests —
  [GitHub Baballonia](https://github.com/Project-Babble/Baballonia), [BabbleDocs PR #83](https://github.com/Project-Babble/BabbleDocs/pull/83/files)
- **VRChat creator docs and feedback board** for native face tracking —
  [VRChat Creators: Face Tracking](https://creators.vrchat.com/avatars/face-tracking/),
  [VRChat feedback](https://feedback.vrchat.com/sdk-bug-reports/p/1601-add-support-for-vrcft-unified-expressions-for-selfie-expression),
  [ask.vrchat.com thread](https://ask.vrchat.com/t/vrchat-face-tracking/35020)
- **VR on Linux wiki** (community docs for Baballonia, EyeTrackVR and the Vive Facial Tracker) —
  [wiki.vronlinux.org](https://wiki.vronlinux.org/docs/hardware/trackers/eyetrackvr/)
- **Avatar face-tracking creators selling add-ons:** Booth (Japanese) FT add-ons and VRCFT modules —
  [Booth: Anwar2 FaceTrackingAddon](https://booth.pm/ja/items/7928670), [Booth: VRCFT module for Kittysan Hoppou 2.0](https://booth.pm/zh-cn/items/7848817);
  Gumroad, e.g. **RoyalGryphon** FT avatars — [Pupper FT](https://royalgryphon.gumroad.com/l/PupperHDFaceTracking);
  **PawlygonStudio** (open Unity FT tool) — [github.com/PawlygonStudio](https://github.com/PawlygonStudio)
- **Other platforms' trackers:** ChilloutVR issue tracker — [CVR #1104](https://github.com/ChilloutVR-Team/ChilloutVR-Issues/issues/1104);
  Resonite adds Steam Frame eye tracking (search summary) — [mixed-news](https://mixed-news.com/en/?p=38877)
- **Academic venues:** IEEE VR 2026 (OFERA, VRGaussianAvatar) — [arXiv 2602.01748](https://arxiv.org/abs/2602.01748);
  SIGGRAPH 2025, Vancouver, 10–14 Aug 2025 — [ACM](https://dl.acm.org/doi/10.1145/3721238.3730739);
  SIGGRAPH Asia 2024, Tokyo — [ACM](https://dl.acm.org/doi/fullHtml/10.1145/3680528.3687653);
  CHI — [ACM](https://dl.acm.org/doi/10.1145/3544548.3580707)

### Inferences
- The lowest-barrier ways to connect are a PR to BabbleDocs or VRCFT docs, a VRCFT module (example repo exists),
  and posting her face-transfer tool where PawlygonStudio-style tools are discussed. Native VRChat UE support is
  brand new, so tools that help avatars migrate are timely.

### Gaps
- No verified 2026 event pages were found for in-VR meetups (Furality, Virtual Market, VRChat creator meetups) or for
  SIGGRAPH 2026 / IEEE VR 2027 dates. These were not searched, to stay within budget.
- OSCGoesBrrr's maintainers and community were not researched.
