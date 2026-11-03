# Cloning your own facial reactions into an AI character

Research notes, 2026-11-03. Facts marked "(search summary)" rest only on web-search result summaries, because the
full pages (arxiv.org, openaccess.thecvf.com, ai.meta.com, huggingface.co, hello.vrchat.com, store.steampowered.com,
mixed-news.com, evonneng.github.io) could not be fetched from this session. Facts without that mark were read directly
from GitHub READMEs or source code. Researchers are named for credit and called "they". No names of VRChat users,
talk-show listeners or other private people are written here, even where the sources name them.

## 1. Standard terms and research on learning one person's facial reactions (2022-2026)

### Takeaway
The field is called **listener (or facial) reaction generation**, with the REACT challenge series formalising it as
**Multiple Appropriate Facial Reaction Generation (MAFRG)**: given what a speaker does, generate several plausible
reactions, not one. Cloning *one specific person* is a newer sub-task: 2022's Learning to Listen already trained one
model per listener, 2024-2025 papers (PerFRDiff, PerReactor) personalise a generic model from a person's past
behaviour, and REACT 2026 added official **personalised** tracks. In machine-learning terms, Astra's plan is
**behaviour cloning** (imitation learning) of herself.

### Cited Findings
**Terms**
- Behaviour cloning (BC) is "the most basic form of imitation learning": supervised learning on an expert's
  state-action pairs, needing only recorded demonstrations and no interaction; credited to Pomerleau (1988)
  (search summary) — [Intro to Deep RL and Imitation Learning, arXiv 2512.08052](https://arxiv.org/pdf/2512.08052);
  [UPenn CIS 5190 lecture 19](https://www.seas.upenn.edu/~cis5190/spring2023/docs/lecture19.pdf)
- BC's known failure is distribution shift: at run time the clone visits states its own actions caused, which the
  expert's recordings rarely contain, so small errors compound. DAgger (Ross, Gordon and Bagnell, AISTATS 2011)
  fixes this by letting the learner act, having the expert label what it *should* have done, and adding those labels
  to the training set; the cost is an expert who must keep labelling (search summary) —
  [arXiv 2512.08052](https://arxiv.org/pdf/2512.08052); [UPenn lecture](https://www.seas.upenn.edu/~cis5190/spring2023/docs/lecture19.pdf)
- A "digital twin" of a person's attitudes has been built from interviews: Joon Sung Park and colleagues (Stanford)
  built generative agents of 1,052 real people from two-hour AI-run interviews; on the General Social Survey the
  agents matched the people's answers 85% as well as the people matched their *own* answers two weeks later (a
  normalised figure, not raw agreement) (search summary) —
  [arXiv 2411.10109](https://arxiv.org/abs/2411.10109v1); [Stanford HAI](https://hai.stanford.edu/news/ai-agents-simulate-1052-individuals-personalities-impressive-accuracy)

**Learning to Listen (CVPR 2022) and follow-ups (UC Berkeley, Meta)**
- "Learning to Listen: Modeling Non-Deterministic Dyadic Facial Motion", Evonne Ng and co-authors, CVPR 2022
  pp. 20395-20405: from the speaker's motion and audio, it autoregressively outputs *multiple* possible listener
  motions, using a cross-attention transformer and a VQ-VAE codebook of listener motion (search summary) —
  [CVF](https://openaccess.thecvf.com/content/CVPR2022/html/Ng_Learning_To_Listen_Modeling_Non-Deterministic_Dyadic_Facial_Motion_CVPR_2022_paper.html); [arXiv 2204.08451](https://arxiv.org/pdf/2204.08451)
- It is explicitly person-specific: the dataset comes from 6 YouTube channels (one listener each), and the released
  pretrained models are "person-specific models" for four of those listeners; each is a pair of a VQ-VAE codebook and
  a predictor — [learning2listen README](https://github.com/evonneng/learning2listen)
- Face representation: DECA parameters per frame, 50-D expression + 6-D pose (+128-D detail), in sequences of 64
  frames; speaker audio as 128 mel features; codebook training took "~2 days on 4 GPUs" —
  [learning2listen README](https://github.com/evonneng/learning2listen)
- "Can Language Models Learn to Listen?" (ICCV 2023, Ng et al.) generates listener face motion from the speaker's
  *transcript* by treating quantised face motion as tokens for a language model; per-person models were trained
  "from the idea that each person has a characteristic way of listening" (search summary) —
  [arXiv 2308.10897](https://arxiv.org/pdf/2308.10897)
- "From Audio to Photoreal Embodiment" (Audio2Photoreal, CVPR 2024, Ng et al., Meta): speech audio to face, body and
  hand motion for photoreal avatars; person-specific models for 4 captured participants recorded in pairs in a
  multi-view dome (search summary) — [arXiv 2401.01885](https://arxiv.org/abs/2401.01885);
  [GitHub (archived)](https://github.com/facebookresearch/audio2photoreal); [project page](https://people.eecs.berkeley.edu/~evonne_ng/projects/audio2photoreal/)

**REACT challenges (organiser contact: Siyang Song, University of Exeter)**
- REACT 2025 (third edition, ACM MM 2025, Dublin, pp. 13979-13984): Offline and Online MAFRG sub-challenges,
  ranked on FRCorr (correlation of facial reaction attributes) and FRRea (realism); new MARS dataset of 136
  human-human dyadic interactions, 2,856 sessions (search summary) —
  [arXiv 2505.17223](https://arxiv.org/html/2505.17223v1); [HAL hal-05430604](https://hal.inrae.fr/PEPR-ENSEMBLE/hal-05430604v1)
- REACT 2025 baseline repo: MARS access requires a signed EULA sent to Siyang Song; train/val/test split ~60/20/20
  and subject-independent (the same person never in train and test); each frame has 25-D facial attributes
  (15 AU occurrences, valence and arousal, probabilities of 8 expression categories) plus 58-D 3DMM coefficients
  (52 expression, 3 rotation, 3 translation); 23 sessions with controlled speaker prompts —
  [baseline_react2025 README](https://github.com/reactmultimodalchallenge/baseline_react2025)
- REACT 2026 (fourth edition, ACM MM 2026): four sub-challenges, offline/online x generic/**personalised** MAFRG,
  plus EEG reaction prediction; MARS is supplied with individual Big-Five personality labels and EEG (search
  summary) — [arXiv 2606.07935](https://arxiv.org/pdf/2606.07935); [REACT 2026 site](https://sites.google.com/view/react2026)
- REACT 2026 baselines include random (B_Random) and mean-reaction (B_MeanFr) baselines, which all generic MAFRG
  baselines "clearly outperformed" (search summary) — [arXiv 2606.07935](https://arxiv.org/pdf/2606.07935)
- One REACT 2026 entry (CaReDiff) uses a frozen generic backbone plus a personalised adapter; metrics listed are
  FRCorr, FRDist, FRDiv, FRVar, FRRea, FRSyn (correlation, distance, diversity, temporal variance, realism,
  synchrony) (search summary) — [CaReDiff on Hugging Face](https://huggingface.co/IVPL/CaReDiff)

**Generic and personalised reaction models**
- ReactFace (Cheng Luo, Siyang Song, Weicheng Xie and colleagues; arXiv May 2023, IEEE TVCG accepted Oct 2024):
  online multimodal MAFRG that learns a *distribution* of appropriate reactions synced to the speaker (search
  summary for method) — [arXiv 2305.15748](https://arxiv.org/pdf/2305.15748); [ReactFace GitHub](https://github.com/lingjivoo/ReactFace)
- PerFRDiff (2024): learns a target listener's "personalised cognitive style" from their previous facial behaviours
  and uses it to *edit the weights* of a pre-trained generic MAFRG model (search summary) —
  [Exeter repository](https://ore.exeter.ac.uk/repository/handle/10871/137834)
- PerReactor (AAAI-25, Hengde Zhu et al.): offline personalised MAFRG that disentangles personal behaviour patterns
  from a historical facial video of the target listener (search summary) —
  [AAAI](https://ojs.aaai.org/index.php/AAAI/article/view/32159/34314); [mlanthology](https://mlanthology.org/aaai/2025/zhu2025aaai-perreactor)
- ReactDiff (2025): latent-diffusion reaction generation, generic rather than personalised (search summary) —
  [arXiv 2505.14151](https://arxiv.org/pdf/2505.14151)
- Other 2024-2025 listener work: Dyadic Interaction Modeling (separate speaker/listener VQ-VAEs) —
  [arXiv 2403.09069](https://arxiv.org/pdf/2403.09069); DiffListener (discrete diffusion) —
  [arXiv 2502.06822](https://arxiv.org/pdf/2502.06822); LLM-driven Multi-Identity Listening Head Generation (CVPR 2025) —
  [CVF PDF](https://openaccess.thecvf.com/content/CVPR2025/papers/Lai_LLM-driven_Multimodal_and_Multi-Identity_Listening_Head_Generation_CVPR_2025_paper.pdf)

**Meta FAIR Seamless Interaction (2025)**
- Dataset: 4,000+ hours of face-to-face interaction from 4,000+ participants, ~27 TB, licence CC-BY-NC 4.0; split into
  "naturalistic" (prompted conversations by ordinary people) and "improvised" (scenarios with at least one
  professional actor) sessions — [seamless_interaction GitHub](https://github.com/facebookresearch/seamless_interaction)
- Models: the primary Dyadic Motion Model takes audio from *both* participants and generates face and body motion
  for each avatar, is also reactive to the other person's visual behaviour (e.g. mirroring a smile), outputs
  intermediate codes that can drive 2D video or 3D Codec Avatars, and has expressivity controls; arXiv 27 June 2025,
  announced July 2025 (search summary) — [arXiv 2506.22554](https://arxiv.org/html/2506.22554v2);
  [Meta AI blog](https://ai.meta.com/blog/seamless-interaction-natural-conversational-dynamics/);
  [Meta research page](https://ai.meta.com/research/seamless-interaction/)

### Inferences
- Astra's plan maps cleanly onto "personalised online facial reaction generation" (REACT 2026's personalised online
  track) done as behaviour cloning, with herself as the one expert.
- Every successful personalised method found starts from a *generic* model trained on many people and adapts it to
  the target (PerFRDiff weight editing, CaReDiff adapters). Astra has only her own data, so a pure clone will
  generalise less; the closest framework-free analogue is "generic default behaviour + Astra-specific overrides"
  (see section 4).
- DAgger suggests a concrete training loop for the Astral Plane: AI Astra reacts, Astra watches a replay and marks
  "I would have done X here", and those corrections become new data. This directly attacks the compounding-error
  failure.
- Park et al.'s self-consistency normalisation is a good yardstick for Astra: compare the clone against how
  consistently *Astra herself* reacts to the same clip watched twice, not against perfection.

### Gaps
- No full-text access to the core papers, so dataset hours per listener in Learning to Listen, PerFRDiff's and
  PerReactor's data needs, and all REACT leaderboard scores were not verified.
- REACT 2023 and 2024 (first and second editions) were not researched individually.
- Whether any Seamless Interaction *models* (not just data) are publicly downloadable was not confirmed; the GitHub
  README did not say so.
- Found no work that clones a person from their *own VR face-tracking logs* specifically (also noted in the earlier
  report's notes).

## 2. Motion matching as a retrieval analogue for expressions

### Takeaway
**Motion matching** (Ubisoft, For Honor) is deliberately brute-force retrieval: every frame, search the whole
recorded animation database for the frame that best fits the current pose and goal, and jump to it. The facial
equivalent is "find my recorded reaction whose context best matches now, and play it". Reaction-generation papers
already use exactly this as a baseline ("NN motion" / "NN audio"), and neural models are reported to beat it, but it
needs no deep-learning framework.

### Cited Findings
- "Motion Matching and The Road to Next-Gen Animation", Simon Clavet (Ubisoft Montreal), GDC 2016 programming track —
  [GDC Vault](https://gdcvault.com/play/1022985/Motion-Matching-and-The-Road)
- Coverage of the talk: it searches all motion-capture data every frame, picks the best-matching frame and
  transitions to it; Clavet described it as deliberately brute force; match criteria are pose, velocity, end
  position or a mix (search summary) — [Game Developer](https://gamedeveloper.com/programming/most-inspiring-game-animation-tech-talks-of-2016);
  [CGWorld (Japanese)](https://cgworld.jp/feature/1604-gdc2016-03-2.html)
- The For Honor implementation needed a very large number of motion-capture sessions (search summary) —
  [CGWorld](https://cgworld.jp/feature/1604-gdc2016-03-2.html)
- Learned Motion Matching (Daniel Holden, Oussama Kanoun, Maksym Perepichka, Tiberiu Popa; Ubisoft La Forge;
  SIGGRAPH 2020, ACM TOG 39(4)) credits Clavet and Büttner (2015) with motion matching, and replaces each step with a
  learned component because plain motion matching "scales poorly in terms of data" (memory) (search summary) —
  [paper PDF](https://www.theorangeduck.com/media/uploads/other_stuff/Learned_Motion_Matching.pdf);
  [Ubisoft La Forge](https://www.ubisoft.com/en-us/studio/laforge/news/3NWqwcMU9lMfumgfPAEfka/learned-motion-matching);
  [SIGGRAPH history](https://history.siggraph.org/?p=78733)
- ReactFace compares against "NN motion" (find the nearest neighbour of the current speaker motion segment and return
  the corresponding listener segment, "a method commonly used in graphics synthesis") and "NN audio" (same, keyed on
  speaker audio), plus Mirror and Random baselines (search summary) — [arXiv 2305.15748](https://arxiv.org/pdf/2305.15748)
- ReactMotion (arXiv 2603.15083) reports beating retrieval baselines and cascaded LLM pipelines (search summary) —
  [papers.cool](https://papers.cool/arxiv/2603.15083)

### Inferences
- For one person, the "database" is small (hours, not studios of mocap), so the memory problem that motivated
  Learned Motion Matching does not apply; brute-force or k-d-tree search over a few thousand **comets** (reaction
  clips) is cheap in plain Python.
- Retrieval answers REACT's "multiple appropriate reactions" requirement naturally: take the top-k matches and pick
  one with a little randomness (where the separately researched true-random/quantum bits could plug in).
- Retrieval can only replay reactions Astra has actually made; blending between neighbours (as motion matching
  transitions do) or a learned layer would be needed for novel situations.

### Gaps
- The numeric gap between NN baselines and ReactFace (how much worse retrieval is) was not retrieved.
- Found no paper that applies motion matching to *facial* animation specifically.

## 3. What to record alongside the face, segmentation, data amounts, evaluation

### Takeaway
Published datasets record the **other person's audio (often with a transcript and voice-activity labels), the other
person's face, the reactor's face, and who is speaking when**; richer sets add emotion/valence/arousal, personality,
relationship and the reactor's own account of their internal state. Reactions are segmented into
**neutral-onset-apex-offset** phases, a problem HMMs handled well. Personal data alone may be too little (a shared
codebook beat a person-specific one for a listener with less data). Evaluation uses correlation, diversity,
realism and synchrony metrics plus human A/B or Turing-style tests.

### Cited Findings
**What is recorded**
- Learning to Listen: per clip, the listener's face, the speaker's face and the speaker's audio; preprocessing ran
  SyncNet to find who speaks when, and removed listener back-channels to get speaker-only audio —
  [learning2listen README](https://github.com/evonneng/learning2listen)
- Seamless Interaction: separate denoised audio channels (48 kHz), time-aligned transcripts, voice activity
  detection, SMPL-H body, facial keypoints, 24-D facial action unit tokens/values, gaze and head encodings,
  arousal/valence/8-way emotion scores, participant personality (BFI-2), relationships, interaction contexts, and
  internal-state and rationale annotations from the participant ("1P") and from third parties ("3P"; read here as
  first-/third-person) — [seamless_interaction GitHub](https://github.com/facebookresearch/seamless_interaction)
- REACT/MARS: speaker and listener video, audio, 25-D facial attributes and 58-D 3DMM coefficients per frame, with
  controlled session contexts — [baseline_react2025 README](https://github.com/reactmultimodalchallenge/baseline_react2025);
  REACT 2026 adds Big-Five labels and EEG (search summary) — [arXiv 2606.07935](https://arxiv.org/pdf/2606.07935)
- Seamless Interaction's model reacts to the partner's visual behaviour and mutual gaze, not only audio (search
  summary) — [arXiv 2506.22554](https://arxiv.org/html/2506.22554v2)

**Segmentation (onset detection)**
- Facial dynamics are commonly modelled by detecting neutral, onset, apex and offset segments of each action unit
  (search summary) — [Koelstra et al., IEEE PAMI 2010 (PDF)](https://www.ibug.doc.ic.ac.uk/media/uploads/documents/PAMI-2010-KoelstraEtAl-CAMERA.pdf)
- Koelstra et al. combined frame-based GentleBoost classifiers with HMMs per AU and reported 89.2% average event
  recognition across 27 AUs on 264 MMI sequences (search summary) —
  [PAMI 2010 PDF](https://www.ibug.doc.ic.ac.uk/media/uploads/documents/PAMI-2010-KoelstraEtAl-CAMERA.pdf)
- Michel Valstar and Maja Pantic (ICCV-HCI 2007) used a hybrid SVM/HMM because "the evolution of a facial action in
  time can be efficiently represented using HMMs" (search summary) —
  [ICCV-HCI 2007 PDF](https://Ibug.Doc.Ic.Ac.Uk/media/uploads/documents/ICCV-HCI07_ValstarPantic-FINAL.pdf);
  [Twente record](https://research.utwente.nl/en/publications/fully-automatic-recognition-of-the-temporal-phases-of-facial-acti/)
- Learning to Listen segmented data by speaking/listening turns and used fixed 64-frame windows —
  [learning2listen README](https://github.com/evonneng/learning2listen)

**How much data**
- In "Can Language Models Learn to Listen?", for a listener with less data, a single codebook shared across all
  listeners outperformed a listener-specific VQ-VAE; the authors focused on the listener with the cleanest, longest
  clips (search summary) — [arXiv 2308.10897](https://arxiv.org/pdf/2308.10897)
- Park et al. built a usable personal twin (of attitudes, not faces) from a two-hour interview per person (search
  summary) — [arXiv 2411.10109](https://arxiv.org/abs/2411.10109v1)

**Evaluation**
- REACT ranks on FRCorr and FRRea (2025) (search summary) — [arXiv 2505.17223](https://arxiv.org/html/2505.17223v1);
  REACT 2026 entries report FRCorr, FRDist, FRDiv, FRVar, FRRea, FRSyn (search summary) —
  [CaReDiff](https://huggingface.co/IVPL/CaReDiff)
- Audio2Photoreal ran A/B perceptual tests against ground truth and a baseline, and found evaluators spot subtle
  motion differences better on photoreal avatars than on meshes (search summary) —
  [arXiv 2401.01885](https://arxiv.org/abs/2401.01885)
- Seamless Interaction's paper has a "Human Studies" section (preference vs ground truth); details not retrieved
  (search summary) — [arXiv 2506.22554](https://arxiv.org/html/2506.22554v2)
- Turing-style tests exist for nonverbal behaviour: a gaze-based non-verbal Turing test with a virtual character
  responsive to the participant's gaze (Pfeiffer et al. 2011) — [PMC3212571](https://pmc.ncbi.nlm.nih.gov/articles/PMC3212571/);
  a speed-date study where participants did not detect differences between software-driven and human-driven emotional
  behaviour of a virtual human (search summary; year/venue not shown) —
  [PolyU record](https://ira.lib.polyu.edu.hk/handle/10397/81109?mode=full)

### Inferences
- A practical recording plan for Astra (one row per frame, ~30-60 Hz): her VRCFT Unified Expressions values and eye
  data; her own microphone voice-activity flag; VRChat output-log events (section 5) as context; and her own
  after-the-fact labels ("amused", "awkward", "fake laugh"), mirroring Seamless's first-person internal-state notes.
  The other person's audio or transcript is the most predictive signal in the literature, but it is also the one
  that needs consent (section 6); a consent-free first version can rely on her side plus log events.
- Segment **comets** with a simple onset rule: a comet starts when the summed change in expression weights crosses a
  threshold after a calm period and ends when it returns to baseline; this is the neutral-onset-apex-offset idea
  without a classifier, and an HMM can refine it later.
- "Can friends tell?" can be run as a blind test: show friends (with their consent) short clips of Astra and of
  AI Astra reacting to the same replayed moment and ask which is which; chance level (50%) means the clone passes.
  Normalise against Astra-vs-Astra consistency, as Park et al. did.

### Gaps
- Found no published minimum (hours of data) for a person-specific facial reaction model.
- No study found that uses VR face-tracking blendshapes (rather than video-extracted 3DMM/AUs) as the reaction
  representation.
- No study found of friends judging a clone of someone they know (all perceptual tests found use strangers).

## 4. Methods that fit a framework-free statistical mind

### Takeaway
Everything the deep models do has a classical, framework-free counterpart: **k-means clustering** plays the role of
the VQ-VAE codebook (turning continuous faces into discrete "constellation" tokens), **n-grams** over those tokens play
the role of the language model in "Can Language Models Learn to Listen?", **HMMs** handle onset/apex/offset, and
**nearest-neighbour retrieval** is motion matching. These are small, inspectable and trainable from little data, but
they generalise worse to unseen situations and produce less smooth, less varied motion than diffusion/transformer
models.

### Cited Findings
- The neural systems discretise face motion into a codebook (VQ-VAE) and then predict codes: Learning to Listen —
  [learning2listen README](https://github.com/evonneng/learning2listen); the language-model version treats those codes
  as tokens alongside text (search summary) — [arXiv 2308.10897](https://arxiv.org/pdf/2308.10897)
- HMM-based temporal models of AUs reached 89.2% event recognition on 27 AUs (search summary) —
  [Koelstra et al. 2010](https://www.ibug.doc.ic.ac.uk/media/uploads/documents/PAMI-2010-KoelstraEtAl-CAMERA.pdf);
  CRFs are an alternative graphical model for the same temporal problem (search summary) —
  [BMVC 2014](https://bmva-archive.org.uk/bmvc/2014/files/paper095.pdf)
- Nearest-neighbour retrieval is a standard reaction-generation baseline (NN motion, NN audio) (search summary) —
  [ReactFace arXiv 2305.15748](https://arxiv.org/pdf/2305.15748); neural methods report beating it (search summary) —
  [ReactMotion](https://papers.cool/arxiv/2603.15083)
- Plain retrieval (motion matching) scales poorly in memory with data, which is why Ubisoft learned it (search
  summary) — [Ubisoft La Forge](https://www.ubisoft.com/en-us/studio/laforge/news/3NWqwcMU9lMfumgfPAEfka/learned-motion-matching)
- All reference implementations of the neural methods depend on PyTorch (and PyTorch3D for REACT) —
  [baseline_react2025 README](https://github.com/reactmultimodalchallenge/baseline_react2025);
  [ReactFace README](https://github.com/lingjivoo/ReactFace); [learning2listen README](https://github.com/evonneng/learning2listen)
- With less data, sharing structure across people beat a person-only model (search summary) —
  [arXiv 2308.10897](https://arxiv.org/pdf/2308.10897)

### Inferences
- A framework-free **Astralese** pipeline (working names): (1) k-means over Unified Expressions vectors gives a
  codebook of constellations; (2) a comet is a sequence of constellation tokens; (3) an n-gram or small HMM over
  tokens, conditioned on a context key (event type from the VRChat log, who is speaking, mood), predicts the next
  constellation; (4) or skip prediction and retrieve the nearest whole comet. All of this is NumPy-level or pure
  Python, consistent with the Astral Plane's no-PyTorch core.
- Strengths: tiny data needs, every decision is explainable ("she smiled because this resembled comet #212"),
  easy to delete a recording on request, and outputs can be clamped to an allowlist of parameters (open Decision 7).
- Limits: cannot invent a reaction Astra never made; n-grams lose long-range timing; hand-built context keys miss
  cues that neural models learn from raw audio; token boundaries can cause visible "jumps" unless blended.
- Neural adaptation remains an optional add-on outside the core (e.g. an offline tool that exports a lookup table),
  if Astra later wants it.

### Gaps
- Found no paper that benchmarks n-gram or HMM *generation* of listener reactions against neural models on REACT
  data; comparisons found are only for nearest-neighbour baselines.
- No source found on the right codebook size for VR blendshape data.

## 5. VRChat's output log as reaction context

### Takeaway
VRChat writes plain-text logs named `output_log_*.txt` in `%USERPROFILE%\AppData\LocalLow\VRChat\VRChat\`, one line
per event with a second-resolution local timestamp. The community tool VRCX parses them for player joined/left
(display name and, in newer builds, user ID), world/instance changes, avatar switches, screenshots, video playback,
notifications, vote-kicks, audio-device changes and **OSC start failures**. This gives AI Astra "who arrived, where
are we, what just happened" context without any scraping, but the lines contain other users' names and IDs.

### Cited Findings
- Logs are in the user's AppData LocalLow VRChat folder and named "output_log_(date)" —
  [VRChat Wiki, connection issues](https://wiki.vrchat.com/wiki/Translations:Guides:Connection_issues/45/en)
- VRCX scans the folder for `output_log_*.txt`, sorts by creation time and tails each file —
  [VRCX LogWatcher.cs](https://github.com/vrcx-team/VRCX/blob/master/Dotnet/LogWatcher.cs)
- Line format: `yyyy.MM.dd HH:mm:ss Log        -  [Category] message`; VRCX checks for `-` at column 31 and reads the
  message from column 34; it warns that timestamps do not handle daylight-saving time correctly —
  [VRCX LogWatcher.cs](https://github.com/vrcx-team/VRCX/blob/master/Dotnet/LogWatcher.cs)
- Events VRCX parses (message text after the prefix) —
  [VRCX LogWatcher.cs](https://github.com/vrcx-team/VRCX/blob/master/Dotnet/LogWatcher.cs):
  - `[Behaviour] OnPlayerJoined <DisplayName> (usr_<id>)` and `[Behaviour] OnPlayerLeft <DisplayName> (usr_<id>)`
  - `[Behaviour] Entering Room: <world name>`, `[Behaviour] Joining wrld_<id>:<instance>`, `[Behaviour] OnLeftRoom`,
    `Destination fetching: wrld_<id>`
  - `[Behaviour] Switching <DisplayName> to avatar <avatar name>` (avatar changes, including other players')
  - `[VRC Camera] Took screenshot to: <path>`; video player URL lines (`[Video Playback]`, `[USharpVideo]`)
  - `[API] Received Notification: <...>`; `[ModerationManager]` vote-kick and instance-reset warnings;
    `[StickersManager] User ... spawned sticker`; `uSpeak: SetInputDevice` (microphone change)
  - `Could not Start OSC: Address already in use` (logged as a Warning) and application quit lines
- VRChat accepted a feedback request to change `OnPlayerJoined DisplayName` to `OnPlayerJoined DisplayName (UserID)`;
  VRCX previously had to look up users by display name — [VRChat feedback](https://feedback.vrchat.com/feature-requests/p/provide-userids-in-output-logs)
- VRChat's OnPlayerJoined docs page is a world-scripting (Udon) event, not the log line (search summary) —
  [docs.vrchat.com](https://docs.vrchat.com/docs/onplayerjoined)

### Inferences
- Useful reaction context for comets: player-joined/left (a "hello" or "goodbye" moment), world entry, avatar switches
  by others (a costume change people react to), video starts, vote-kicks (tension). These are exactly the "events"
  column that the research datasets fill with transcripts and annotations.
- Second resolution is coarse next to 30-60 Hz face data, so alignment should be "within about a second", and the
  face recorder should stamp its own frames with the same clock.
- Privacy: before storing, replace display names and `usr_` IDs with salted hashes or roles ("friend A", "stranger");
  the raw log must never be committed.
- Directly useful for Astra's never-fixed OSC problem (another topic): searching her logs for
  `Could not Start OSC: Address already in use` would show whether another app (OSC router, VRCFT, OSCGoesBrrr)
  grabbed VRChat's OSC port first. OSC Sonar could watch for this line.

### Gaps
- No official VRChat specification of the log format exists that I could find; the format is reverse-engineered and
  can change in any update.
- Did not confirm which client version shipped the user-ID suffix, or how long VRChat keeps old log files.
- Did not find whether the log records who is *speaking* (it does not appear in VRCX's parser).

## 6. VRChat rules on bots/AI/OSC automation and recording others; privacy and consent basics

### Takeaway
VRChat's Terms forbid robots, scrapers and "other automated means or interface **not provided by us**" to access the
platform or extract data. OSC *is* VRChat's own interface, but I found **no official VRChat rule** that explicitly
allows or forbids an AI-controlled avatar or account; VRChat's October 2026 AI statement covers content creation, not
AI players. Recording other people's voices is governed by local law (about a dozen US all-party-consent states,
including California and Illinois). Under GDPR, facial-expression data is not automatically "special category"
biometric data unless used to identify someone. General information, not legal advice.

### Cited Findings
**VRChat**
- Terms clause: users may not "use any engine, software tool, agent, device, or mechanism (including any robot,
  spambot, spider, crawler, scraper, or other automated means or interface) not provided by us to access, search,
  or otherwise use any portion of the Platform or to extract data" (search summary) —
  [VRChat Terms of Service](https://hello.vrchat.com/legal)
- VRChat uses automated tools such as Easy Anti-Cheat to look for cheating software and modified clients (search
  summary) — [VRChat Privacy Policy](https://hello.vrchat.com/privacy)
- The Terms, Privacy Policy and Community Guidelines are binding once accepted (search summary) —
  [VRChat Wiki, Legal & Guidelines](https://wiki.vrchat.com/wiki/Community_Guidelines)
- "Regarding AI Usage on VRChat" (7 October 2026; one outlet dates it 28 October): bans misleading (including
  AI-generated) thumbnails; treats translation, grammar help, coding help, AI tools inside Unity/Blender and
  personal-use tools as acceptable; AI labels undecided after a survey of 21,595 responses (search summary) —
  [Kotaku](https://kotaku.com/vr-chat-community-protests-an-influx-of-ai-slop-onto-platform-hurting-discoverability-2000742109);
  [GameBusiness.jp](https://www.gamebusiness.jp/article/2026/10/07/28245.html);
  [FRVR](https://frvr.com/blog/news/vr-chat-refuses-to-add-ai-label-after-95-of-players-voted-for-one-in-official-survey/);
  date conflict: [Mixed News](https://mixed-news.com/en/?p=38727)
- A commercial world-based AI NPC kit advertises running "with no client mods, no OSC, no bot accounts", implying
  sellers see bot accounts as a risk area (vendor claim, not policy) (search summary) —
  [BOOTH AI NPC Kit](https://booth.pm/en/items/8822858)
- A community thread on a location-tracking bot frames consent as the key issue (community discussion, not policy)
  (search summary) — [ask.vrchat.com](https://ask.vrchat.com/t/a-vrchat-location-stalker-tracker-tool-with-consent/44213)
- Users can report Terms or Guidelines violations such as harassment (search summary) —
  [VRChat Help: report someone](https://help.vrchat.com/hc/en-us/articles/360062658553-I-want-to-report-someone)

**Recording law (US)**
- All-party-consent states commonly listed: California, Delaware, Florida, Illinois, Maryland, Massachusetts,
  Montana, Nevada (for phone calls, by court interpretation), New Hampshire, Pennsylvania, Washington; some lists add
  Connecticut, Michigan and Oregon (in-person); counts vary from 9 to about 13 by source (search summary; mostly
  vendor/blog sources) — [Metaverse Law](https://www.metaverselaw.com/two-party-consent-requirements-for-recording-calls/);
  [Rev](https://www.rev.com/blog/phone-call-recording-laws-state);
  [Oxford University Press list](https://learninglink.oup.com/access/content/bender12e-student-resources/bender12e-states-that-require-consent-of-all-parties-for-taping)
- California's rule (Penal Code §632) covers confidential communications; Illinois's statute (720 ILCS 5/14-2)
  covers private conversations (search summary) — [Rev](https://www.rev.com/blog/phone-call-recording-laws-state);
  [Metaverse Law](https://www.metaverselaw.com/two-party-consent-requirements-for-recording-calls/)

**EU (GDPR and AI Act)**
- An academic analysis argues emotion data is not specifically protected under GDPR Article 9: biometric data is
  special category only when processed to uniquely identify a person, so facial-expression emotion recognition
  generally is not, while physiological signals may count as health data (search summary) —
  [arXiv 2309.10776, "EU law and emotion data"](https://arxiv.org/pdf/2309.10776)
- Austria's data protection authority found Clearview AI's extraction of uniquely identifying facial features to be
  special-category processing (identification, not emotion) (search summary) —
  [EDPB news](https://edpb.europa.eu/news/national-news/2023/decision-austrian-sa-against-clearview-ai-infringements-articles-5-6-9-27_hr)
- The EU AI Act defines emotion recognition systems and bans them in workplaces and education from 2 February 2025
  (secondary vendor source; search summary) —
  [SecurePrivacy](https://secureprivacy.ai/blog/gdpr-compliant-emotion-recognition)

**Research practice**
- Research datasets of reactions are gated: MARS needs a signed EULA —
  [baseline_react2025 README](https://github.com/reactmultimodalchallenge/baseline_react2025); Seamless is
  CC-BY-NC — [seamless_interaction GitHub](https://github.com/facebookresearch/seamless_interaction)

### Inferences
- Driving Astra's *own* account's avatar through VRChat's built-in OSC input is arguably "an interface provided by
  us"; running a *separate* always-on AI account, scraping the API, or harvesting other users' data is where the
  Terms' automation clause bites. This is a reading of the text, not a VRChat ruling.
- The lowest-risk design: record only Astra's own face and voice-activity flag, use log events with other users
  pseudonymised, keep everything local and gitignored, and record other people's voices only with their explicit
  consent (which also satisfies all-party-consent states).
- Since AI Astra will act in public spaces, a visible disclosure (avatar name tag or chatbox note that it is an AI)
  would match the direction of VRChat's labelling debate, though no rule requiring it was found.

### Gaps
- Could not fetch VRChat's current Terms, Community Guidelines or Creator Guidelines text (hello.vrchat.com is not
  reachable from this session), so the exact wording on recording other users, bots, and AI-controlled accounts is
  unverified; the automation clause above rests on a search summary.
- Found no official VRChat statement on AI-controlled avatars, AI companions or OSC-driven automation of a player.
- Did not verify the GDPR "household exemption" for purely personal recordings, or how US state laws apply when
  participants are in different states or countries; a lawyer is the right source for both.
- Whether Meta's or VRCFT's terms place limits on storing Quest Pro face-tracking data was not researched here.
