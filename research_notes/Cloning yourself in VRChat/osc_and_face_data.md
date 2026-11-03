# OSC managers, VRChat OSC problems and exact face-tracking data

Research date: 2026-11-03. Primary sources were read as source code or docs source on GitHub. These were shallow clones: VRCFaceTracking at commit `e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd` (2026-11-02), vrchat-community/creator-docs at `5d21ba35600858a2c46a27da4791569f1745faca` (2026-11-02), VRCFaceTracking/docs at `3036f4668322f2364a918a885dc3a72c828359f3` (2026-08-12) and vrchat-community/vrc-oscquery-lib at `095d0c98a88b12bbd6787c4bc5bec159f59bfca6`. docs.vrchat.com, vrcosc.com, feedback.vrchat.com, osc.toys and hexler.net could not be fetched from this session (blocked, or the host was not allowed). Facts from those sites rest on search snippets and are marked "(search summary)".

Short link names used below:
- VRCFT = `https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/`
- CDOCS = `https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/`
- FTDOCS = `https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/`

Every link below is written out in full.

---

## 1. Exact face-tracking names: Unified Expressions shapes, VRCFT v2 avatar parameters, binary encoding, eye and native addresses

### Takeaway
There are two kinds of face data. The first is VRCFT's **88 Unified Expressions base shapes** plus 8 "simple" shapes, sent as avatar parameters named `v2/<Name>` under `/avatar/parameters/` (any prefix is allowed, e.g. `FT/v2/JawOpen`). The second is a new **102-byte blob at `/tracking/face/v1`**: 14 eye keys followed by the same 88 shapes in the same order. VRChat's native face tracking (SDK 3.10.6, 2026-10-30) consumes the blob. When an avatar uses native face tracking, VRCFT **stops sending the `v2/*` avatar parameters** and sends only the blob.

### Cited Findings

**The Unified Expressions enum (88 base shapes, in order).** Source: `VRCFaceTracking.Core/Params/Expressions/UnifiedExpressions.cs` — [UnifiedExpressions.cs @ e3f40dd](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedExpressions.cs)
- Eyes/brows (0–11): EyeSquintRight, EyeSquintLeft, EyeWideRight, EyeWideLeft, BrowPinchRight, BrowPinchLeft, BrowLowererRight, BrowLowererLeft, BrowInnerUpRight, BrowInnerUpLeft, BrowOuterUpRight, BrowOuterUpLeft.
- Nose/cheeks (12–21): NasalDilationRight, NasalDilationLeft, NasalConstrictRight, NasalConstrictLeft, CheekSquintRight, CheekSquintLeft, CheekPuffRight, CheekPuffLeft, CheekSuckRight, CheekSuckLeft.
- Jaw (22–28): JawOpen, JawRight, JawLeft, JawForward, JawBackward, JawClench, JawMandibleRaise.
- Lips (29–43): MouthClosed, LipSuckUpperRight, LipSuckUpperLeft, LipSuckLowerRight, LipSuckLowerLeft, LipSuckCornerRight, LipSuckCornerLeft, LipFunnelUpperRight, LipFunnelUpperLeft, LipFunnelLowerRight, LipFunnelLowerLeft, LipPuckerUpperRight, LipPuckerUpperLeft, LipPuckerLowerRight, LipPuckerLowerLeft.
- Mouth (44–71): MouthUpperUpRight, MouthUpperUpLeft, MouthUpperDeepenRight, MouthUpperDeepenLeft, NoseSneerRight, NoseSneerLeft, MouthLowerDownRight, MouthLowerDownLeft, MouthUpperRight, MouthUpperLeft, MouthLowerRight, MouthLowerLeft, MouthCornerPullRight, MouthCornerPullLeft, MouthCornerSlantRight, MouthCornerSlantLeft, MouthFrownRight, MouthFrownLeft, MouthStretchRight, MouthStretchLeft, MouthDimpleRight, MouthDimpleLeft, MouthRaiserUpper, MouthRaiserLower, MouthPressRight, MouthPressLeft, MouthTightenerRight, MouthTightenerLeft.
- Tongue/throat/neck (72–87): TongueOut, TongueUp, TongueDown, TongueRight, TongueLeft, TongueRoll, TongueBendDown, TongueCurlUp, TongueSquish, TongueFlat, TongueTwistRight, TongueTwistLeft, SoftPalateClose, ThroatSwallow, NeckFlexRight, NeckFlexLeft. A final `Max` entry is a counter, not a shape.
- The eye shapes EyeLookOut/In/Up/Down (Right and Left), EyeClosedRight/Left, EyeDilationRight/Left and EyeConstrictRight/Left are **commented out** of the enum. The comment says they are "used in the UnifiedEye structure" (gaze, openness and pupil) instead — [UnifiedExpressions.cs lines 13–33](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedExpressions.cs)
- There are 8 "simple" derived shapes: BrowUpRight, BrowUpLeft, BrowDownRight, BrowDownLeft, MouthSmileRight, MouthSmileLeft, MouthSadRight, MouthSadLeft — [UnifiedSimpleExpressions.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedSimpleExpressions.cs)
- This session verified by script that **VRChat's native key order for indices 14–101 is identical to VRCFT's enum order for 0–87** (the VRChat table was diffed against the enum) — [CDOCS face-tracking/osc.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/face-tracking/osc.md); [UnifiedExpressions.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedExpressions.cs)

**Avatar parameter naming that VRCFT sends**
- Every base shape and simple shape becomes a parameter named `"v2/" + shape` (e.g. `v2/JawOpen`, `v2/MouthSmileLeft`) — [UnifiedExpressionsParameters.cs, GetAllBaseExpressions / GetAllBaseSimpleExpressions](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedExpressionsParameters.cs)
- The default OSC address prefix is `/avatar/parameters/` and the current version prefix is `v2/`. Parameters without `v2/` are flagged `Deprecated` — [BaseParameter.cs lines 11–12 and 105](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs)
- **Prefixes are the avatar's choice, not VRCFT's.** VRCFT matches the avatar's parameter addresses with the regex `(?<!(v\d+))(/<name>)$|^(<name>)$`. It then sends to whatever full address the avatar has, so `/avatar/parameters/FT/v2/JawOpen` and `/avatar/parameters/v2/JawOpen` both work. If nothing matches, the address falls back to `/avatar/parameters/v2/JawOpen` and the parameter is marked not relevant (not sent) — [BaseParameter.cs constructor and ResetParam](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs). The VRCFT docs confirm that `.../v2/JawOpen`, `...ExamplePrefix/v2/JawOpen` and `...Example/Nest/v2/JawOpen` all load — [FTDOCS parameters.mdx](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/tutorial-avatars/tutorial-avatars-extras/parameters/parameters.mdx)
- Each name is offered as three types: a **Float**, a **Bool** (computed in code as `value < 0.5`) and a **binary-encoded** set of Bools — [ParamContainers.cs, class EParam](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/DataTypes/ParamContainers.cs)
- Vector parameters get `X`/`Y` suffixes. `v2/Eye`, `v2/EyeLeft` and `v2/EyeRight` become `v2/EyeX`, `v2/EyeY`, `v2/EyeLeftX`, `v2/EyeLeftY`, `v2/EyeRightX` and `v2/EyeRightY` (float, bool and binary each) — [ParamContainers.cs EParam(Vector2)](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/DataTypes/ParamContainers.cs); [UnifiedExpressionsParameters.cs "Eye Gaze"](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedExpressionsParameters.cs). The docs give EyeLeftX/Y as normalized Cartesian values from −1 to 1 (right/up positive) — [FTDOCS parameters.mdx lines 72–75](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/tutorial-avatars/tutorial-avatars-extras/parameters/parameters.mdx)
- The combined/compacted v2 parameters, with their formulas in code — [UnifiedExpressionsParameters.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedExpressionsParameters.cs):
  - Pupils: `v2/PupilDilation`, `v2/PupilDiameterLeft`, `v2/PupilDiameterRight`, `v2/PupilDiameter`.
  - Openness: `v2/EyeOpenLeft/Right`, `v2/EyeOpen`, `v2/EyeClosedLeft/Right`, `v2/EyeClosed`, `v2/EyeWide`.
  - **Eyelids:** `v2/EyeLidLeft` = openness×0.75 + EyeWide×0.25 (likewise `v2/EyeLidRight` and `v2/EyeLid`). The docs describe 0–0.75 as openness and 0.75–1 as widen.
  - Squint: `v2/EyeSquint`, `v2/EyesSquint`.
  - Brows: `v2/BrowUp`, `v2/BrowDown`, `v2/BrowInnerUp`, `v2/BrowOuterUp`. **`v2/BrowExpressionLeft/Right`** and `v2/BrowExpression` run from −1 = "Angry" to +1 = "Worried" (code comment).
  - Jaw: `v2/JawX` (right − left) and `v2/JawZ` (forward − backward).
  - Cheeks: `v2/CheekSquint`, `v2/CheekPuffSuckLeft/Right`, `v2/CheekPuffSuck`, `v2/CheekSuck`.
  - Mouth direction: `v2/MouthUpperX`, `v2/MouthLowerX`, `v2/MouthX`.
  - Lips: `v2/LipSuckUpper/Lower`, `v2/LipSuck`, `v2/LipFunnelUpper/Lower`, `v2/LipFunnel`, `v2/LipPuckerUpper/Lower/Right/Left`, `v2/LipPucker`, `v2/LipSuckFunnelUpper/Lower` and `v2/LipSuckFunnel{Lower,Upper}{Left,Right}`.
  - Mouth: `v2/MouthUpperUp`, `v2/MouthLowerDown`, `v2/MouthOpen`, `v2/MouthStretch`, `v2/MouthTightener`, `v2/MouthPress`, `v2/MouthDimple`, `v2/NoseSneer`, `v2/MouthTightenerStretch` and its Left/Right forms.
  - Lip corners: `v2/MouthCornerYLeft/Right`, `v2/MouthCornerY`, **`v2/SmileFrownLeft/Right`** and `v2/SmileFrown` (smile − frown), `v2/SmileSadLeft/Right` and `v2/SmileSad`.
  - Tongue: `v2/TongueX`, `v2/TongueY`, `v2/TongueArchY`, `v2/TongueShape`.
  - Status bools: `EyeTrackingActive`, `ExpressionTrackingActive`, `LipTrackingActive` (no v2 prefix).
- Head parameters: `v2/Head/Yaw`, `v2/Head/Pitch`, `v2/Head/Roll`, `v2/Head/PosX`, `v2/Head/PosY`, `v2/Head/PosZ` — [UnifiedHeadParameters.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/UnifiedHeadParameters.cs)
- Legacy (pre-v2, SRanipal-era) eye names are still supported and marked deprecated: `Eyes`, `LeftEye`, `RightEye`, `LeftEyeLid`, `RightEyeLid`, `CombinedEyeLid`, `LeftEyeLidExpanded`, `EyesWiden`, `EyesSqueeze`, `EyesDilation`, `BrowsInnerUp`, `MouthDimple`, `NoseSneer` and others — [Legacy/Eye/EyeTrackingParams.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/Legacy/Eye/EyeTrackingParams.cs)

**Binary-encoded parameters (`JawOpen1/2/4`, `Negative`)**
- VRCFT looks for **Bool** avatar parameters named `<param><N>`, where N is a power of two (1, 2, 4, 8 …). It turns the float into that many bits, with resolution = 2^(number of bits found); a value above 0.99999 sets all bits. `<param>Negative` (e.g. `v2/JawXNegative`) carries the sign. Without it, negative values are cut to 0. The regex excludes a version number directly before the slash — [BinaryBaseParameter.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BinaryBaseParameter.cs)
- The docs explain that binary parameters trade fidelity for avatar parameter space and "require an advanced setup" — [FTDOCS parameters/types/binary.md](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/tutorial-avatars/tutorial-avatars-extras/parameters/types/binary.md)

**Eye-tracking addresses (VRChat's own OSC eye input)**
- VRCFT sends `/tracking/eye/LeftRightPitchYaw` (Vector4: left pitch, left yaw, right pitch, right yaw) and `/tracking/eye/EyesClosedAmount` (1 − combined openness). It sends them only if the avatar has no VRCFT eye parameters and is not a native full-face-tracking avatar. `/tracking/eye/CenterPitchYaw` is present in the code but commented out — [NativeParameters.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/NativeParameters.cs); [ParamContainers.cs NativeParameter.ResetParam](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/DataTypes/ParamContainers.cs)
- VRChat's OSC Eye Tracking page (search summary) lists `/tracking/eye/LeftRightPitchYaw` (degrees), `/tracking/eye/CenterVec` (normalized, HMD-local), `/tracking/eye/CenterVecFull` (length in meters sets convergence) and `/tracking/eye/EyesClosedAmount`. It says eye behaviour reverts to auto look/blink after 10 s without data and that addresses are case-sensitive — [VRChat OSC Eye Tracking (search summary)](https://docs.vrchat.com/docs/osc-eye-tracking)

**Native face tracking blob `/tracking/face/v1` (October 2026)**
- Address `/tracking/face/v1`, **one OSC blob (type tag `,b`) of exactly 102 bytes**, one unsigned byte per key, decoded as `byte/255`. Send the complete payload every time, with unsupported keys set to 0; VRChat ignores the wrong size. Example: byte 36 = 255 means `JawOpen = 1` — [CDOCS face-tracking/osc.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/face-tracking/osc.md)
- Indices 0–13 are EyeLookOutRight, EyeLookInRight, EyeLookUpRight, EyeLookDownRight, EyeLookOutLeft, EyeLookInLeft, EyeLookUpLeft, EyeLookDownLeft, EyeClosedRight, EyeClosedLeft, EyeDilationRight, EyeDilationLeft, EyeConstrictRight, EyeConstrictLeft. Indices 14–101 are the 88 shapes above — [CDOCS face-tracking/osc.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/face-tracking/osc.md)
- VRChat outputs read-only tracking-status values: `/avatar/parameters/UserEyeTracking`, `/avatar/parameters/UserFaceTracking` and `/avatar/avatarfullfacetracking`. The last one is exposed through OSCQuery and sent after `/avatar/change` — [CDOCS face-tracking/osc.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/face-tracking/osc.md)
- VRCFT builds that same blob in `BinaryFaceDataSender`: `SerializedLength = 102` and `EyeByteCount = 14`, followed by one byte per shape (`clamp(weight,0,1)*255`) — [BinaryFaceDataSender.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/BinaryFaceDataSender.cs); [UnifiedData.cs CopyTo](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Data/UnifiedData.cs). It was added in commit [2f59bce (2026-09-05)](https://github.com/benaclejames/VRCFaceTracking/commit/2f59bceb920bab3fc842cc81b9f2cb0793852be8), with conditionals refined in [56e6849 (2026-09-05)](https://github.com/benaclejames/VRCFaceTracking/commit/56e684959f9b23ef309a10eeb47a723058ce587c)
- **When the avatar reports full face tracking, VRCFT marks every regular avatar parameter as not relevant and sends nothing on `/avatar/parameters/...`.** Only the blob is sent — [BaseParameter.cs ResetParam (`if (avatarInfo.FullFaceTracking) { Relevant = false; return []; }`)](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs). VRCFT reads that flag from the OSCQuery key `avatarfullfacetracking` — [OscQueryAvatarInfo.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/Query/OscQueryAvatarInfo.cs)

### Inferences
- Astralese should use the **102-key order of `/tracking/face/v1`** as its raw "constellation" vector: 14 eye keys plus 88 shapes, one byte (0–255) each. VRChat and VRCFT now share that exact order, so no translation table is needed, and 102 bytes per frame is tiny to log.
- The v2 combined parameters are *derived*: SmileFrown, BrowExpression, EyeLid and the rest are fixed formulas on the 102 raw values. A recorder should store raw values and recompute these on demand, not store them.
- Values read back from avatar parameters are lower fidelity than the raw blob. Bool/binary encodings quantize, and synced floats are 8-bit (see Q2).

### Gaps
- The exact meaning of each gaze byte beyond the code (e.g. whether `EyeLookOutRight` is `Right.Gaze.x` clamped 0–1) was read from VRCFT's `CopyTo`. It was not checked against VRChat's decoder.
- The search-summary list of VRChat's eye-tracking addresses is unconfirmed beyond the four quoted; docs.vrchat.com could not be fetched.

---

## 2. VRChat OSC basics: ports, outputs, OSCQuery, `--osc`, two instances, config JSON, Action Menu, native face tracking

### Takeaway
VRChat **listens on UDP 9000** and **sends to UDP 9001** by default. You can change this with `--osc=inPort:outIP:outPort`. Since **2023.3.1 (August 2023)**, VRChat also supports **OSCQuery**: apps advertise themselves over mDNS (`_osc._udp` + `_oscjson._tcp`), and VRChat opens a separate send stream to each one. Several apps can then receive avatar data without fighting over 9001. Stale per-avatar OSC JSON files in `%appdata%\..\LocalLow\VRChat\VRChat\OSC` are the classic cause of "my parameters don't work". Native face tracking became an SDK feature in Avatars SDK 3.10.6 (2026-10-30) at `/tracking/face/v1`.

### Cited Findings
- Default ports: "we default to receiving on port 9000 and sending on port 9001" — [VRChat OSC Overview (search summary)](https://docs.vrchat.com/docs/osc-overview). VRCFT's own defaults match: `OSCInPort` 9001, `OSCOutPort` 9000, address 127.0.0.1 — [OscTarget.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Models/OscTarget.cs)
- `--osc=inPort:outIP:outPort`: the first value is the port VRChat listens on, the second is the IP for outgoing messages, the third is the outgoing port. The default is equivalent to `--osc=<in port>:<out IP>:<out port>` with in port 9000, out IP 127.0.0.1 (this PC) and out port 9001 — [VRChat Launch Options (search summary)](https://docs.vrchat.com/docs/launch-options)
- `--profile=x` launches VRChat with a separate stored login, "allowing multiple VRChat clients to run simultaneously on different accounts" (profile 0 is the default) — [VRChat wiki Launch Options (search summary)](https://wiki.vrchat.com/wiki/Launch_Options). A VRChat bug report describes OSC-config problems when two clients with different `--profile` values are on one PC in the same world instance — [Canny 1275 (search summary)](https://feedback.vrchat.com/bug-reports/p/1275-reset-osc-does-not-work-have-to-delete-the-file-manually)
- What VRChat sends: on avatar load it sends `/avatar/change` with the avatar ID, then `/avatar/parameters/<name>` values. Built-in parameters are read-only via OSC — [VRChat OSC Avatar Parameters (search summary)](https://docs.vrchat.com/docs/osc-avatar-parameters). VRChat also sends head and wrist VR-system tracking data, with an OSC bundle timestamp, for OSC tracker apps — [vrc-oscquery-lib Readme, "Head & Wrist Receiver"](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/Readme.md)
- OSCQuery arrived in VRChat **2023.3.1 (released 9 August 2023)**. According to the release notes, "VRChat will automatically find OSCQuery apps which support data it can send, and open up a new port to send that data to each supported receiver" — [VRChat 2023.3.1 release notes (search summary)](https://docs.vrchat.com/docs/vrchat-202331); [VRChat OSCQuery docs (search summary)](https://docs.vrchat.com/docs/oscquery)
- VRChat's library advertises the service type `_oscjson._tcp` over Zeroconf and runs an HTTP server returning JSON. When OSC is on, VRChat starts its OSCQuery TCP service at localhost (this PC) on port 9001 by default "or whatever port you have specified". That is TCP, so it is separate from the UDP OSC port. The Monitor example lets you "open up two instances of the app to see VRChat send to both automatically" — [vrc-oscquery-lib Readme](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/Readme.md)
- OSCQuery itself neither sends nor receives OSC; it only lets services find each other and describe what they accept — [vrc-oscquery-lib getting-started.md](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/getting-started.md)
- **How a receiver asks VRChat for data**, shown in both VRChat's sample and VRCFT:
  1. Open a UDP socket on a free port.
  2. Run a small HTTP server whose root JSON lists `/avatar/change` as WriteOnly, type `s`. Its `?HOST_INFO` reply carries `NAME`, `OSC_IP`, `OSC_PORT` and `OSC_TRANSPORT: "UDP"`.
  3. Advertise both `_oscjson._tcp` and `_osc._udp` over mDNS.

  Sources: [MonitorCanvas.cs sample](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/Examples/OSCQueryExplorer-Unity/Assets/OSCQuery/Samples/Monitor/MonitorCanvas.cs); [VRCFT HttpHandler.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/Query/HttpHandler.cs); [VRCFT OscQueryHostInfo.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/Query/OscQueryHostInfo.cs); [VRCFT OscQueryService.cs FirstClientDiscovered](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscQueryService.cs)
- VRCFT finds VRChat by sending an mDNS query for `_oscjson._tcp.local` to 224.0.0.251:5353. It accepts PTR answers whose instance name starts with `VRChat-Client` (or `ChilloutVR-GameClient`). It then reads the avatar from `http://<vrchat-endpoint>/avatar`. A code comment notes that "VRC ALWAYS using 127.0.0.1 as the A record address" — [MulticastDnsService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/mDNS/MulticastDnsService.cs); [OscQueryConfigParser.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OscQueryConfigParser.cs). After the first VRChat client is found, VRCFT unsubscribes from further discovery (`OnVrcClientDiscovered -= FirstClientDiscovered`) — [OscQueryService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscQueryService.cs)
- VRCFT always **sends** to its configured `OutPort` (default 9000) on the configured IP. mDNS discovery does not change the send target — [OscSendService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscSendService.cs)
- **Per-avatar OSC config JSON files.** VRCFT reads `%LOCALAPPDATA%Low\VRChat\VRChat\OSC\<user folder>\Avatars\*.json` — [VRChat.cs line 14](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/VRChat.cs); [AvatarConfigFileParser.cs lines 40–42](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/AvatarConfigFileParser.cs). The VRCFT docs say VRChat's OSCQuery "will only advertise parameters in the static OSC config file". That file is "never updated automatically, it must be reset manually". They list three ways to reset it: Action Menu Options → OSC → "Reset OSC Config"; VRCFT's "Reset VRChat Configs" risky setting (deletes all avatars' JSON); or deleting the `OSC` folder in `AppData\LocalLow\VRChat\VRChat\` — [FTDOCS vrcft.mdx](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/vrcft-software/vrcft.mdx)
- A VRChat bug report says the in-game Reset sometimes does nothing ("No config loaded to reset"), so the files must be deleted by hand — [Canny 1275 (search summary)](https://feedback.vrchat.com/bug-reports/p/1275-reset-osc-does-not-work-have-to-delete-the-file-manually)
- Action Menu: OSC is enabled under Options → OSC → Enabled — [VRCOSC wiki FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ). "OSC Debug" in that menu opens a floating panel that shows incoming OSC, and opening it also turns OSC on — [VRChat OSC Debugging (search summary)](https://docs.vrchat.com/docs/osc-debugging). The OSCQuery library readme notes VRChat changed the OSC toggle so "you may need to turn it on every time you launch" (written in the beta period) — [vrc-oscquery-lib Readme](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/Readme.md)
- Synced parameter budget: "VRChat can synchronize up to 256 bits of custom parameters". Floats and ints cost 8 bits each, bools 1 bit, and synced floats have `1/127` network precision. There is a limit of 8192 total custom parameters — [CDOCS animator-parameters/index.md lines 217–228](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/animator-parameters/index.md)
- **Native face tracking.** Avatars SDK **3.10.6 (dated 2026-10-30)** "brings support for native face tracking". Network-synced face tracking no longer uses the synced parameter budget — [CDOCS releases/release-3.10.6.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/releases/release-3.10.6.md)
  - It is set up in the Avatar Descriptor's Face Tracking section. "Use All Tracking Keys" is required for webcam/OSC full face tracking. The section supports up to 16 meshes, Blendshapes Sets (the highest value wins, they do not add) and Parameter Behaviors. Sync is lossy and depends on distance — [CDOCS face-tracking/index.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/face-tracking/index.md)
  - VRChat's own webcam "Selfie Expression" also drives Unified Expressions — [CDOCS face-tracking/index.md](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/face-tracking/index.md)
  - A client release page "VRChat 2026.4.1" reportedly says the system networks all 102 Unified Expressions values; press coverage says VRCFT's latest Steam beta supports it — [VRChat 2026.4.1 (search summary)](https://docs.vrchat.com/docs/vrchat-202641); [UploadVR (search summary)](https://www.uploadvr.com/vrchat-gets-native-face-tracking-support-in-open-beta/)

### Inferences
- **Two VRChat clients on one PC (Astra plus AI Astra's account):** each needs its own `--profile` and its own `--osc` in/out ports, e.g. `--profile=1` plus `--osc` with in port 9010, out IP 127.0.0.1 (this PC) and out port 9011. Otherwise both try to bind 9000.
  - AI Astra's connector (`embodiment.py`, which sends to VRChat's OSC input) must target the second client's in-port. If it hits 9000, it will move **Astra's own avatar**.
  - VRCFT locks onto the **first** `VRChat-Client*` it hears on mDNS. With two clients running, it could attach to the wrong one for avatar discovery. Starting Astra's client and VRCFT before AI Astra's client lowers the risk (inferred from the code, not tested).
- OSCQuery receivers get their own VRChat send stream, so a new app does not need port 9001 at all. Only legacy (non-OSCQuery) apps need 9001 or a router.

### Gaps
- Whether VRChat still sends to the `--osc` out-port (9001) *in addition* to OSCQuery receivers was not confirmed from a primary source. VRChat's exact rule for "supports data it can send" is also unconfirmed: the samples suggest that advertising `/avatar/change` is enough.
- Whether VRChat emits any face values on its OSC output for native-face-tracking avatars (e.g. values forwarded to the animator) is unknown. The docs only mention the three status outputs.
- The exact `VRChat-Client-XXXXXX` instance-name format, and how two clients name themselves, were not verified.
- VRChat's rules on running two accounts at once (Terms of Service) were not checked; that is outside this topic.

---

## 3. Existing OSC managers, routers and monitors for VRChat, and their 2026 status

### Takeaway
The two main "OSC managers" are **VRCOSC** (VolcanicArts; toolkit plus built-in router, actively released in 2026) and **VOR** (VRChat OSC Router; still beta, last commit July 2024). Both exist because, before OSCQuery, only one app could take 9001. Today the cleaner fix is apps that speak **OSCQuery**: current VRCFT does, and OSCLeash can if `UseOSCQuery: true` is set. For watching traffic, VRChat recommends **Protokol** (monitor) and **TouchOSC** (sender), alongside its built-in OSC Debug panel.

### Cited Findings
| Tool | What it is | 2026 status | Source |
|---|---|---|---|
| **VRCOSC** | "A modular node-programming language, program creator, animation system, toolkit, **router**, and debugger made for VRChat". Includes per-avatar profiles, ChatBox and the Pulse node language. Its router is "designed as a replacement for OSCRouter (and other software like it) with proper support for apps that send larger amounts of data (like VRCFaceTracking)" | Newest tag `2026.906.0`; default-branch last commit 2026-08-07 | [README](https://github.com/VolcanicArts/VRCOSC); [wiki VRCOSC-Router](https://github.com/VolcanicArts/VRCOSC/wiki/VRCOSC-Router); tags via `git ls-remote` on [repo](https://github.com/VolcanicArts/VRCOSC) |
| **VOR** (VRChat OSC Router) | "Allows OSC packets to be routed to multiple OSC applications". It is "meant to be used to route OSC traffic that is RECEIVED from VRChat… VRChat can only send to one port". Each app binds an "App Port" set in VOR. It has a packet filter that drops malformed packets, e.g. avatar parameter names from "animator obfuscation tools" that crash apps. Windows and Linux; written in Rust | Newest tag `0.3.8-beta`; last commit 2024-07-09 (dormant) | [README](https://github.com/SutekhVRC/VOR) |
| **VRC-MultiOSC** (guide) | Setup guide: VRChat → VOR → apps (VRCFT, bHapticsOSC, HRtoVRChat). Its README says it is no longer updated | Unmaintained | [README](https://github.com/NovaVoidHowl/VRC-MultiOSC) |
| **OSC Switch** | Router suggested by OSCLeash for running alongside other OSC apps | Not checked | [OSCLeash README FAQ](https://github.com/ZenithVal/OSCLeash) → [OpenSoundControlSwitch](https://github.com/KaleidonKep99/OpenSoundControlSwitch) |
| **VRCFaceTracking** | Face-tracking bridge. Uses OSCQuery: it binds a random receive port and advertises `_osc._udp` + `_oscjson._tcp` as `VRCFT-<random>`, so it no longer needs 9001 when VRChat's OSCQuery is found. Exposes `/vrcft/settings/forceRelevant` "for external tools to force vrcft to send all parameters" | Very active (commits 2026-11-02/03) | [OscQueryService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscQueryService.cs); [HEAD commit e3f40dd](https://github.com/benaclejames/VRCFaceTracking/commit/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd) |
| **OSCLeash** | Physbone leash locomotion. Default ListeningPort 9001 and SendingPort 9000; `UseOSCQuery` defaults to **false**. Its FAQ answer for running with other OSC apps: set `useOSCQuery` true, or use a router | Tag `v2.2.1`; last commit 2026-07-09 | [README](https://github.com/ZenithVal/OSCLeash) |
| **MagicChatbox** | ChatBox text builder; joins enabled sources and trims to "VRChat's 144-character limit". Its wiki has an "App Options" page for OSC ports | Tag `v0.9.226`; last commit 2026-08-26 | [README](https://github.com/BoiHanny/vrcosc-magicchatbox) |
| **OSCGoesBrrr** | Astra already uses it; the README only points to osc.toys | Tag `v2.1.30`; last commit 2026-09-03 | [repo](https://github.com/OscToys/OscGoesBrrr) |
| **Protokol** (Hexler) | Monitor/logger for OSC; VRChat's docs recommend it "for receiving" | Price/platform not verified (hexler.net unreachable) | [VRChat OSC Overview / OSC Resources (search summary)](https://docs.vrchat.com/docs/osc-resources) |
| **TouchOSC** (Hexler) | Sender/controller; VRChat's docs recommend it for sending | Not verified | [VRChat OSC Overview (search summary)](https://docs.vrchat.com/docs/osc-overview) |
| **VRChat OSC Debug panel** | Built in; shows incoming OSC | Built in | [VRChat OSC Debugging (search summary)](https://docs.vrchat.com/docs/osc-debugging) |
| **vrc-oscquery-lib** | VRChat's official C# OSCQuery library (NuGet `VRChat.OSCQuery`) | Tag `0.0.6`; last commit 2026-06-26 | [Readme](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/Readme.md) |
| **tinyoscquery** (Python) | Python OSCQuery helper; **depends on `zeroconf==0.39.1` and `requests`** (not stdlib) | Tag `0.1.3`; last commit 2024-10-05 | [repo](https://github.com/cyberkitsune/tinyoscquery) (Requirements.txt, setup.py) |
| VrCScalingTool v1.0.3 | Example of a small app that switched to mDNS advertising "eliminating port 9001 conflicts with apps like VRCFaceTracking" | — | [release notes (search summary)](https://github.com/Tazaur/VrCScalingTool/releases/tag/v1.0.3) |

### Inferences
- The OSC manager Astra once downloaded was most likely VOR or VRCOSC; those are the two tools the guides above point to for port conflicts. This is a guess; she would need to confirm.
- In 2026, a router is only needed for **legacy apps that insist on 9001**. If OSCLeash is in her stack with `UseOSCQuery: false` (the default), it binds 9001. That is exactly the kind of quiet conflict OSC Sonar should detect.
- Routers like VOR only fan out VRChat → apps traffic. They do not see VRCFT → VRChat traffic, so they cannot give a recorder the raw face blob.

### Gaps
- Release dates for the newest tags were not fetched; only last-commit dates from shallow clones were.
- It is not confirmed whether VRCOSC's router can also relay app → VRChat traffic (e.g. VRCFT output), or which direction(s) it supports.
- No primary source was reached for Protokol's licence or price, or for current Reddit/Discord FAQ recommendations.

---

## 4. The most common VRChat OSC problems and a plain-language diagnosis checklist

### Takeaway
Most problems fall into four groups:
1. **OSC is off.**
2. **Two apps want the same port.** Only one program can bind a UDP port; the error is "address already in use".
3. **A stale per-avatar OSC JSON.** Parameters are missing or VRCFT loads 0.
4. **The network stack blocks localhost/mDNS.** Firewall, VPN or extra network adapters.

Newer pitfalls in 2026: an avatar with **native face tracking** stops receiving VRCFT `v2/*` parameters by design, and **local test avatars** are unsupported by VRCFT.

### Cited Findings
- VRCOSC's "Things to try first", in order: enable OSC; Reset Config; delete the `OSC` folder in `%appdata%\..\LocalLow\VRChat\VRChat`; change worlds; restart VRCOSC; restart VRChat; disable any VPN; restart the PC — [VRCOSC wiki FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ)
- "Parameters are being received by VRChat in the OSC debug menu, but won't update on my avatar" → delete the `OSC` folder, then disable and enable OSC, "This will force VRChat to regenerate the OSC config for your avatar" — [VRCOSC wiki FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ)
- "Still won't receive data": Windows may have added an extra network adapter; disable unused adapters — [VRCOSC wiki FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ)
- An "address is already in use" error is attributed to "VRChat hanging onto the OSC port". The FAQ's fix is to delete `install.exe` in VRChat's install folder (the FAQ's own advice, not verified) — [VRCOSC wiki FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ)
- VRCFT's own common problems:
  - Crashes on world join or avatar change are caused by an invalid avatar OSC config; clear the OSC folder.
  - "My personally uploaded Avatar loads 0 parameters!" means an old config or no VRCFT parameters; reset the config.
  - Do not change the OSC IP/receive port on VRCFT 5.2.3.0.
  - "Force Relevancy" tests whether VRChat receives anything at all, independent of the avatar.

  Source: [FTDOCS vrcft.mdx](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/vrcft-software/vrcft.mdx)
- VRCFT has a UI string: "Local Test Avatars are not supported and will cause issues" — [Resources.Designer.cs line 441](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking/Strings/Resources.Designer.cs). A forum thread reports OSC parameters working on test avatars but not on published ones, or the reverse (search summary) — [ask.vrchat.com](https://ask.vrchat.com/t/params-osc-work-for-test-avs-but-not-published-avs/24792)
- VRCFT shipped a "Workaround for VRChat ghost parameter issue" (2024-03-31). It now ignores OSCQuery nodes that have no OSC type — [commit 0c01190](https://github.com/benaclejames/VRCFaceTracking/commit/0c01190a55af456ed342438161494bb96e98fa98)
- VRChat can send to only one legacy port; many apps can send *into* 9000 — [VOR README](https://github.com/SutekhVRC/VOR); [VRC-MultiOSC README](https://github.com/NovaVoidHowl/VRC-MultiOSC). VRC-MultiOSC also notes start order matters: VRChat fully loaded first, then the router, then the apps.
- Malformed parameter names, e.g. from animator obfuscation tools, can crash OSC apps; VOR's packet filter exists to drop them — [VOR README](https://github.com/SutekhVRC/VOR)
- A firewall can stop an app "advertising itself via OSC Query" (search summary) — [Billboard wiki Common Issues](https://github.com/Frosty704/Billboard/wiki/Common-Issues)
- The synced budget is 256 bits; face-tracking setups compete for it with other systems (Q2) — [CDOCS animator-parameters](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/animator-parameters/index.md). Users have asked VRChat for 512 bits because of face tracking (feature request, not a change) — [Canny feature request (search summary)](https://feedback.vrchat.com/feature-requests/p/avatar-sdk-512-bits-instead-of-256-bits-face-tracking)
- On native full-face-tracking avatars, VRCFT sends no `/avatar/parameters/*` face values, only `/tracking/face/v1` — [BaseParameter.cs ResetParam](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs)

**Plain-language checklist for Astra's unnamed OSC problem.** Each step is built from the sources above; the "find who holds the port" commands are standard Windows tools, not taken from those sources.
1. **Is OSC on?** Action Menu → Options → OSC → Enabled. After turning it on, rejoin a world. ([VRCOSC FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ))
2. **Does VRChat hear anything?** Open Action Menu → OSC → **OSC Debug**. If values show there but the avatar does not move, go to step 3. If nothing shows, go to step 4. ([VRCOSC FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ); [OSC Debugging (search summary)](https://docs.vrchat.com/docs/osc-debugging))
3. **Stale avatar config.** Close VRChat. Delete the `OSC` folder in `%appdata%\..\LocalLow\VRChat\VRChat`. Start VRChat and load the avatar again. The in-game "Reset Config" sometimes fails, so delete the files by hand. ([FTDOCS vrcft.mdx](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/vrcft-software/vrcft.mdx); [Canny 1275 (search summary)](https://feedback.vrchat.com/bug-reports/p/1275-reset-osc-does-not-work-have-to-delete-the-file-manually))
4. **Two apps fighting over a port.** Look for "address already in use" in any app's log. In a terminal, run `netstat -ano | findstr :9001` (and the same for `:9000`), then look up the PID in Task Manager. Fix it by turning on OSCQuery in apps that have it (VRCFT does by default; OSCLeash needs `UseOSCQuery: true`), or by putting legacy apps behind VRCOSC's router or VOR. ([VOR](https://github.com/SutekhVRC/VOR); [OSCLeash](https://github.com/ZenithVal/OSCLeash))
5. **Firewall, VPN or extra network adapters.** Turn off the VPN, disable unused adapters, and allow the apps through the firewall. mDNS on 224.0.0.251:5353 must work for OSCQuery. ([VRCOSC FAQ](https://github.com/VolcanicArts/VRCOSC/wiki/FAQ); [MulticastDnsService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/mDNS/MulticastDnsService.cs))
6. **VRCFT says 0 parameters.** The avatar has no `v2/` (or legacy) names, the config is stale (step 3), it is a local test avatar, or it is a **native face-tracking** avatar. In the last case, 0 avatar parameters is normal and the face goes through `/tracking/face/v1`. ([FTDOCS vrcft.mdx](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/vrcft-software/vrcft.mdx); [BaseParameter.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs))
7. **Old parameter names.** Names without `v2/` (e.g. `LeftEyeLid`, `EyesX`) are legacy and deprecated. Re-rig with v2 names. ([BaseParameter.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs); [EyeTrackingParams.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Params/Expressions/Legacy/Eye/EyeTrackingParams.cs))
8. **Works for you but others see a frozen face.** You are probably over the 256-bit synced budget; use binary parameters, or switch to native face tracking. ([CDOCS animator-parameters](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/docs/avatars/animator-parameters/index.md); [CDOCS release 3.10.6](https://github.com/vrchat-community/creator-docs/blob/5d21ba35600858a2c46a27da4791569f1745faca/Docs/releases/release-3.10.6.md))
9. **An app crashes on certain avatars.** Suspect malformed parameter names; try VOR's packet filter. ([VOR](https://github.com/SutekhVRC/VOR))
10. **Start order.** Start VRChat fully, then the router, then VRCFT and the other apps. ([VRC-MultiOSC](https://github.com/NovaVoidHowl/VRC-MultiOSC))

### Inferences
- Astra uses OSCGoesBrrr and VRCFT, and probably other OSC apps. Her long-standing problem therefore most likely sits in group 2 (a port conflict, e.g. a legacy app on 9001) or group 3 (a stale config). Steps 2 and 4 of the checklist tell those apart in about two minutes.
- The checklist maps one-to-one onto checks that OSC Sonar could automate: probe whether 9000/9001 are bound and by which process, browse mDNS, compare the avatar JSON against what OSCQuery reports, and watch for `address already in use` in logs.

### Gaps
- No official VRChat "common OSC problems" page could be fetched; a VRChat note on "OSC stopping after avatar change" was not found.
- Astra's actual symptoms are unknown, so the checklist cannot be narrowed further.

---

## 5. Best practice for a new local Python app that READS face-tracking values without breaking VRCFT, VRChat or other apps

### Takeaway
**Recommendation: a small pass-through relay between VRCFT and VRChat for the face data, plus a passive OSCQuery receiver for context.**
- **Relay:** VRCFT out-port changed to e.g. 9100; the relay forwards every packet unchanged to 9000 *before* parsing it. It is the only option that sees the full 102-key face (`/tracking/face/v1`) at VRCFT's full rate. It works for native-face-tracking avatars, which send nothing readable on VRChat's output.
- **OSCQuery receiver:** gives `/avatar/change`, `UserFaceTracking`, `avatarfullfacetracking` and other avatar parameters without ever touching 9001.
- **Fallback / first milestone:** the OSCQuery receiver alone. It carries zero risk, but sees only the `v2/*` parameters that the current avatar has, and none on native-face-tracking avatars.
- **Effort:** a stdlib-only OSC parser is easy. The stdlib mDNS/OSCQuery advertiser is moderate: it needs a multicast responder for PTR/SRV/TXT/A records plus a tiny HTTP JSON server.

### Cited Findings
- VRCFT sends to one fixed endpoint, `DestinationAddress:OutPort` (default: this PC, port 9000), so it can be pointed at a relay port — [OscSendService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscSendService.cs); [OscTarget.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Models/OscTarget.cs). An older guide ran VRCFT with `--osc` set to in port 9000, out IP 127.0.0.1 (this PC) and out port 9200 behind VOR — [VRC-MultiOSC](https://github.com/NovaVoidHowl/VRC-MultiOSC). The current source has no `--osc` argument parser (grep of the repo), so ports are set in VRCFT's settings — [VRCFT repo @ e3f40dd](https://github.com/benaclejames/VRCFaceTracking/tree/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd)
- VRCFT sends the 102-byte blob only when the avatar is full-face-tracking, and the `v2/*` parameters only when it is not — [BinaryFaceDataSender.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/BinaryFaceDataSender.cs); [BaseParameter.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/DataTypes/BaseParameter.cs). `/vrcft/settings/forceRelevant` (bool) makes VRCFT send all non-binary parameters regardless of the avatar — [OscQueryService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscQueryService.cs); [FTDOCS vrcft.mdx "Force Relevancy"](https://github.com/VRCFaceTracking/docs/blob/3036f4668322f2364a918a885dc3a72c828359f3/docs/vrcft-software/vrcft.mdx)
- VRCFT uses VRChat's OSCQuery to find the avatar even though it sends on a fixed port. A relay therefore does not break VRCFT's avatar detection — [OscQueryService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/Services/OscQueryService.cs); [OscQueryConfigParser.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OscQueryConfigParser.cs)
- Routers such as VOR handle only VRChat → app traffic — [VOR README](https://github.com/SutekhVRC/VOR)
- What an OSCQuery receiver must implement, shown by VRChat's sample and VRCFT:
  1. A UDP OSC socket on a free port.
  2. An HTTP server on a free TCP port: root JSON with node `/avatar/change` (ACCESS WriteOnly, TYPE `s`), and a `?HOST_INFO` reply with `NAME`, `EXTENSIONS`, `OSC_IP`, `OSC_PORT`, `OSC_TRANSPORT`.
  3. mDNS adverts for `<name>._oscjson._tcp.local` and `<name>._osc._udp.local` with SRV/TXT/A records, answering queries on 224.0.0.251:5353.

  Sources: [MonitorCanvas.cs](https://github.com/vrchat-community/vrc-oscquery-lib/blob/095d0c98a88b12bbd6787c4bc5bec159f59bfca6/Examples/OSCQueryExplorer-Unity/Assets/OSCQuery/Samples/Monitor/MonitorCanvas.cs); [HttpHandler.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/Query/HttpHandler.cs); [OscQueryHostInfo.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/Query/OscQueryHostInfo.cs); [MulticastDnsService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/mDNS/MulticastDnsService.cs)
  - VRCFT's HTTP handler admits it does not fully implement the protocol ("Not properly implementing oscquery protocol…"). The minimum that works with VRChat is small — [HttpHandler.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/OSC/Query/HttpHandler.cs)
- VRCFT's hand-written mDNS stack (query, advertise, PTR/SRV/TXT/A/NS records, reader and writer) is **683 lines of C#** in total (line count of `VRCFaceTracking.Core/mDNS/`). This is a fair yardstick for a stdlib Python port — [mDNS folder](https://github.com/benaclejames/VRCFaceTracking/tree/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/mDNS)
- The existing Python OSCQuery helper relies on the third-party `zeroconf` package rather than stdlib — [tinyoscquery Requirements.txt](https://github.com/cyberkitsune/tinyoscquery)
- VRChat's A record is always 127.0.0.1, per VRCFT's comment — [MulticastDnsService.cs](https://github.com/benaclejames/VRCFaceTracking/blob/e3f40dd1fdd5e03a645a32691cbf54b4a99afbdd/VRCFaceTracking.Core/mDNS/MulticastDnsService.cs)

**The three options compared**

| Option | Sees raw 102-key face? | Works on native-face-tracking avatars? | Risk to Astra's live face | Port fights | Effort (stdlib) |
|---|---|---|---|---|---|
| A. OSCQuery receiver on VRChat's output | No; only the `v2/*` params the avatar has, quantized | No face values (only status) | None (passive) | None | Moderate (mDNS + HTTP) |
| B. Dedicated port via a router (VOR/VRCOSC) | No (VRChat → app only) | No | Low | Avoided, but adds another app | Easy (plain UDP) |
| C. **Pass-through relay VRCFT → relay → VRChat** | **Yes** (blob, or all floats with forceRelevant) | **Yes** | Medium: if the relay stops, the face freezes until VRCFT is pointed back at 9000 | None (relay owns 9100; VRChat keeps 9000) | Easy (plain UDP) |

### Inferences
- Design rules for the relay, so it cannot "break" anything:
  - Forward each datagram byte-for-byte with `sendto` *first*, then hand a copy to a parser thread through a bounded queue that drops when full.
  - Never rewrite or delay packets.
  - Bind only to 127.0.0.1 (this matches the 127.0.0.1-only rule in `embodiment.py`).
  - Log to a local, git-ignored file, because face recordings must never be committed.
  - Localhost UDP forwarding in Python should add well under a millisecond (estimate, not measured).
- A stdlib OSC 1.0 parser is about 100–150 lines using `struct`: 4-byte-padded address, type tags, `i/f/s/b/T/F` arguments and `#bundle` with an 8-byte timetag. Decoding `/tracking/face/v1` is then `list(blob)` → 102 values ÷ 255. It must reject malformed packets without crashing (see VOR's warning about obfuscated names).
- A stdlib OSCQuery advertiser is **moderate, not hard**:
  - an `http.server` thread for two JSON replies;
  - a UDP socket joined to 224.0.0.251:5353 with `SO_REUSEADDR`, since VRChat and VRCFT also use 5353;
  - hand-built DNS answer packets for PTR/SRV/TXT/A records.
  - Estimate: 250–400 lines of Python. The fiddly parts are DNS name compression, answering the right questions, and Windows multicast quirks.
  - Alternative: allow one small pure-Python dependency (`zeroconf`). That fits the "framework-free core" rule, which bans ML frameworks rather than all libraries, but Astra would need to OK it.
- This relay is the same tool OSC Sonar needs. One shared "OSC tap" module could serve both the face recorder (Astralese constellations and comets) and the OSC diagnostics pet.

### Gaps
- It is untested whether VRChat accepts the blob unchanged through a relay. It should, because UDP payloads are identical, but this has not been run against live VRChat.
- The latency and jitter of a Python relay at VRCFT's send rate (rate not found in the sources) has not been measured.
- It is not verified whether changing VRCFT's out-port in its Settings UI is still supported in current builds; the docs only warn about 5.2.3.0.
