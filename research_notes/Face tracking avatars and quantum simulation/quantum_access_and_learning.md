# Quantum computing for an individual: hardware timelines, access and cost, learning and community (as of 2026-11-03)

> **How these notes were made (read first).** Web page fetching was blocked in this session: every WebFetch failed with `ENOTFOUND` (www.ibm.com, aws.amazon.com, www.hpcwire.com, www.quantuminvestornotebook.com), so no primary page could be opened. Every finding below comes from web-search result summaries (about 30 searches, 2026-11-03). Each claim links the page the search engine attributed it to, but the exact wording on those pages could not be checked. Company roadmaps are marked **PROMISED**, results that were reported are marked **DELIVERED**, and claims that are thinly sourced are marked **UNCONFIRMED**. Prices should be checked on the vendors' own pricing pages before anyone quotes them.

## 1. Hardware roadmaps as of late 2026: what each company has delivered and what it has only promised

### Takeaway
By late 2026 several companies have shown real error-correction milestones: Google's below-threshold Willow chip, Quantinuum's Helios logical qubits, and Harvard/QuEra's 96-logical-qubit neutral-atom arrays. None of them yet has a fault-tolerant machine that does useful science. The first such machines are promised for **2027 to 2029**: IBM Starling (200 logical qubits), Quantinuum Apollo, Microsoft/Atom Computing Magne, and PsiQuantum's plants. Larger machines (IBM Blue Jay, 2,000 logical qubits) are promised for **2033 or later**. Almost every company has slipped some intermediate date.

### Cited Findings

**IBM (superconducting)**
- **PROMISED (June 2025 roadmap).** The plan runs Loon (2025, test chip for fault-tolerance parts) → Kookaburra (2026, "first modular processor designed to store and process encoded information") → Cockatoo (2027, linking modules) → **Starling (2029): a large-scale fault-tolerant system with 200 logical qubits running 100 million gates, built in Poughkeepsie, NY** → **Blue Jay (2033+): 2,000 logical qubits, 1 billion operations** — [IBM blog: large-scale FTQC](https://www.ibm.com/quantum/blog/large-scale-ftqc); [The Quantum Insider, 2025-06-10](https://thequantuminsider.com/2025/06/10/ibm-offers-roadmap-toward-large-scale-fault-tolerant-quantum-computer-at-new-ibm-quantum-data-center/); [DCD](https://www.datacenterdynamics.com/en/news/ibm-updates-quantum-computing-roadmap-to-deliver-starling-system-by-2029/); [ContentLora IBM Quantum summary](https://contentlora.com/wiki/ibm-quantum). Sources disagree on Blue Jay's date: some say "2033+", others "beyond 2033" — [postquantum.com IBM profile](https://postquantum.com/quantum-computing-companies/ibm/).
- One third party estimates Blue Jay at "likely ~100,000 physical qubits or more". This is an outside inference, not an IBM figure — [Jack Krupansky, Medium](https://jackkrupansky.medium.com/thoughts-on-the-2025-ibm-quantum-roadmap-update-6f45a6009ce8).
- **DELIVERED (2025-11-12).** IBM announced **Nighthawk**: 120 qubits, 218 tunable couplers in a square lattice, and circuits about 30% more complex than Heron's at comparable fidelity. Loon (the test chip with long-range "c-couplers") was announced the same day. IBM restated its target of quantum advantage by the end of 2026 and fault tolerance by 2029 — [Tom's Hardware](https://www.tomshardware.com/tech-industry/semiconductors/ibm-unveils-new-120-qubit-processor-and-software-stack); [Help Net Security, 2025-11-12](https://www.helpnetsecurity.com/2025/11/12/ibm-quantum-nighthawk-processor/); [DCD](https://www.datacenterdynamics.com/en/news/ibm-unveils-nighthawk-quantum-processor-claims-it-will-deliver-large-scale-fault-tolerant-quantum-computer-by-2029/).
- **Status of Kookaburra (the 2026 promise): NOT YET ANNOUNCED.** A third-party scorecard (Q3 2026) found no IBM primary-source announcement of a Kookaburra demonstration as of 2026-10-22. The same scorecard rates Nighthawk's 7,500-gate target for 2026 as met. One tracker describes the first Nighthawk system (Dec 2025) as an early-access preview — [Quantum Investor Notebook IBM scorecard Q3 2026](https://www.quantuminvestornotebook.com/scorecards/ibm). IBM usually updates its roadmap in November, so this may change within weeks (inference, see section 1 Inferences).
- **"Quantum advantage by end of 2026": CONTESTED.** IBM, Algorithmiq, the Flatiron Institute and BlueQubit run an open "quantum advantage tracker" covering observable estimation, variational problems and classically verifiable problems. IBM expects the first advantage claims to be confirmed by the research community by the end of 2026 — [Help Net Security](https://www.helpnetsecurity.com/2025/11/12/ibm-quantum-nighthawk-processor/). IEEE Spectrum reports that IBM and collaborators claimed three instances of quantum advantage on Heron, each with a way to check the result — [IEEE Spectrum](https://spectrum.ieee.org/ibm-verifiable-quantum-advantage); [Quantum Timeline](https://quantumtimeline.org/milestones/2026-ibm-trusted-quantum-advantage/). An analysis of a 77-qubit Heron + Fugaku experiment says calling it advantage "requires some definitional gymnastics" — [PostQuantum](https://postquantum.com/quantum-research/ibm-quantum-advantage-2026-heron-fugaku/).

**Google Quantum AI (superconducting)**
- **DELIVERED (Dec 2024).** Willow is a 105-qubit chip whose error correction worked below threshold: each time the code grid grew (3x3 → 5x5 → 7x7), the logical error rate was cut in half — [Google blog: Meet Willow](https://blog.google/innovation-and-ai/technology/research/google-willow-quantum-chip/).
- **DELIVERED (Oct 2025).** The "Quantum Echoes" algorithm on Willow was presented as a verifiable quantum advantage and "a big step toward real-world applications" — [Google blog: Quantum Echoes](https://blog.google/innovation-and-ai/technology/research/quantum-echoes-willow-verifiable-quantum-advantage/); [Google blog: hardware powering breakthroughs](https://blog.google/innovation-and-ai/technology/research/quantum-hardware-verifiable-advantage/).
- **DELIVERED, secondary coverage only (Science, ~2026-10-15).** "Magic state cultivation" on Willow cut magic-state errors about 40-fold and reached about 99.99% fidelity. Caveats: the 40x is measured against not using cultivation, and only about 8% of attempts are kept — [Quantum Timeline](https://quantumtimeline.org/milestones/2026-google-magic-state-cultivation/); [Interesting Engineering](https://interestingengineering.com/science/google-willow-quantum-chip-magic-state-errors).
- **Roadmap status.** Google's roadmap has six milestones. Two are done: beyond-classical computation (2019) and an error-correction prototype (2023). Willow is working toward **Milestone 3, a long-lived logical qubit**, which has not yet been reported as achieved in peer review. The remaining milestones are a logical gate between logical qubits, scaling up, and a large error-corrected machine (Milestone 6) — [HPCwire, 2024-12-09](https://www.hpcwire.com/2024/12/09/google-debuts-new-quantum-chip-error-correction-breakthrough-and-roadmap-details/); [PostQuantum Google profile](https://postquantum.com/quantum-computing-companies/google/).
- Wikipedia notes that no large-scale quantum algorithms or commercial applications have been demonstrated on Willow — [Wikipedia: Willow processor](https://en.wikipedia.org/wiki/Willow_processor).
- **UNCONFIRMED.** One aggregator headline refers to a Google "neutral atom pivot" in 2026 — [tech-insider.org](https://tech-insider.org/google-quantum-computing-neutral-atom-willow-2026/). I could not verify this.

**Quantinuum (trapped ions)**
- **DELIVERED (launch Nov 2025).** Helios has 98 physical qubits. The launch materials cited 48 fully error-corrected logical qubits; some third-party pages say 50 — [Quantinuum Helios page](https://www.quantinuum.com/products-solutions/quantinuum-systems/helios); [qntonsol summary](https://www.qntonsol.com/learn/quantinuum-helios-98-qubits-and-logical-qubits.html).
- **DELIVERED (Oct 2026).** Helios reached a logical error rate of about 5×10⁻⁶ per error-correction round, using 73 of its 98 qubits for that logical qubit; Quantinuum called it a world record. Color-code experiments showed an average 12x drop in logical memory errors as the code distance grew. Quantinuum extrapolates that about 30,000 physical qubits could give 100 logical qubits, against roughly 900,000 for a superconducting color code; that comparison is contested because Quantinuum counts data qubits only — [HPCwire, 2026-10-19](https://www.hpcwire.com/2026/10/19/quantinuum-says-helios-results-strengthen-its-path-to-apollo/); [PostQuantum: color code on Helios](https://postquantum.com/industry-news/quantinuum-color-code-helios/); [QuantumIndex.jp](https://en.quantumindex.jp/quantinuum-helios-logical-fidelity-999995/).
- **PROMISED.** Sol (2027) is designed for about 100 logical qubits from 192 physical. Its trap chip has come back from fabrication and is in product validation (Q2 2026 results). **Apollo (2029) is "universal, fully fault-tolerant" and "on schedule"** — [Quantinuum Q2 2026 results](https://www.quantinuum.com/press-releases/quantinuum-reports-second-quarter-2026-results); [Quantinuum accelerated roadmap press release](https://www.quantinuum.com/press-releases/quantinuum-unveils-accelerated-roadmap-to-achieve-universal-fault-tolerant-quantum-computing-by-2030).

**IonQ (trapped ions; bought Oxford Ionics)**
- **PROMISED.** In June 2025 IonQ said the combined company expects "256 physical qubits at accuracies of 99.99% by 2026" — [IonQ press release](https://www.ionq.com/news/ionq-announces-agreement-to-acquire-oxford-ionics-accelerating-path-to-pioneering). Newer reporting puts the 256-qubit chip-based system in **Q4 2026**, with its first tape-out received and in foundry fabrication — [Quantum Timeline](https://www.quantumtimeline.org/predictions/ionq-256-qubits-2026/). Tempo is a 64+ qubit system (#AQ64) planned for 2026 — [Quantum Computing Report, 2025 Analyst Day](https://quantumcomputingreport.com/ionq-announces-regulatory-approval-for-oxford-ionics-acquisition-and-provides-a-roadmap-update-at-its-2025-analyst-day-meeting/); [Yahoo Finance](https://finance.yahoo.com/news/ionqs-quantum-roadmap-foundry-strategy-162400233.html).
- **PROMISED, longer term.** A 2026 SEC filing forecasts functional testing of a first 200,000-qubit QPU in 2028 and 2 million physical qubits by 2030 — [IonQ 8-K exhibit, 2026](https://www.sec.gov/Archives/edgar/data/1824920/000119312526021616/d10479dex992.htm).
- **Delivery status:** I found no confirmation that either Tempo or the 256-qubit system has been delivered.

**QuEra / Harvard / MIT (neutral atoms)**
- **DELIVERED (Nature, Nov 2025).** Arrays of up to 448 neutral atoms encoded **up to 96 logical qubits**, with below-threshold error suppression, logical entanglement and mid-circuit qubit reuse — [arXiv neutral-atom review 2608.05010](https://arxiv.org/html/2608.05010v1); [IEEE Spectrum](https://spectrum.ieee.org/neutral-atom-quantum-computing).
- **DELIVERED (Apr 2026, memory only).** qLDPC codes co-designed for neutral-atom hardware brought the ratio of physical to logical qubits down to about **2:1** for storing (not computing on) information — [Quantum Computing Report](https://quantumcomputingreport.com/quera-harvard-and-mit-demonstrate-21-physical-to-logical-qubit-ratio/); [The Quantum Insider, 2026-04-21](https://thequantuminsider.com/2026/04/21/quera-led-study-points-to-ultra-high-rate-quantum-error-correction-moving-closer-to-practical-hardware/).
- **PROMISED, UNCONFIRMED.** QuEra's target for 2026 is more than 10,000 atoms and 100 logical qubits. One source calls it "quite aggressive", and I found no confirmation that it has been met — [PostQuantum QuEra profile](https://postquantum.com/quantum-computing-companies/quera/).

**Atom Computing + Microsoft (neutral atoms)**
- **PROMISED.** "Magne" will have 50 logical qubits built from about 1,200 physical qubits and should be operational by the start of 2027 — [IEEE Spectrum](https://spectrum.ieee.org/neutral-atom-quantum-computing).
- **UNCONFIRMED (June 2026).** Atom Computing reportedly showed a complete toric-code error-correction demonstration in which logical error fell as the system grew. This comes from a secondary source; the date was not checked — [arXiv neutral-atom review](https://arxiv.org/html/2608.05010v1).

**Microsoft Majorana 1 (topological)**
- **DISPUTED.** Nature's editors attached a note to the Feb 2025 paper saying it "does not represent evidence for Majorana zero modes". The claim of a working qubit appeared in the press release, not the paper. A Nature critique by Henry Legg (St Andrews) argues the signals could come from quantum dots. Microsoft says a scalable machine is coming by 2029 — [Science: doubling down](https://www.science.org/content/article/doubling-down-controversial-claims-microsoft-accelerates-quantum-computing-plans); [Science: debate erupts](https://www.science.org/content/article/debate-erupts-around-microsoft-s-blockbuster-quantum-computing-claims); [Wikipedia: Majorana 1](https://en.wikipedia.org/wiki/Majorana_1).
- One 2026 analysis says a newer device's roughly 20-second "qubit lifetime" is a parity lifetime measured on one wire of one qubit in a four-qubit array, using Z-direction measurements only — [PostQuantum: what experts think](https://postquantum.com/quantum-computing/microsoft-majorana-qubit-experts/). I found no independent demonstration of a working topological qubit.

**PsiQuantum (photonics)**
- **DELIVERED (Feb 2025).** PsiQuantum announced Omega, a photonic chipset made at GlobalFoundries. Only fidelity figures have been published; there is no qubit count — [The Quantum Insider](https://thequantuminsider.com/2025/02/26/psiquantum-announces-omega-a-manufacturable-photonic-quantum-computing-chipset/); [InsideDeepTech](https://www.insidedeeptech.com/psiquantum-omega-photonic-quantum-full-guide/).
- **IN PROGRESS, SLIPPING.** Chicago broke ground in Sept 2025. The Australian site moved from Brisbane Airport to Moreton Bay Central and broke ground in June 2026 — [PsiQuantum About](https://www.psiquantum.com/about). Startup Daily reports the Brisbane build is running "very late", possibly up to 12 months — [Startup Daily](https://www.startupdaily.net/topic/global-tech/psiquantums-brisbane-build-is-already-running-very-late/). A secondary guide gives end-2027 as Brisbane's "operational" target and late 2027 at best as the earliest proof — [InsideDeepTech](https://www.insidedeeptech.com/psiquantum-omega-photonic-quantum-full-guide/).

**Rigetti (superconducting)**
- **DELIVERED LATE (2026-04-07).** Cepheus-1-108Q (twelve 9-qubit chiplets) became generally available on Rigetti's cloud and Amazon Braket, a slip from the end of 2025. It launched at a **99.1% median two-qubit fidelity**, against a 99.5% target promised for later in 2026 — [Rigetti investor release](https://investors.rigetti.com/news-releases/news-release-details/rigetti-announces-general-availability-108-qubit-system); [The Quantum Insider, 2026-01-13, delay](https://thequantuminsider.com/2026/01/13/rigetti-delays-108-qubit-cepheus-system/).

**Pasqal (neutral atoms)**
- **CONFLICTING.** Targets reported include about 1,000 physical qubits and 2 logical qubits by end of 2025, about 200 logical qubits by 2030, or 10,000+ physical qubits and 200+ logical qubits by 2029. The same article says the largest published experiments use a few hundred atoms — [PostQuantum Pasqal profile](https://postquantum.com/quantum-computing-companies/pasqal/).

**DARPA Quantum Benchmarking Initiative (QBI): the independent check**
- QBI asks whether any approach can reach utility-scale operation (computational value greater than cost) **by 2033** — [DARPA QBI](https://www.darpa.mil/research/programs/quantum-benchmarking-initiative).
- **2026-10-07:** Atom Computing, Diraq, IBM and IonQ advanced to **Stage C** (final verification). Microsoft and PsiQuantum were already in Stage C through the earlier US2QC program, so Stage C now has six companies. Seven remain in Stage B: **Quantinuum, QuEra, Xanadu, Photonic, Nord Quantique, Quantum Motion and Silicon Quantum Computing**. DARPA says further promotions are expected. IonQ says its Stage C agreement is worth up to $300M — [Quantum Computing Report](https://quantumcomputingreport.com/darpa-selects-atom-computing-diraq-ibm-and-ionq-for-final-stage-c-verification-under-quantum-benchmarking-initiative/); [DCD](https://www.datacenterdynamics.com/en/news/darpa-announces-four-companies-advancing-to-final-stage-of-its-quantum-benchmarking-initiative/); [PostQuantum](https://postquantum.com/industry-news/darpa-quantum-benchmarking-stage-c/).

### Inferences
- The pattern is the same everywhere: error-correction physics has been shown, and machines that use it are promised for 2027 to 2029. Recent slips (Rigetti's 108-qubit launch, PsiQuantum Brisbane, Kookaburra not yet announced) suggest treating every 2029 date as "2029 at the earliest".
- Being in DARPA QBI Stage C is the best available independent signal that a company's plan for useful scale has passed expert review. It shows the plan is credible, not that a machine exists. Quantinuum not being promoted on 2026-10-07 is notable given its strong error-correction record; DARPA says this does not mean it won't advance.
- IBM's yearly roadmap update (usually at its November developer conference) should settle whether Kookaburra was met in 2026. The report writer should flag that this may have changed after these notes.
- For Astra, the practical point is that none of these machines will be sold to individuals. Every company that offers access offers it through the cloud (see section 3), so "waiting for hardware" means waiting for a better cloud backend, not saving up to buy one.

### Gaps
- I could not open IBM's roadmap page, Google's Milestone 3 status, or Quantinuum's and IonQ's newest releases directly (fetching was blocked). All status calls rest on search summaries.
- I found no confirmed IBM Quantum Developer Conference 2026 announcement (Kookaburra, Cockatoo, advantage claims).
- I could not verify whether IonQ's 256-qubit system or Tempo has shipped, whether QuEra met its 2026 targets, or whether Pasqal has a current roadmap.
- I found no independent judgement of whether any "quantum advantage tracker" claim has been accepted by the community.

## 2. Expert estimates: when fault-tolerant machines will do useful scientific simulation beyond classical computers, and how far that is from simulating a universe

### Takeaway
Experts and roadmaps converge on **2028 to 2029 for early fault-tolerant demonstrations** and the **early to mid 2030s for clearly useful, beyond-classical chemistry, materials and physics simulation**. Simulation of physical systems is expected to be among the first useful applications. A realistic 3+1-dimensional simulation of the Standard Model's gauge theories needs an estimated **10⁴ to 10⁸ logical qubits and 10¹⁷ to 10⁵⁶ T gates**. That is far beyond even IBM's 2033+ Blue Jay (2,000 logical qubits, 10⁹ gates). Simulating "our universe" at full fidelity is not on any published roadmap, but small "toy universes" (1+1D lattice gauge models, spin models) can be simulated today.

### Cited Findings
- An industry overview (2026-09-04): roadmaps point to **2028 to 2029 for early fault-tolerant demonstrations** and **the early to mid 2030s for systems capable of commercially valuable computation**, with quantum simulation for chemistry and materials possibly arriving sooner. The timelines "carry substantial uncertainty" — [The Quantum Insider: main challenges, 2026-09-04](https://thequantuminsider.com/2026/09/04/main-challenges-facing-quantum-computing/).
- Research applications in chemistry and materials may gain traction in the late 2020s, with more substantial materials discovery during the 2030s — [Interesting Engineering: which problems, and when](https://interestingengineering.com/innovation/what-problems-will-quantum-computers-solve).
- A resource-focused analysis places physical-system simulation (lattice models, strongly correlated chemistry, spectroscopy, materials dynamics) within about one order of magnitude of what the 2029 roadmaps promise. This is an estimate, not a result — [PostQuantum: Quantum Utility Ladder](https://postquantum.com/quantum-utility-map/quantum-utility-ladder-fault-tolerant-algorithms/). See also [The Grand Challenge of Quantum Applications, arXiv 2511.09124](https://arxiv.org/pdf/2511.09124).
- **Scott Aaronson, a well-known skeptic.** Around 2026-04-30 he reported that some of the most reputable people in hardware and error correction now believe a fault-tolerant machine able to break deployed cryptography "ought to be possible by around 2029" — [PostQuantum: Aaronson warns](https://postquantum.com/security-pqc/aaronson-quantum-warning-nas/). On 2026-08-07 he wrote that "scalable fault-tolerance is still in the future, actual usefulness is still a question, but… the reality of quantum advantage is no longer a live question" — [Shtetl-Optimized, "Enough with all the world-historic milestones"](https://scottaaronson.blog/?p=9979). In Nov 2025 he called a fault-tolerant Shor's-algorithm run before the 2028 US election a "live possibility", later clarifying that factoring 15 would count — [Quantum Timeline](https://quantumtimeline.org/predictions/ut-austin-aaronson-shor-before-2028-election/). A counter-view from Gil Kalai, who doubts that quantum computing can scale — [Gil Kalai, 2026-03-10](https://gilkalai.wordpress.com/2026/03/10/scott-aaronsons-view-of-my-view-about-quantum-computing/).
- **Vendor targets (not independent).** Quantinuum Apollo: universal, fully fault-tolerant by 2029 — [Quantinuum press release](https://www.quantinuum.com/press-releases/quantinuum-unveils-accelerated-roadmap-to-achieve-universal-fault-tolerant-quantum-computing-by-2030). IBM Starling: 2029. Microsoft: scalable machine by 2029 — [Science](https://www.science.org/content/article/doubling-down-controversial-claims-microsoft-accelerates-quantum-computing-plans). DARPA's independent question is whether any approach reaches utility scale **by 2033** — [DARPA QBI](https://www.darpa.mil/research/programs/quantum-benchmarking-initiative).
- **Resource estimates for "universe-like" (lattice gauge theory) simulation:**
  - A 64-site lattice Schwinger model (1+1D quantum electrodynamics, cutoff Λ=8) needs about **333 logical qubits and 5×10¹³ T gates per shot** — [Dalzell et al., "Quantum algorithms: a survey of applications and end-to-end complexities", arXiv 2310.03011](https://arxiv.org/pdf/2310.03011); original analysis in [Shaw et al., arXiv 2002.11146](https://arxiv.org/pdf/2002.11146).
  - For U(1), SU(2) and SU(3) gauge theories in **3+1D** (electromagnetism and the strong force in real space-time dimensions), estimates span **10⁴ to 10⁸ logical qubits and 10¹⁷ to 10⁵⁶ T gates** — reported in the survey above, [arXiv 2310.03011](https://arxiv.org/pdf/2310.03011). I could not identify the original study from search alone.
  - Newer truncation methods bring SU(N) costs down to about 10¹⁰ T gates per Trotter step, and note that older bounds are loose — [arXiv 2503.11888](https://arxiv.org/pdf/2503.11888). Krylov/qubitization methods for the Schwinger model are dominated by non-Clifford gates and are "beyond what currently available devices can run" — [Quantum, 2025-03-25](https://quantum-journal.org/papers/q-2025-03-25-1669/pdf/).
  - **Today, on noisy hardware:** hadron dynamics in the Schwinger model have been simulated using **112 qubits** on current (pre-fault-tolerant) hardware — [Farrell et al., arXiv 2401.08044](https://arxiv.org/pdf/2401.08044); the group publishes regularly — [IQuS (UW InQubator for Quantum Simulation) publications](https://iqus.uw.edu/publications/).

### Inferences
- **"How long until I can simulate the universe?"** Full 3+1D Standard Model physics needs 10⁴ to 10⁸ logical qubits and 10¹⁷+ gates. Starling (2029) has 200 logical qubits and 10⁸ gates; Blue Jay (2033+) has 2,000 and 10⁹. That is a gap of at least 1 to 5 orders of magnitude in qubits and 8+ orders in gates. Simply waiting for hardware probably means decades with no date anyone can defend. No source gives a year for it, and no amount of personal money buys this.
- **What she can do instead, and soon:** the physics community's own path is 1+1D and 2+1D toy models (Schwinger model, Ising and Heisenberg spin chains, small lattice gauge theories). These run today on laptops, gaming GPUs and free cloud QPU minutes (section 3), and will gain the most from the 2029-era machines. Learning to build these models now is exactly what would let her use early fault-tolerant cloud machines when they appear.
- Expect "useful simulation" to arrive gradually rather than on one date: first narrow science results (late 2020s to around 2030), then broader chemistry and materials value (early to mid 2030s).

### Gaps
- I found no single authoritative expert survey (for example a Delphi-style poll) dated 2026 with a median year for "beyond-classical scientific simulation".
- I could not verify the "DOE Quantum Genesis initiative / scientifically relevant fault-tolerant systems by 2028" claim that appeared in one search summary, so I left it out.
- I found no 2026 resource estimate for cosmology-scale or quantum-gravity simulation; the physics researchers on this project may have one.

## 3. Access today: what an individual can use right now, and what it costs

### Takeaway
Astra can run on **real quantum hardware today for $0**. IBM's free Open Plan gives 10 QPU minutes per month (or per rolling 28 days). Open Quantum gives $50 of free QPU credit every 90 days on IonQ, Rigetti, IQM and AQT, and Qollab gives free monthly credits on IonQ Forte. Simulators are free and unlimited: **a 24 GB gaming GPU simulates about 31 qubits exactly with NVIDIA CUDA-Q**. Paid hardware runs from **under $1** (1,000 shots on Rigetti via Braket) to **about $80** (1,000 shots on IonQ Forte), and **$96 per minute** on IBM pay-as-you-go. High-end trapped-ion subscriptions such as Quantinuum through Azure (~$125k/month) are out of reach for an individual, and she doesn't need them.

### Cited Findings
**IBM Quantum Platform**
- **Open Plan (free): up to 10 minutes of QPU runtime.** Sources disagree on whether it renews monthly or on a 28-day rolling window — [IBM Quantum products](https://www.ibm.com/quantum/products); [quantumcomputingcost.com IBM pricing](https://quantumcomputingcost.com/ibm-quantum-pricing/).
- **Pay-As-You-Go: $96 per minute (= $1.60 per second), billed per second, no annual commitment.** Flex is from $72/min and Premium from $48/min, both with annual minimums — [quantumcomputingcost.com IBM pricing](https://quantumcomputingcost.com/ibm-quantum-pricing/); [Rent a quantum computer 2026](https://quantumcomputingcost.com/rent-a-quantum-computer/). These are third-party pages; IBM's page could not be fetched.
- IBM's learning platform provides free access to IBM simulators and real hardware — [Quantum Zeitgeist free resources 2026](https://quantumzeitgeist.com/top-10-free-resources-for-quantum-computing/).

**Amazon Braket** (third-party summaries of AWS's pricing page)
- Pricing is a **$0.30 fee per task** plus a per-shot fee by device:
  - **Rigetti Cepheus-1-108Q $0.000425/shot**, so 1,000 shots ≈ **$0.73**.
  - **IQM Garnet $0.00145/shot**, **IQM Emerald $0.0016/shot**.
  - **IonQ Forte $0.08/shot**, so 1,000 shots ≈ **$80.30**. With error mitigation a minimum of 2,500 shots applies, ≈ **$200.30**.
  - Sources: [quantumcomputingcost.com Braket pricing 2026](https://quantumcomputingcost.com/aws-braket-pricing/); [quantumcomputingcourses.com Braket device comparison](https://quantumcomputingcourses.com/tutorials/braket-device-comparison).
- IonQ Aria and Harmony are reported as retired, leaving Forte as the main IonQ device. Braket added per-device spending caps in Dec 2025 that reject jobs over budget — [quantumcomputingcost.com](https://quantumcomputingcost.com/aws-braket-pricing/).
- QuEra (analog neutral-atom) is also on Braket — [quantumcomputingcost.com](https://quantumcomputingcost.com/aws-braket-pricing/). I did not find its current per-shot price.

**Azure Quantum**
- Each provider sets its own prices. IonQ pay-as-you-go on Azure covers Aria 1 (25 qubits), Forte 1 and Forte Enterprise 1 (36 qubits), and a simulator. **The Quantinuum Standard subscription is listed at USD $125,000/month plus Azure infrastructure** — [Microsoft Learn: Azure Quantum pricing](https://learn.microsoft.com/en-us/azure/quantum/pricing).
- The same 1,000-shot job costs about $0.73 on Rigetti and about $168 on IonQ through Azure with default error mitigation — [quantumtradinglab Substack](https://quantumtradinglab.substack.com/p/how-to-use-a-real-quantum-computer).
- **Free credits: CONFLICTING.** An arXiv paper (Jan 2026) describes $500 of free credit per provider — [arXiv 2601.09943](https://arxiv.org/html/2601.09943v1). A blog dated about 2026-11-02 says Microsoft's Azure Quantum credits program has ended — [quantumtradinglab Substack](https://quantumtradinglab.substack.com/p/how-to-use-a-real-quantum-computer).

**Free and cheap hardware routes through aggregators (vendor-stated terms)**
- **Open Quantum (qBraid partner, announced 2026-07-09): $50 of free credits per new account, refreshed every 90 days, no credit card.** It covers IonQ, Rigetti, IQM and AQT hardware — [Open Quantum / qBraid](https://www.openquantum.com/frameworks/qbraid); [Quantum Zeitgeist](https://quantumzeitgeist.com/qbraid-qpu-compute-quantum-rings/).
- **qBraid:** free account with free simulators; hardware jobs use credits at 100 credits = $1 — [qBraid on-demand pricing docs](https://docs.qbraid.com/v2/home/pricing).
- **Qollab:** 14 simulators and **100 hardware credits every 30 days on IonQ Forte 1 / Forte Enterprise 1** — [Qollab cloud comparison](https://qollab.xyz/explore/quantum-cloud-computing).
- **IonQ direct:** a free account runs IonQ's cloud simulators; hardware access goes through sales or the cloud marketplaces — [Qollab](https://qollab.xyz/explore/quantum-cloud-computing).
- **Quantinuum Nexus:** Helios-1 (98 qubits) is for existing H2 customers, and H2-1/H2-2 (56 qubits each) require you to "register your interest". There is no confirmed self-serve free tier for individuals — [Qollab](https://qollab.xyz/explore/quantum-cloud-computing).
- **Google:** there is no public pay-per-use QPU access. A **Willow Early Access Program** serves selected research partners, and UK researchers reportedly gained access via the National Quantum Computing Centre in Dec 2025 (secondary) — [PostQuantum Google profile](https://postquantum.com/quantum-computing-companies/google/).
- An older but still useful guide from the Unitary Foundation (2022) on running programs on quantum computers for free — [Unitary Foundation](https://unitary.foundation/posts/2022_free_qpu_access).

**Free simulators on her own PC**
- **NVIDIA CUDA-Q:** the `nvidia` GPU target is chosen automatically when a GPU is present and uses FP32 by default. The single-GPU limit in the docs is about 33 qubits (FP32) or 32 (FP64) on a 64 GB card — [CUDA-Q docs: state vector simulators](https://nvidia.github.io/cuda-quantum/latest/using/backends/sims/svsims.html).
- A community benchmark found that the **RTX 4090 (24 GB) and RTX 3090 top out at 31 qubits** for state-vector simulation — [blueqat benchmark: 5090/4090/3090](https://blueqat.com/yuichiro_minato2/74608c73-a292-462a-b10e-ad594283d04e). Google's qsim guidance agrees: a 24 GB GPU can simulate up to 31 qubits — [Google qsim: choosing hardware](https://quantumai.google/qsim/choose_hw).
- Other free software (Qiskit with Aer, Cirq/qsim, PennyLane, Q#) is covered in section 5. All of it is open source and free; prices are not an issue.

### Inferences
- **Cost check (my arithmetic from the prices above):**
  - IBM's free 10 minutes would cost $960 at pay-as-you-go rates.
  - A typical learning-scale experiment (1,000 shots) costs under $1 on Rigetti or IQM via Braket, and $80 to $200 on IonQ Forte.
  - A hobbyist doing a few hardware runs a month could plausibly stay at $0 to $20 a month.
- **Memory math (my arithmetic):** a state vector needs 2ⁿ amplitudes, at 8 bytes each in FP32 or 16 bytes in FP64.
  - 31 qubits in FP32 ≈ 16 GiB, which fits on a 24 GB card. 32 qubits ≈ 32 GiB, which does not.
  - A PC with 64 GB of RAM can hold about 31 qubits in FP64 on the CPU, more slowly.
  - Every added qubit doubles the memory, so no consumer machine goes much past the low 30s exactly. Tensor-network or matrix-product-state simulators can go further for weakly entangled systems, such as many 1D toy-universe models.
- Today's real hardware (100+ noisy qubits) is useful for learning and for research on noise. For the small models she would build first, an exact simulator on her own GPU is often more useful than a noisy QPU.
- Her expectation that she needs "a lot of money" does not fit 2026 prices: the binding limit is skill and time, not cash.

### Gaps
- I could not confirm which IBM processors (for example Heron r2 or r3) are available on the Open Plan in Nov 2026, or whether it renews monthly or every 28 days.
- I could not confirm the AWS Free Tier terms for Braket simulators (SV1/DM1/TN1 per-minute prices and any free hours) or QuEra Aquila's per-shot price on Braket.
- I found no Qiskit Aer GPU limit specific to the RTX 4090, though the memory math is the same.
- I found no published pricing for future fault-tolerant machines (Starling, Apollo, Magne). How much cloud time on them will cost individuals is unknown.

## 4. Owning hardware: personal or desktop quantum devices, what they cost, and whether owning one is realistic or necessary

### Takeaway
The only quantum computers an individual can buy are 2-to-3-qubit NMR teaching machines from SpinQ, at about **$5,000 to $9,000** (Gemini Mini) and around **$44,000** (Gemini Lab). They are classroom demonstrators that "cannot run anything you could not simulate on a phone". Owning a useful quantum computer is neither realistic nor necessary: the industry delivers useful machines through the cloud.

### Cited Findings
- **SpinQ Gemini Mini (2-qubit portable NMR):** sold in Japan through the Switch Science store at ¥1,188,000 (≈ US$8,700) — [PC Gamer](https://www.pcgamer.com/you-can-buy-a-portable-quantum-computer-for-under-dollar9k/); [Fintech.am](https://www.fintech.am/worlds-first-portable-quantum-computers-on-sale-in-japan-prices-start-at-8700/?lang=en). Other figures:
  - "From $8,000" — [Air Mail review](https://airmail.news/issues/2025-1-4/a-quantum-leap-year).
  - "Around $5,000" — [SpinQ's own cost article](https://www.spinquanta.com/news-detail/cost-of-quantum-computer); [Yole Group teardown](https://www.yolegroup.com/product/report/spinq-gemini-mini-quantum-computer/).
  - A 2026 price list gives ¥1,408,000 (≈ $8,900), the Japanese unit as sold out on 2026-10-29, and the orderable successor **SpinQ Gemini Lab at about $44,000** — [quantumcomputingcost.com price list](https://quantumcomputingcost.com/quantum-computer-price-list/).
- The same 2026 guide says these 2-qubit units "cannot run anything you could not simulate on a phone" — [quantumcomputingcost.com price list](https://quantumcomputingcost.com/quantum-computer-price-list/).
- The useful machines (Helios, Nighthawk, Willow, Cepheus) are reached through clouds and access programs, not sold to individuals (section 3) — [Qollab](https://qollab.xyz/explore/quantum-cloud-computing); [Microsoft Learn: Azure Quantum pricing](https://learn.microsoft.com/en-us/azure/quantum/pricing).

### Inferences
- A Gemini Mini costs about as much as several years of heavy cloud use and does less than her gaming GPU. Its only real value is the tactile, teaching side of handling a physical device.
- Fault-tolerant machines need cryogenic plants, laser systems or photonic factories (PsiQuantum is building whole facilities, section 1). Even in the 2030s, individuals will almost certainly reach them by renting time, the way people rent cloud GPUs today.
- For her goal, the money question is "how much cloud time, and when", not "how much to buy a machine".

### Gaps
- I found no 2026 list price for IBM System One/Two or other on-premises enterprise systems. Those sales are custom contracts, and the prices are not public.
- I could not confirm a current direct-from-SpinQ price for Gemini Mini or Triangulum.

## 5. Learning paths: free courses, textbooks and certifications

### Takeaway
A complete self-taught path is free:
- **Quantum Country** (spaced-repetition essays) for intuition.
- **IBM Quantum Learning**, including "Basics of Quantum Information", plus Qiskit, for the main course and real-hardware practice.
- The **PennyLane Codebook** and the **Microsoft Quantum Katas** for hands-on exercises.
- **Nielsen & Chuang** as the reference textbook.

The **IBM Qiskit v2.x Developer certification (exam C1000-179)** is the one widely recognised credential. It costs about $200 according to an older IBM page, and it is the entry requirement for higher tiers of the Qiskit Advocate program.

### Cited Findings
- **IBM Quantum Learning:** IBM's official learning hub of interactive lessons and courses on quantum information and Qiskit, with free access to simulators and real hardware. **Basics of Quantum Information** is IBM's free interactive introduction for learners who want theory before coding — [Quantum Zeitgeist: free resources 2026](https://quantumzeitgeist.com/top-10-free-resources-for-quantum-computing/); [quantumcomputingcourses.com free courses](https://quantumcomputingcourses.com/free-quantum-computing-courses).
- **PennyLane Codebook:** free, hands-on, in the browser, chapter by chapter; covers quantum computing and quantum machine learning — [Quantum Zeitgeist](https://quantumzeitgeist.com/top-10-free-resources-for-quantum-computing/).
- **Microsoft Quantum Katas:** self-paced Q# exercises, now inside the free Quantum Development Kit extension for VS Code — [Quantum Zeitgeist](https://quantumzeitgeist.com/top-10-free-resources-for-quantum-computing/); [Qolour learning list](https://www.qolour.com/learning).
- **Quantum Country:** a reading-first essay with embedded spaced-repetition review questions "so the ideas actually stick" — [Quantum Zeitgeist](https://quantumzeitgeist.com/top-10-free-resources-for-quantum-computing/).
- The old **Qiskit Textbook** is archived on GitHub, and IBM Quantum Learning is its successor. You do not need a physics or computer-science degree to start — [quantumcomputingcourses.com: for beginners](https://quantumcomputingcourses.com/quantum-computing-for-beginners); [Real Python: Qiskit basics](https://realpython.com/quantum-computing-basics/).
- A community-maintained self-study book list (includes Nielsen & Chuang) — [GitHub poig/Qc_book_list](https://github.com/poig/Qc_book_list).
- **Certification:** "IBM Certified Quantum Computation using Qiskit v2.X Developer – Associate", listed at **$200 USD** on IBM's page (the page appears to be about 22 months old) — [IBM certification page](https://www.ibm.com/training/certification/ibm-certified-quantum-computation-using-qiskit-v2x-developer-associate-C9008400).
  - Unofficial price figures are lower: $100 ([Udemy practice exams](https://www.udemy.com/course/practice-exams-ibm-quantum-developer-certification-exam/)) and "$30, varies by region" ([PowerKram](https://powerkram.com/exams/ibm/c9008400-qiskit-v2-developer/)).
  - Reported format: 68 questions in 90 minutes, with 47 correct (about 69%) needed to pass — [PowerKram](https://powerkram.com/exams/ibm/c9008400-qiskit-v2-developer/).
- Paid, in-person prep exists: Elevate Quantum's Qiskit certification course at Arapahoe Community College costs $499, and scholarships are available — [Elevate Quantum](https://www.elevatequantum.org/events/quantum-ibm-qiskit-developer-certification-course).
- Qiskit says you can contribute to Qiskit "with just a few basic web development skills", with no physics required — [Qiskit on X](https://x.com/qiskit/status/1521853593686614017).

### Inferences
- **Suggested order for someone who already codes (Unity/C#, AI tools):**
  1. Quantum Country essays, for intuition.
  2. IBM "Basics of Quantum Information", for the linear algebra and the Euler-formula phases. Other researchers cover the math.
  3. Qiskit tutorials on a local simulator, then her free IBM minutes.
  4. The PennyLane Codebook or the Katas for drills.
  5. A first "toy universe" project: Trotterised time evolution of an Ising chain or a Schwinger model on her GPU with CUDA-Q.
  6. Optionally, the Qiskit certification as a credential for community programs.
- Her developer background matters: the documentation, visualisation and tooling side of open-source quantum projects is a recognised way in (see the Qiskit quote above).

### Gaps
- I could not open the official pages for IBM Quantum Learning, Quantum Country, the Katas or the PennyLane Codebook to confirm their 2026 course lists. The descriptions above come from third-party guides.
- The certification's current price is unconfirmed (IBM's page may be outdated).
- I did not find current Brilliant or edX quantum course prices; I ran no search for them.

## 6. Community, mentorship and funding for independent people

### Takeaway
There are real, low-barrier ways in for unaffiliated people:
- **Unitary Foundation $4,000 microgrants** for open-source quantum projects. A 2026 Riverlane-backed **Deltakit Community Fund** gives up to $4k plus mentorship for open-source error-correction work.
- **QOSF's free mentorship program**, which runs cohorts in October.
- The **Qiskit Advocate program**, whose QAMP 2026 cohort runs Nov 2026 to Feb 2027 for Tier 1+ advocates.
- Large **online-friendly hackathons**: MIT iQuHACK (Jan/Feb, 1,400+ participants from 76 countries in 2026) and QHack (Oct, $67k prize pool).

Well-documented stories of self-taught hobbyists becoming quantum contributors are scarce in the sources I could reach.

### Cited Findings
**Funding**
- **Unitary Foundation microgrants: $4k cash grants** for projects that help the quantum ecosystem, including open-source software, educational materials and workshops — [Unitary Foundation GitHub Sponsors page](https://github.com/sponsors/unitaryfoundation); [Unitary Foundation grants](https://unitary.foundation/grants).
- A micrograntee (OrangeQS) later became a supporting member of the foundation, an example of a microgrant growing into a lasting relationship — [Unitary Foundation, 2025](https://unitary.foundation/posts/2025_orangeqs_membership_announcement/).
- **Deltakit Community Fund (Riverlane + Unitary Foundation, 2026):** up to $4k plus mentorship for open-source quantum error-correction work. Applications are reviewed monthly; the first review was the week of 2026-08-17 — [Unitary Foundation: Deltakit fund](https://unitary.foundation/community/deltakit_community_fund/). Quantum Computing Report describes the awards as $2k to $4k — [QCR](https://quantumcomputingreport.com/riverlane-and-unitary-foundation-launch-deltakit-community-fund-for-open-source-qec/); [Open Source For You, 2026-07](https://www.opensourceforu.com/2026/07/riverlane-unitary-foundation-launch-deltakit-for-open-source-quantum-infrastructure/).
- The foundation's mid-2026 update covers leadership changes, joint ecosystem reports and expanded open-source research — [Unitary Foundation 2026 6-month update](https://unitary.foundation/posts/2026_q1_q2).

**Mentorship**
- **QOSF Quantum Computing Mentorship Program:** connects "quantum enthusiasts" with mentors from academia and industry, aims at an open-source project, and prefers Python. Applicants complete screening "homework tasks" within two weeks of applying. Cohort 10 started in Oct 2024 (mentee deadline 2024-10-28) — [QOSF mentorship page](https://qosf.org/qc_mentorship/). Cohort 11 opened in Oct 2025 with a deadline of 2025-10-17 — [QOSF on X](https://x.com/qosfoundation).
- **Qiskit Advocate program 2.0 (relaunched July 2025):** recognises people who contribute to the Qiskit ecosystem. Everyone starts at Tier 0 (onboarding and training). **Moving past Tier 0 requires the Qiskit v2.x developer certification ("a hard requirement").** Tier 1 adds recognition and the **Qiskit Advocate Mentorship Program (QAMP)**. Applications are open year-round and reviewed monthly — [IBM: Qiskit advocate program](https://ibm.com/quantum/blog/qiskit-advocate-program); [HPCwire, 2025-07-29](https://www.hpcwire.com/2025/07/29/ibm-launches-qiskit-advocate-program-2-0/); [a Tier 1 advocate's write-up](https://schrodinteq.github.io/how-i-became-a-qiskit-advocate-tier1/); [Qiskit Advocate application guide](https://github.com/qiskit-advocate/application-guide).
- **QAMP 2026:** the cohort runs Nov 2026 to Feb 2027, and mentees must be Tier 1+ Qiskit Advocates — [GitHub qiskit-advocate/qamp-2026](https://github.com/qiskit-advocate/qamp-2026).

**Hackathons and challenges**
- **MIT iQuHACK 2026 (7th annual, 2026-01-30 to 02-01):** more than 1,400 participants from 76 countries, about 400 on site and the rest online. 15 sponsoring companies set challenges, including NVIDIA, IonQ and IQM; qBraid provided platform access — [The Tech (MIT), 2026-02-19](https://thetech.com/2026/02/19/iquhack-2026); [qBraid](https://qbraid.com/press/qbraid-iquhack-2026); [iQuHACK FAQ](https://iquhack.mit.edu/faq/).
- **QHack 2026 (Xanadu/PennyLane, 2026-10-16 to 23):** an online coding championship with a **$67,000 prize pool** and a $15,000 grand prize — [QHack](https://qhack.ai/); [QHack prizes](https://qhack.ai/prizes/); [PennyLane forum](https://discuss.pennylane.ai/t/about-the-qhack-2026-category/9476).
- **Q-Hack India 2026 (2026-10-30 to 31, Bengaluru)**, part of a Qiskit Fall Fest program — [Quantum Week](https://www.quantumweek.tech/hackathon).
- IBM-linked challenges in 2026 include the NEDO Challenge, where all nine prize-winning teams used IBM machines — [IBM blog](https://www.ibm.com/quantum/blog/ibm-nedo-challenge-2026) — and the $2M Q4Bio prize, won by Algorithmiq with Cleveland Clinic and IBM — [IBM blog: Q4Bio](https://www.ibm.com/quantum/blog/q4bio-finalists). Both are aimed at professional teams.

**Self-taught examples (weakly sourced)**
- **UNVERIFIED.** A job-board blog describes "David Nguyen", a self-taught quantum programmer who could not afford a physics degree. He used free courses, open-source projects and virtual meetups, and got an entry-level quantum software testing job after about a year — [QuantumJobs.us](https://www.quantumjobs.us/post/what-qualifications-do-you-need-for-a-job-in-quantum-computing). This may be an illustrative story, not a documented person.
- A Qiskit blog post profiles students who taught themselves quantum computing when their universities offered no courses, and went on to start an open-source education not-for-profit — [Qiskit on Medium](https://medium.com/qiskit/these-qiskitters-are-starting-an-open-source-quantum-education-not-for-profit-bd752be17bb0).

### Inferences
- **A realistic route for Astra, all of it free or paid to her:**
  1. Learn (section 5).
  2. Join the Qiskit, PennyLane and Unitary Foundation communities.
  3. Enter iQuHACK (next edition expected around Jan/Feb 2027 if it keeps its pattern) or QHack (around Oct 2027) online.
  4. Apply to QOSF's cohort (watch for a call around Oct 2026/2027).
  5. Pitch a $4k Unitary Foundation microgrant for an open-source project that suits her skills. Strong fits: an interactive VR/Unity visualiser of quantum circuits or lattice-model "toy universes", or educational tooling.
- These programs are designed for people with no institution behind them; QOSF explicitly targets "enthusiasts". For her, the barrier is a portfolio of open-source work, not money.

### Gaps
- I found no published dates for a 2026 QOSF cohort; check qosf.org and QOSF's social accounts.
- I could not confirm 2027 dates for iQuHACK or QHack, or whether an "IBM Quantum Challenge" ran in 2026 (no result under that name).
- I found no authoritative pages for the Unitary Foundation Discord, Qiskit Slack/Discord or PennyLane Discord (my search returned nothing on them). These are known community channels, but invite links and sizes are unverified.
- I found no well-documented case study of a self-taught hobbyist who became a recognised quantum open-source contributor. A targeted look at Unitary Foundation micrograntee lists or Qiskit Advocate profiles would probably find some.
