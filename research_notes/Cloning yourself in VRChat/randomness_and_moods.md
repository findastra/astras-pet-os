# Randomness: computers, quantum random bits and humans

*How these notes were sourced (2026-11-03): WebFetch failed for most hosts in this session (DNS blocked: quantumnumbers.anu.edu.au, aka.ms, docs.python.org, plus the hosts already listed as blocked). Facts marked **(read)** were read in the original text on GitHub (CPython docs, IBM's Qiskit documentation repo, qiskit_rng and drand READMEs). Facts marked **(search summary)** rest only on search-result snippets and should be checked before the report states them as settled.*

## Q1. Kinds of random generators, and where an ordinary Windows PC already gets its randomness

### Takeaway
There are four kinds. A **pseudorandom generator (PRNG)** such as Python's `random` (Mersenne Twister) is fast and repeatable but predictable. A **cryptographically secure PRNG (CSPRNG)** such as Windows `BCryptGenRandom` or Python's `secrets`/`os.urandom` cannot be predicted in practice. A **hardware true RNG** measures physical noise; Intel/AMD RDRAND and RDSEED use thermal noise in the chip. A **quantum RNG (QRNG)** measures a quantum process. Astra's Windows PC already gives her CSPRNG output seeded from hardware noise, and nobody outside the machine can predict it.

### Cited Findings
- **PRNG (Python `random`):** the core generator is the Mersenne Twister. It gives 53-bit floats and has a period of 2**19937-1. The docs warn that its "pseudo-random generators ... should not be used for security purposes" and point to `secrets` — **(read)** [CPython docs, random.rst](https://raw.githubusercontent.com/python/cpython/main/Doc/library/random.rst)
- `random` also offers `SystemRandom`, which draws from the operating system's generator — **(read)** [CPython random.rst](https://raw.githubusercontent.com/python/cpython/main/Doc/library/random.rst)
- The `secrets` docs say `random` "is designed for modelling and simulation, not security or cryptography" — **(read)** [CPython docs, secrets.rst](https://raw.githubusercontent.com/python/cpython/main/Doc/library/secrets.rst)
- `os.urandom(size)` returns "random bytes suitable for cryptographic use" from an OS-specific source. On Linux it uses `getrandom()` in blocking mode, so it waits until the kernel has gathered 128 bits of entropy (PEP 524). On Windows it uses `BCryptGenRandom()`. Since Python 3.11 that replaces the deprecated `CryptGenRandom()` — **(read)** [CPython docs, os.rst](https://raw.githubusercontent.com/python/cpython/main/Doc/library/os.rst)
- **Windows CSPRNG:** Microsoft's API reference says the default `BCryptGenRandom` provider follows the CTR_DRBG part of NIST SP 800-90. Before Vista SP1 the default was the older FIPS 186-2 generator — (search summary) [Microsoft BCryptGenRandom reference](https://msdn.microsoft.com/de-de/library/aa375458(v=win.10))
- In 2019 Microsoft published a whitepaper on the Windows 10 RNG infrastructure: its PRNGs, main APIs, entropy system, entropy sources and initial seeding — (search summary) [Microsoft Security blog](https://www.microsoft.com/en-us/security/blog/?p=90228)
- Secondhand description of that whitepaper: the kernel has a root PRNG that seeds one PRNG per logical processor. The root is reseeded from entropy pools that are hashed with SHA-512, and Windows does not estimate entropy. Wikipedia itself marks this passage as uncited — (search summary) [Wikipedia, CryptGenRandom](https://en.wikipedia.org/wiki/CryptGenRandom)
- The Rust `getrandom` crate (used in Firefox) has a code comment that since Windows 10 the user-mode call (ProcessPrng) is guaranteed not to fail at runtime — (search summary) [searchfox, getrandom windows.rs](https://kdab.searchfox.org/firefox-main/source/third_party/rust/getrandom/src/backends/windows.rs)
- **CPU hardware RNG (Intel DRNG):** a self-timed circuit samples thermal noise in silicon at about 3 Gbit/s. An AES-CBC-MAC conditioner turns pairs of 256-bit raw samples into one 256-bit sample. RDRAND passes this through an AES-256 CTR_DRBG; RDSEED gives conditioned seed output — (search summary) [arXiv 2009.03777, "Randomness Concerns When Deploying Differential Privacy"](https://arxiv.org/pdf/2009.03777); [Wikipedia, RDRAND](https://en.wikipedia.org/wiki/RDRAND)
- Intel says the DRNG complies with NIST SP 800-90A/B/C (drafts), FIPS 140-2 and ANSI X9.82. Intel entropy sources hold NIST SP 800-90B entropy validations — (search summary) [Wikipedia, RDRAND](https://en.wikipedia.org/wiki/RDRAND); [NIST CMVP entropy certificate E129](https://csrc.nist.gov/CSRC/media/projects/cryptographic-module-validation-program/documents/entropy/E129_PublicUse.pdf)
- RDRAND arrived in Intel CPUs around 2012 and in AMD CPUs in June 2015. RDSEED is on Intel Broadwell and later and on AMD Zen — (search summary) [Wikipedia, RDRAND](https://en.wikipedia.org/wiki/RDRAND)

### Inferences
- How unpredictable each kind is, in plain terms:
  - **PRNG:** anyone who sees about 624 consecutive 32-bit Mersenne Twister outputs can predict the rest. This is fine for animation and games, and it can be **replayed** from a seed, which helps debugging.
  - **CSPRNG:** with today's cryptography, nobody can tell its output from true randomness or predict it.
  - **Hardware TRNG:** physical noise, conditioned with cryptography.
  - **QRNG:** physical noise whose randomness has a quantum-mechanical explanation. Some designs carry a proof ("certified").
- For an AI character's moods, the CSPRNG already on her PC is far more than enough. Python's stdlib `random` (seeded from `secrets`) is enough too, and it fits The Astral Plane's framework-free core, since it needs no extra packages.
- A hardware TRNG and a QRNG are not opposites. Thermal and shot noise are physical too. The difference is in how the vendor models and proves where the entropy comes from (by quantum measurement versus a physical noise model). Hardware and software generators look the same to a program that consumes their bits.

### Gaps
- I could not open Microsoft's whitepaper (aka.ms was unreachable), so I could not confirm which entropy sources Windows 10/11 mixes in (for example RDRAND/RDSEED, the TPM or interrupt timing), how often it reseeds, or whether it trusts RDRAND alone. The SHA-512/no-entropy-estimate details are secondhand.
- I did not research the Linux kernel's current RNG design.

## Q2. Public randomness services Astra could use right now (2026 status, terms, cost)

### Takeaway
Several free or cheap public sources exist today:
- ANU's quantum vacuum service: a free key gives about 100 requests a month; paid use costs US$0.005 per request on AWS.
- random.org: atmospheric noise, with about 1 million free bits per IP.
- NIST's Beacon 2.0: 512 quantum-derived bits every 60 s, public and not secret.
- drand / League of Entropy: publicly verifiable values every 3 s.
- Cloudflare's LavaRand walls.
- Quantinuum's NIST-validated Quantum Origin, for enterprises.
- ID Quantique's QRNG chip in Korean Samsung phones.

Certified randomness, where the bits are provably fresh even from an untrusted quantum computer, was first shown in Nature in March 2025 on Quantinuum's 56-qubit H2. It needed exascale classical computing to verify, so it is not a hobby tool.

### Cited Findings
| Source | What it is | Terms / cost found | Status of the fact |
|---|---|---|---|
| **ANU Quantum Numbers (AQN)** | ANU's quantum RNG service with an API | Free key: **100 requests/month, 1 request/s** (third-party READMEs). AWS Marketplace since 2022: **up to 100 requests/s at US$0.005 per request**, up to **1024 numbers per request** (decimal or hex), free tier advertised; custom plans negotiable | (search summary) [packagist anu-quantum-random-engine](https://packagist.org/packages/dkzr/anu-quantum-random-engine); [ComfyUI QRNG node docs](https://comfyonline.app/comfyui-nodes/QRNG_Node_ComfyUI); [ITPro, AWS launch](https://itpro.com/cloud/cloud-computing/367492/aws-launches-quantum-random-number-generator); [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/B09SFWPDRJ) |
| **random.org** | True random numbers from **atmospheric noise** | **1,000,000 free bits** per IP, topped up by **200,000 bits/day** at midnight UTC; more can be bought. A 2008 blog gave $1 per million bits (old) | (search summary) [Wikipedia, Random.org](https://en.wikipedia.org/wiki/Random.org); [vvvv blog 2008](https://vvvv.org/blog/random.org); [R `random` package docs](https://cran.rstudio.com/web/packages/random/refman/random.html) |
| **NIST Randomness Beacon 2.0** | Public pulses of **512 bits every 60 s**, signed and timestamped; combines a **photon-detection quantum RNG** with at least two RNGs; past pulses are public | Free REST API. NIST says it is a prototype/beta and "**DO NOT USE BEACON GENERATED VALUES AS SECRET CRYPTOGRAPHIC KEYS**". The spec (NISTIR 8213) is still a draft | (search summary) [NIST CSRC Beacon 2.0](https://csrc.nist.gov/projects/interoperable-randomness-beacons/beacon-20); [NIST Interoperable Randomness Beacons](https://csrc.nist.gov/projects/interoperable-randomness-beacons) |
| **drand / League of Entropy** | Distributed beacon: a threshold of independent nodes produce each value with **threshold BLS signatures**; "publicly verifiable & unbiased" | Free. **quicknet** gives a new value **every 3 s** (live since Oct 2023, replacing fastnet); the original 2019 network ran every 60 s | **(read)** [drand README](https://raw.githubusercontent.com/drand/drand/master/README.md); (search summary) [drand blog, quicknet is live](https://drand.love/blog/2023/10/16/quicknet-is-live); [EPFL news 2019](https://actu.epfl.ch/news/epfl-helps-launch-globally-distributed-randomness-) |
| **Cloudflare LavaRand** | A camera watches **~100 lava lamps** in the San Francisco lobby; images are hashed into seeds and **mixed with Linux OS entropy** on production machines. Other walls: suspended rainbows (Austin), chaotic double pendulums (London), wave machines (Lisbon, 2025) | Internal entropy for Cloudflare, not a sales product | (search summary) [Cloudflare Learning](https://cloudflare.com/learning/ssl/lava-lamp-encryption); [Cloudflare blog, LavaRand in production](https://blog.cloudflare.com/lavarand-in-production-the-nitty-gritty-technical-details); [Cloudflare blog, Lisbon](https://blog.cloudflare.com/chaos-in-cloudflare-lisbon-office-securing-the-internet-with-wave-motion/) |
| **Quantinuum Quantum Origin** | "Software QRNG" made using Quantinuum's quantum computers. On **2 Apr 2025** it received **NIST SP 800-90B validation as an entropy source**, the first software QRNG to do so (vendor claim); can run air-gapped | Enterprise product; no public price found | (search summary) [Quantinuum press release](https://www.quantinuum.com/press-releases/quantinuums-quantum-origin-becomes-first-software-quantum-random-number-generator-to-achieve-nist-validation) |
| **ID Quantique chip in phones** | **Samsung Galaxy Quantum 5** (a Galaxy A55 variant with SK Telecom and IDQ), sold in South Korea only, with a **2.5 × 2.5 mm QRNG chip** feeding Samsung Knox / the Android keystore; about KRW 618,200 (~$465). Earlier models: Galaxy A Quantum (A71 5G, 2020) and later Quantum 2-4 | Coverage dates the Quantum 5 to **Sept 2024**; no 2025 model found | (search summary) [The Quantum Insider, Sept 2024](https://thequantuminsider.com/2024/09/02/sk-telecom-partners-with-id-quantique-for-samsung-galaxy-quantum-5/); [GSMArena](https://m.gsmarena.com/samsung_unveils_the_galaxy_quantum5__a_quantumpowered_secure_smartphone-news-64363.php); [TechSpot, first model](https://www.techspot.com/news/85260-samsung-announces-first-phone-quantum-technology.html) |
| **Certified randomness (Quantinuum H2-56 with JPMorgan)** | Nature, **March 2025**: **at least 71,313 bits of entropy**. Challenge circuits went one at a time to the H2 trapped-ion machine, treated as an untrusted server, with answers required within **~2.5 s**. Classical verification used **~1.1 ExaFLOPS** of supercomputing. Collaborators included Argonne, Oak Ridge and UT Austin. Security holds even against a malicious or impersonated quantum computer | Research result. Quantinuum said it planned to add the protocol to its commercial platforms later in 2025 (not confirmed) | (search summary) [JPMorgan Chase technology blog](https://www.jpmorganchase.com/about/technology/blog/certified-randomness); [R&D World](https://www.rdworldonline.com/nature-paper-details-first-experimental-generation-of-certified-randomness-via-quantum-computer/) |

### Inferences
- **Easiest "real quantum" source for Astra today:** an ANU free key (100 requests a month, up to 1024 numbers each) or the NIST beacon (512 bits a minute, free). Either gives enough bits to seed a local generator many times a day. Neither has to be called inside the VRChat loop.
- The NIST and drand outputs are **public**. Anyone can see the same bits, which is fine for mood variety and bad for secrets. That matches NIST's own warning.
- Certified randomness matters when you **don't trust the box** (lotteries, cryptography audits). A pet's mood has no adversary, so it adds nothing for her beyond the story.

### Gaps
- I could not open ANU's own pricing page (DNS blocked). The 100 requests/month figure comes from third-party READMEs, and the AWS price from 2022 press. Current 2026 terms are unconfirmed. I also could not confirm ANU's physical source from a primary page in this session (it is usually reported as vacuum fluctuations of the electromagnetic field).
- random.org's current price list was not found.
- arXiv 2411.05247, "Traceable random numbers from a nonlocal quantum advantage", turned up in search. It appears to describe a Bell-test-based public beacon, but I could not read it to confirm details or service status.
- I could not confirm whether Quantinuum has launched certified randomness as a product.

## Q3. Making random bits on IBM Quantum hardware with Qiskit (circuit, bits per shot and job, limits, debiasing, QPU time)

### Takeaway
The circuit is one Hadamard on each qubit, then measure all. Each shot gives one raw bit per measured qubit, so 100 qubits × 1,000 shots = 100,000 raw bits in one small job. IBM caps Sampler jobs at **10 million executions** (circuits × shots). Raw bits from cloud superconducting qubits are measurably **biased and correlated**, so they must be post-processed. Von Neumann extraction keeps at most ¼ of the bits; a seeded or cryptographic hash does better. The free Open Plan is **10 minutes per 28-day rolling window** (1 RU = 1 QPU minute). In March 2026 IBM began an opt-in for **180 extra minutes over 12 months**. 100,000 debiased bits should take seconds of QPU time, not minutes. That figure is an estimate to confirm with `usage_estimation`.

### Cited Findings
- **Open Plan:** "Run your quantum circuits on the world's best QPUs for free (the RU equivalent of up to 10 minutes per 28-day rolling window)." Open Plan instances can only be created in us-east — **(read)** [IBM Qiskit docs, plans-overview.mdx](https://raw.githubusercontent.com/Qiskit/documentation/main/docs/guides/plans-overview.mdx)
- "As of 16 March 2026, active Open Plan users can opt in to the RU equivalent of an additional 180 minutes over the next 12 months" (IBM blog "Doubling down on open-access quantum computing") — **(read)** [plans-overview.mdx](https://raw.githubusercontent.com/Qiskit/documentation/main/docs/guides/plans-overview.mdx); blog: [IBM Quantum blog, open-plan-updates](https://www.ibm.com/quantum/blog/open-plan-updates)
- "For standard QPU workloads, 1 RU = 1 minute of QPU compute time." Dry-run jobs report RU use without charging it, but only on Flex, Premium and On-Prem plans, not Open — **(read)** [plans-overview.mdx](https://raw.githubusercontent.com/Qiskit/documentation/main/docs/guides/plans-overview.mdx)
- **Job limits:** "At most, **10 million** executions are allowed for Sampler jobs", where executions = circuits × shots. The old `max_shots` and `max_experiments` backend fields "are no longer relevant or enforced" — **(read)** [Qiskit docs, job-limits.mdx](https://raw.githubusercontent.com/Qiskit/documentation/main/docs/guides/job-limits.mdx)
- "A job's QPU consumption (and therefore, its cost) scales with the number of shots" — **(read)** [Qiskit docs, minimize-time.mdx](https://raw.githubusercontent.com/Qiskit/documentation/main/docs/guides/minimize-time.mdx)
- IBM defines quantum time as the seconds a QPU is committed to a request (primitives only). Its estimate-run-time guide shows one two-qubit Bell-type SamplerV2 job estimated at about **4.1 quantum seconds** (shot count not stated). `job.usage_estimation` gives the estimate for your own job — (search summary) [Qiskit docs preview, estimate job run time](https://qiskit.github.io/documentation/pr-2565/guides/estimate-job-run-time)
- **Measured bias on IBM hardware:** Tamura and Shikano repeatedly ran a Hadamard-based QRNG on the 20-qubit IBM Q 20 Tokyo. Their 43,560-bit sample was **biased and correlated** — (search summary) [IACR ePrint 2020/078](https://eprint.iacr.org/2020/078)
- The same authors tested IBM Q 20 Poughkeepsie output with the **NIST SP 800-22** suite (8,192 shots per qubit). They proposed the tests as a way to check qubit condition and choose which qubits to use, and qubits differed in bias and stability — (search summary) [arXiv 1906.04410](https://arxiv.org/abs/1906.04410v1)
- Researchers have also built device-independent (Bell/Mermin-test) QRNGs on IBM machines — (search summary, title only) [arXiv 2309.05299, "Partial Loopholes Free Device Independent QRNG Using IBM's Quantum Computers"](https://ar5iv.arxiv.org/html/2309.05299)
- IBM's community package **qiskit_rng** generated raw bits on IBM backends, reported a Mermin correlator, and passed the bits to Cambridge Quantum Computing extractors. Its README uses the old `from qiskit import IBMQ` provider — **(read)** [qiskit_rng README](https://raw.githubusercontent.com/qiskit-community/qiskit_rng/master/README.md)
- **Von Neumann extractor:** look at bits in pairs; drop 00 and 11; map 01→0 and 10→1. It shortens the sequence by at least a factor of four — (search summary) [arXiv 2301.11973](https://arxiv.org/pdf/2301.11973)
- **Toeplitz hashing:** a seeded 2-universal hash, provably sound for QRNG post-processing with a min-entropy estimate (Ma et al., Phys. Rev. A 2013). It needs a seed of m+n-1 bits and is much faster than Trevisan's extractor. Seed reuse is a common implementation weakness — (search summary) [arXiv 1207.1473](https://arxiv.org/abs/1207.1473v2); [arXiv 2403.19479](https://arxiv.org/html/2403.19479v1)

### Inferences
- **Circuit (untested sketch, current `qiskit-ibm-runtime` SamplerV2 API):**
  ```python
  from qiskit import QuantumCircuit
  from qiskit.transpiler import generate_preset_pass_manager
  from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
  n = 100                                    # qubits to measure per shot
  qc = QuantumCircuit(n); qc.h(range(n)); qc.measure_all()
  backend = QiskitRuntimeService().least_busy(operational=True, simulator=False)
  isa = generate_preset_pass_manager(backend=backend, optimization_level=1).run(qc)
  job = Sampler(mode=backend).run([isa], shots=4000)
  bits = job.result()[0].data.meas.get_bitstrings()   # 4000 strings of 100 bits
  ```
- **Bits per job:** about (measured qubits) × (shots) raw bits, up to the 10-million-execution cap. A 156-qubit Heron could in principle return about 1.5 billion raw bits per job, so the cap and QPU time limit you before the bit count does.
- **Debiasing yield (math):** if each bit is 1 with probability p and bits are independent, von Neumann keeps p(1−p) output bits per input bit: 0.25 at p = 0.5, and 0.24 at p = 0.6. So 100,000 clean bits needs about 400,000-420,000 raw bits, which is about 4,000-4,200 shots on 100 qubits. Von Neumann assumes **independent** bits, but Tamura and Shikano found correlations. So it is safer to drop the worst qubits, run NIST SP 800-22 style checks, then hash. For example, apply SHA-256 to blocks and keep only half the input length, or use a Toeplitz extractor with a min-entropy estimate.
- **Likely bias direction:** readout tends to read some |1⟩ results as |0⟩ (relaxation during measurement), so raw bits likely lean toward 0. This is reasoning, not measured here; Heron readout error figures were not found.
- **QPU time estimate:** IBM's only worked example is about 4 s for a tiny job. A 4,000-shot, 100-qubit, one-layer circuit is probably still single-digit to low-tens of seconds. So one job gives far more than 100,000 debiased bits and uses well under 1 of her 10 monthly minutes. She should confirm with `job.usage_estimation` on her first job; dry runs are not available on the Open Plan.
- **Cheaper still:** AI Astra needs only one 256-bit seed per session or day. Fetch it once (from IBM, ANU or NIST), store it outside git, and seed a local PRNG with it. Her quantum minutes can then go to more interesting Quantum 10 experiments.

### Gaps
- I found no published readout-error figures for current Heron r2/r3 backends, and no measured QPU-seconds per shot or default `rep_delay` for 2026 IBM systems.
- I could not confirm which processors Open Plan users can reach in November 2026.
- The "4.1 quantum seconds" example comes from a documentation preview build, and its shot count is unknown.

## Q4. Is there any practical reason AI Astra's mood variation needs quantum randomness?

### Takeaway
**No practical reason.** Nobody watching AI Astra in VRChat could tell quantum-seeded mood shifts from shifts seeded by `secrets`, or even by a plain Mersenne Twister. Even NIST and cryptographers treat a properly seeded CSPRNG as unpredictable. A quantum seed has real **symbolic and provenance** value: "her small moods are seeded by a quantum measurement". It is also a fun, low-stakes reason to learn Qiskit. And what makes motion feel human is the **shape** of the noise (Q6), not its source.

### Cited Findings
- Python's own docs place modelling and simulation (games, animation) under `random`, and security under `secrets` — **(read)** [CPython secrets.rst](https://raw.githubusercontent.com/python/cpython/main/Doc/library/secrets.rst)
- `os.urandom` output "should be unpredictable enough for cryptographic applications" — **(read)** [CPython os.rst](https://raw.githubusercontent.com/python/cpython/main/Doc/library/os.rst)
- Certified quantum randomness is worth its cost only because it protects against an adversary, even "a malicious or impersonated" quantum computer — (search summary) [JPMorgan Chase blog](https://www.jpmorganchase.com/about/technology/blog/certified-randomness)
- Even public quantum beacon bits are labelled not for secret keys, because everyone can see them — (search summary) [NIST Beacon 2.0](https://csrc.nist.gov/projects/interoperable-randomness-beacons/beacon-20)
- Cloudflare treats LavaRand as an **additional** entropy source mixed with the OS generator, not a replacement — (search summary) [Cloudflare Learning](https://cloudflare.com/learning/ssl/lava-lamp-encryption)

### Inferences
- **Practical differences, honestly:**
  1. **Unpredictability:** none an observer could detect.
  2. **Replay:** a seeded PRNG lets her **replay** a mood trace exactly, for debugging or comparing AI Astra with her own recorded "comets". True random draws can't be replayed unless she logs the seed. So the best design logs a seed, which turns any source into a replayable one.
  3. **Reliability:** network QRNG calls add latency, quotas and outages. They must never sit in the VRChat OSC loop.
  4. **Volume:** an OU mood update at 10 Hz on two dimensions uses about 72,000 normal draws an hour (about 4.6 million bits at 64 bits each). That is far beyond free QRNG quotas, which is why "quantum seed → local PRNG" is the sensible design.
- **Symbolic value is real and allowed.** It gives AI Astra a story ("born from quantum bits") and a reason to use IBM's free minutes, and the cost is tiny if it's only a daily seed. The research paper should say plainly that it is decoration, not a capability.
- **Proposed design (for the report writer):** at the start of each day or session, take a 256-bit seed from IBM, ANU or NIST, and fall back to `secrets.token_bytes(32)` when offline. Mix it with local entropy (for example SHA-256 of both) and seed `random.Random`. Record only the seed's hash and source label locally, out of git, per the privacy rules. This keeps the core framework-free (stdlib only).

### Gaps
- I found no study testing whether people can tell quantum from pseudorandom variation in a virtual character, and I don't expect one exists; this rests on the math above.

## Q5. "Is that how a human is?" — human variability, randomness and the quantum-brain question

### Takeaway
Humans are **bad** at producing random sequences: they alternate too much and avoid streaks. Human behaviour and timing still vary all the time, and that variation is **structured**. Response-time series often show **1/f ("pink") noise**, meaning slow wandering plus fast jitter. That claim is disputed as universal, but it is common. Blink intervals are **positively skewed (roughly log-normal)**. Neural noise from ion channels, synapses and sensors is a recognised source of trial-to-trial variability. **Quantum-brain** ideas (Penrose-Hameroff Orch-OR; Fisher's Posner molecules) remain **minority, unconfirmed hypotheses**. Decoherence estimates and a 2021 underground test count against the simplest Orch-OR version, while a 2024 rat study gives proponents indirect, contested support. The fair answer to Astra: a human is not a quantum random number generator. A person is a noisy, self-correlated system that drifts around a "home base".

### Cited Findings
- **Producing randomness:** people asked to generate random binary sequences give too many alternations and too few repeats, so their runs are too short (Wagenaar 1972 and later work). Sequences with an alternation rate of about 0.6-0.7 are judged "most random", though a fair coin gives 0.5 — (search summary) [Frontiers in Psychology 2016](https://www.frontiersin.org/articles/10.3389/fpsyg.2016.01027/pdf); [Falk & Konold 1997 (UMass)](https://srri.umass.edu/sites/srri/files/FalkKonold1997/index.pdf)
- Nickerson (2002) reviewed methodological problems in this research, including ambiguous instructions. Others argue the bias reflects attention and working-memory limits: a 2018 study found alternations need more attention to encode — (search summary) [Yu, Osherson & Zhao 2018, QJEP](https://zhaolab.psych.ubc.ca/pdfs/Yu_Osherson_Zhao_2018_QJEP.pdf); [Zhao lab JEP:HPP 2018](https://zhaolab.psych.ubc.ca/pdfs/JEPHPP_2018.pdf)
- **1/f noise in cognition:** Gilden, Thornton and Mallon, "1/f noise in human cognition", *Science* 267 (1995), PMID 7892611 — (search summary) [ModelDB citation record](https://modeldb.science/citations/237744)
- Gilden's account: repeated estimates (time intervals, reaction times) have a 1/f component from internal cognitive processes plus white noise from motor and task sources. The white noise flattens the spectrum at high frequencies — (search summary) [Gilden 2001, "Cognitive Emissions of 1/f Noise", Psychological Review (UT Austin PDF)](https://labs.la.utexas.edu/gilden/files/2016/04/CognitiveEmissionsof1-f.pdf); [PMC9423631, "Understanding the structure of cognitive noise"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9423631/)
- **Contested:** Farrell, Wagenmakers and Ratcliff (2006) concluded that 1/f noise is **not** a ubiquitous property of psychological time series — (search summary) [PubMed 17201378](https://pubmed.ncbi.nlm.nih.gov/17201378); [Wagenmakers, Farrell & Ratcliff 2004 PDF](https://home.cs.colorado.edu/~mozer/Teaching/syllabi/7782/readings/wagenmakers%20farrell%20ratcliff%202004.pdf)
- **Blinks:** in 15 subjects, inter-blink intervals were **log-normally distributed**, with a mean rate of **13.7 ± 7.8 blinks/min**. Topical anaesthesia lowered the rate but kept the shape — (search summary) [Arq. Bras. Oftalmol. 2010](https://www.sidalc.net/search/Record/oai:scielo:S0004-27492010000400005)
- Normal subjects' inter-blink distributions are highly **positively skewed**: mostly short intervals with occasional long gaps. The shape depends on the window length — (search summary) [Clinical Ophthalmology 2013, OPTH.S39104](https://informahealthcare.com/doi/abs/10.2147/OPTH.S39104)
- A leaky integrate-and-fire model with a fluctuating threshold reproduces skewed, normal and peak-less blink-interval distributions. The threshold stands for physiological fluctuations during tasks — (search summary) [PMC6207319 (2018)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6207319/)
- **Neural noise:** Faisal, Selen and Wolpert, "Noise in the nervous system", *Nat. Rev. Neurosci.* 9:292-303 (2008), review noise from molecules to behaviour. They cover how it causes trial-to-trial variability, how the brain counters it, and possible benefits — (search summary) [Wolpert lab PDF](https://wolpertlab.neuroscience.columbia.edu/sites/default/files/content/papers/FaiSelWol08.pdf)
- **Decoherence objection:** Tegmark (2000) estimated decoherence times in the brain of about **10^-13 to 10^-20 s**, far too short to matter for cognition. Hagan, Hameroff and Tuszynski (2002) replied with longer estimates, which still fell short of the milliseconds Orch-OR needs and were themselves disputed — (search summary) [Tegmark, arXiv quant-ph/0005025](https://arxiv.org/abs/quant-ph/0005025); [Hagan et al., Phys. Rev. E 65, 061901](https://www.doi.org/10.1103/PHYSREVE.65.061901); [arXiv quant-ph/0403051](https://arxiv.org/pdf/quant-ph/0403051)
- **Underground test:** a Gran Sasso experiment (arXiv 2111.13490, Nature Physics) ruled out the natural, parameter-free Diósi-Penrose gravity-collapse model. The team called Orch-OR built on that simplest collapse "highly implausible", leaving room for more complex models — (search summary) [Physics World](https://physicsworld.com/a/quantum-theory-of-consciousness-put-in-doubt-by-underground-experiment/); [arXiv 2111.13490](https://www.arxiv.org/pdf/2111.13490)
- **2024 rat study:** Wiest and colleagues (Wellesley) found that the microtubule stabiliser epothilone B delayed isoflurane unconsciousness by **69 s** on average (Cohen's d = 1.9; 8 treated rats). They framed this as consistent with quantum-microtubule models, but it is not a demonstration of quantum effects, and no replication was found — (search summary) [eNeuro 11(8) ENEURO.0291-24.2024](https://www.eneuro.org/content/11/8/ENEURO.0291-24.2024); [PMC11363512](https://pmc.ncbi.nlm.nih.gov/articles/PMC11363512/)
- **Posner molecules:** Fisher (2015, Annals of Physics) proposed that phosphorus nuclear spins entangled inside calcium-phosphate "Posner molecules" could act as neural qubits. A 2019 review notes it is still uncertain whether Posner molecules exist in vivo — (search summary) [arXiv 1508.05929](https://arxiv.org/abs/1508.05929); [arXiv 1910.08423, "Quantum effects in the brain: A review"](https://arxiv.org/pdf/1910.08423)

### Inferences
- **Answer for Astra:** "Truly random" is not how a person feels. People are predictable over the short term (mood inertia, habits, a home base) and surprising over the long term. Their variability is coloured (1/f, skewed intervals), not white. If AI Astra used white quantum noise directly on her face, she would look **less** human, more like twitching.
- The "is it quantum?" question is open but marginal. Most neuroscientists explain behavioural variability with classical (thermal and molecular) noise and chaotic network dynamics. Quantum cognition is an active minority research programme, not established fact. The report should say this with the citations above, not take a side.
- **Link to her core goal:** these are the statistics she can **measure in her own VRCFT recordings** — her blink-interval distribution, the spectrum of her brow and mouth movements, how fast her expression returns to neutral. Fitting them gives AI Astra "Astra-shaped" noise, which is a far stronger cloning signal than where the randomness comes from.

### Gaps
- No source for **Van Orden**'s work (for example Van Orden, Holden and Turvey 2003, on self-organisation and 1/f noise in cognition) turned up in this session's searches, so these notes do not cite it.
- I found no source for whether Faisal et al. discuss photon shot noise in photoreceptors (one place where sensory noise is literally quantum).
- I did not find the outcome of Fisher's lithium-isotope rat replication, or any 2023-2026 Posner-molecule experimental results.
- I found no conversation-specific blink-rate statistics, though the rate is known to change with speaking and listening; the Arq. Bras. figure is for general conditions.

## Q6. Making an AI character's small mood shifts feel human: noise shapes and sources

### Takeaway
Animation and affective-computing research points to three tools:
- **Smooth coherent noise** (Perlin or simplex noise sampled over time) for idle motion and micro-expression "texture". Ken Perlin's 1995 responsive-animation work and Perlin and Goldberg's 1996 **Improv** used noise at every level, from blinking to attitudes.
- **Mean-reverting drift**, the **Ornstein-Uhlenbeck (OU)** process, for mood. Psychologists already model human "core affect" as an OU process around a personal **home base**, with an attractor strength (low strength = high emotional inertia) and volatility.
- **Skewed random intervals** (log-normal) for discrete events such as blinks.

All three run on Python's stdlib, and all three can be **fitted to Astra's own face data**.

### Cited Findings
- Perlin, "Real time responsive animation with personality", *IEEE TVCG* (1995): noise functions drive character parameters, so puppets look lifelike without solving full dynamics. "Because we are conveying just the 'texture' of motion, we are able to avoid computation of dynamics and constraint solvers" — (search summary) [IEEE Xplore 468392](https://ieeexplore.ieee.org/document/468392); year per [Perlin CV](https://cs.nyu.edu/~perlin/doc/vita.html). One search snippet gave 1998; the CV and TVCG volume 1 point to 1995.
- Perlin and Goldberg, "Improv: A System for Scripting Interactive Actors in Virtual Worlds" (SIGGRAPH 96): real-time behaviour-based actors with "personalities and moods consistent with the author's goals". Actors "can also use noise-influenced models for decision making at many levels: ranging from low-level animation triggering (e.g., eye blinking), to mid-level behaviors (e.g., approach/avoid), to high-level attitudes" — (search summary) [NYU MRL Improv project page](https://mrl.cs.nyu.edu/projects/improv/)
- Perlin's SIGGRAPH 2008 Computer Graphics Achievement Award cites the use of "stochastic motion controls to enliven animated characters" — (search summary) [ACM SIGGRAPH History](https://history.siggraph.org/?p=35597)
- Game-dev practice: sampling noise along time gives idle motion and camera shake "that never loops". Most modern code uses Perlin's **simplex** noise. A common recipe is one 1D noise curve per rotation axis, advanced over time — (search summary) [kebaux blog](https://kebaux.bearblog.dev/creating-structure-from-randomness-with-perlin-noise); [GameDev.net thread](https://gamedev.net/forums/topic/672158-using-perlin-noise-for-subtle-random-animationmotion/)
- **OU model of human affect:** Oravecz, Tuerlinckx and Vandekerckhove (2009, *Psychological Methods*) modelled two-dimensional core affect as a continuous-time OU process. Its parameters are a **home base** (mean), the process variances, and regulation that pulls affect back toward home base, and every parameter can differ between people — (search summary) [Penn State QuantDev](https://quantdev.ssri.psu.edu/node/43100); [Psychometrika, hierarchical OU model](https://www.cambridge.org/core/journals/psychometrika/article/hierarchical-ornsteinuhlenbeck-model-for-continuous-repeated-measurement-data/68FE70D713E24865B848DF75E8303C77)
- **DynAffect** (Kuppens, Oravecz and Tuerlinckx, *JPSP* 2010, "Feelings Change") describes affect with an attractor point (home base), attractor strength and reactivity to inputs. Low attractor strength is high **emotional inertia**, which has been linked to poorer emotion regulation and well-being (Kuppens, Allen and Sheeber 2010) — (search summary) [Kuppens et al. 2010 PDF (UCI)](https://sites.socsci.uci.edu/~zoravecz/bayes/data/Articles/Kuppens2010FCAFI.pdf); [PMC6433426](https://pmc.ncbi.nlm.nih.gov/articles/PMC6433426)
- Newer multilevel Bayesian OU models estimate individual homeostatic baseline, regulation and "stochastic volatility" — (search summary) [Penn State SMAC talk, Oravecz 2024](https://science.psu.edu/stat/smac-talks/sp24/oravecz)
- Blink intervals are log-normal or positively skewed (see Q5) — (search summary) [Arq. Bras. Oftalmol. 2010](https://www.sidalc.net/search/Record/oai:scielo:S0004-27492010000400005); [PMC6207319](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6207319/)

### Inferences
- **A three-layer "small moods" recipe for AI Astra** (stdlib-only; times in seconds):
  1. **Mood (slow, minutes):** an OU process on valence and arousal, dx = θ(μ − x)dt + σ dW. Its exact discrete update is x ← μ + (x − μ)e^(−θΔt) + σ·√((1 − e^(−2θΔt))/(2θ))·N(0,1). μ is her home base, ln2/θ is how fast a mood fades (for example 60-300 s), and σ/√(2θ) is how wide it wanders. Events (a greeting, a joke detected by her cognitive core) push x; the OU pull brings it home.
  2. **Expression texture (fast, about 0.2-5 s):** low-amplitude pink-ish noise added to allowed expression weights. Make it from simplex noise, or by summing 3-5 OU processes with log-spaced time constants, which approximates 1/f over that band. Keep it small and clamp to the Decision 7 allowlist.
  3. **Discrete events:** blinks drawn from a log-normal interval distribution. At 13.7 blinks/min the mean interval is about 4.4 s. Shorten it when she "talks" and lengthen it when she "concentrates". The same pattern works for glances and micro-smiles.
- **Fitting to Astra ("cloning herself"):** from her own recorded constellation streams she can estimate μ and θ per expression (how fast her face returns to neutral), the spectral slope of her micro-motion, and her blink log-normal parameters. These numbers are a personal "noise fingerprint" for AI Astra, which fits the DynAffect idea that each person has their own home base, inertia and volatility.
- **Where randomness enters:** every N(0,1) draw and every interval draw comes from one seeded `random.Random(seed)`. Using one seed keeps the whole mood trace replayable, and the seed can be quantum-sourced for the symbolic version (Q4).
- **Safety:** mood noise must only move parameters on Decision 7's allowlist, at low amplitude, and nothing outside it. Which expressions AI Astra may change (the allowlist) is still Astra's decision.

### Gaps
- I did not retrieve affective-computing agent models such as ALMA (Gebhard 2005, mood with decay in PAD space) or WASABI (Becker-Asano, mood as damped dynamics), or the "Eyes Alive" gaze/saccade statistics (Lee, Badler and Badler 2002). These are relevant but uncited here.
- I could not access Perlin's 2002 "Improving Noise" paper or the Improv paper's full text, so details of Improv's noise use come from the project page only.
- I found no empirical study comparing OU or pink-noise mood drift with white noise in user ratings of avatar humanness; the recommendation rests on human-data analogies, not on avatar experiments.
