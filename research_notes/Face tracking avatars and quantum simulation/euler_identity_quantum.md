# Euler's identity and Euler's formula as the math under quantum mechanics and quantum computing

> Research notes for Astra (self-taught builder; no physics background assumed). Compiled 2026-11-03 by Anthropic Claude (Opus 5.5, `claude-opus-5-5`).
> **Method and limits:** In this session, page fetches to arxiv.org, journals.aps.org, physicstoday.aip.org and cqi.inf.usi.ch were blocked by the network allowlist. Many details below therefore come from search-result abstracts and snippets, not full-text reads, and are marked that way. Math claims marked **[verified locally]** were checked numerically with numpy in this session. The scripts are `/tmp/claude-0/-home-user-astras-pet-os/419c89c9-05c2-5d10-b047-2d94d92cc63f/scratchpad/euler_check.py` and `/tmp/claude-0/-home-user-astras-pet-os/419c89c9-05c2-5d10-b047-2d94d92cc63f/scratchpad/euler_slider.py`. Claims marked **[background, not source-checked this session]** come from standard textbook knowledge; check them before publishing.
>
> **Terminology:** *Euler's formula* is e^{iθ} = cos θ + i sin θ for any angle θ. *Euler's identity*, e^{iπ} + 1 = 0, is the special case θ = π, where e^{iπ} = −1. Quantum computing uses the formula everywhere. The identity is one important value of it: a half-turn, the sign flip −1.

## 1. How do complex phases e^{iθ} appear in quantum states, superposition and interference, and why does quantum mechanics need complex numbers?

### Takeaway
A quantum state lists one complex amplitude per possible outcome. Euler's formula splits each amplitude into a length, which sets the probability, and an angle (the phase e^{iφ}). A single measurement never shows the phase, but the phase decides how the alternatives interfere. Experiments in 2021–2022 showed that standard quantum theory with complex numbers beats any real-number version **when independent systems are combined by the standard tensor-product rule**. Papers in 2025–2026 (including PRL, June 2026) then built real-number theories with a *different* rule for combining systems that predict exactly the same results. So "nature needs complex numbers" is now a debated claim about formalism. It is not an experimentally settled fact.

### Cited Findings
**Phases in qubit states (the Bloch sphere)**
- Lecture notes use Euler's formula to rewrite a qubit state in trigonometric form, and the Bloch sphere follows from that step. The standard form is |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩, with polar angle θ and the relative phase φ as longitude. — [Notes on Quantum Computing for Thermal Science, arXiv:2503.19109](https://arxiv.org/pdf/2503.19109) (snippet-level read)
- On the Bloch sphere the north pole is |0⟩ and the south pole is |1⟩. The sphere's orientation shows the phase "like a compass". — [Quantum Computing and Visualization survey, arXiv:2310.04937](https://arxiv.org/pdf/2310.04937)
- The Z gate leaves |0⟩ unchanged and multiplies |1⟩ by −1. On a superposition it adds a *relative* phase, which shows up only if a Hadamard is applied before measuring. — [Wolfram Cloud lesson, "Phase Differences"](https://wolframcloud.com/obj/jmcnally0/Published/IntroductionToQuantumComputing/Lesson8-PhaseDifferences.nb)
- **[verified locally]** Starting from |+⟩ = (|0⟩+|1⟩)/√2 and applying H gives outcome 0 with probability 1. Inserting Z (the e^{iπ} phase) before H gives outcome **1** with probability 1. Inserting S = diag(1, e^{iπ/2}) gives 50/50. Multiplying the *whole* state by e^{iπ} leaves every probability unchanged (global phase).

**Why complex numbers? The conceptual view**
- Aaronson describes quantum mechanics as a generalization of probability theory that uses the 2-norm and complex numbers in place of nonnegative real numbers. — [review of *Quantum Computing Since Democritus*](https://www-users.york.ac.uk/~ss44/books/pages/a/ScottAaronson.htm); [QCSD Lecture 9: "Quantum"](https://scottaaronson.blog/?p=188) (the blog says this lecture is a standalone entry point)
- In "Why are amplitudes complex?" (Dec 2018), Aaronson asks why amplitudes are complex rather than real or quaternionic. He notes that **real amplitudes typically suffice for quantum computing**, and that some quantum-information results are more elegant only with complex amplitudes. — [Shtetl-Optimized, "Why are amplitudes complex?"](https://scottaaronson.blog/?p=4021)
- Aaronson's 2004 paper "Is Quantum Mechanics An Island In Theoryspace?" is a "recreational" study of what happens when quantum mechanics is changed. It points to results, including Hardy's axiomatic derivation, that favor complex amplitudes. — [arXiv:quant-ph/0401062](https://arxiv.org/abs/quant-ph/0401062) (abstract and snippet only)
- Formulations of quantum mechanics using only real numbers, or quaternions, have existed since the 1960s. Philosopher Jill North argues that complex numbers are important but perhaps not strictly indispensable. — [The Quantum Insider, 2024-09-28](https://thequantuminsider.com/2024/09/28/complex-numbers-its-complicated-philosopher-explores-the-important-but-maybe-not-indispensable-role-of-complex-numbers-in-quantum-mechanics/)

**The 2021 theory proposal and 2022 experiments (complex beats real under standard rules)**
- Renou et al., "Quantum theory based on real numbers can be experimentally falsified," *Nature* 600, 625–629 (2021). They proved that real and complex quantum theory make different predictions in **network** scenarios with independent sources and measurements (an entanglement-swapping setup). The test works like a Bell test: a successful experiment would rule out real quantum theory, as Bell experiments ruled out local hidden variables. — [arXiv:2101.10873](https://web3.arxiv.org/abs/2101.10873); [UNIGE open archive](https://archive-ouverte.unige.ch/unige:158741)
- Chen et al., "Ruling Out Real-Valued Standard Formalism of Quantum Theory," *PRL* 128, 040403 (2022), used **superconducting qubits** (USTC, Jian-Wei Pan's group). Their score of 8.09(1) beat the real-number bound of 7.66 by about 43 standard deviations. The complex-quantum maximum is about 8.49. — [APS Physics featured-article PDF](https://physics.aps.org/featured-article-pdf/10.1103/PhysRevLett.128.040403) (search snippet)
- Wu et al., "Experimental Refutation of Real-Valued Quantum Mechanics under Strict Locality Conditions," *PRL* 129, 140401 (2022), was **photonic**. It closed the independent-source, locality and measurement-independence loopholes but still assumed fair sampling. It violated the real-number bound (7.66) by 5.30 standard deviations. — [link.aps.org DOI](https://link.aps.org/doi/10.1103/PhysRevLett.129.140401); [ECNU record](https://pure.ecnu.edu.cn/en/publications/experimental-refutation-of-real-valued-quantum-mechanics-under-st/); [ar5iv of arXiv:2201.04177](https://ar5iv.labs.arxiv.org/html/2201.04177)
- An APS *Physics* article (Physics 15, 7, 2022) covered two 2022 PRL tests of real quantum theory, by Chen et al. and by Li et al. (optical). — [APS Physics 15, 7 PDF](https://physics.aps.org/articles/pdf/10.1103/Physics.15.7)
- Weilenmann, Gisin & Sekatski (*PRL* 135, 180201, 2025) showed that sources need only be *partially* independent to rule out real quantum theory, which weakens one of the key assumptions. — [PRL abstract page](https://journals.aps.org/prl/abstract/10.1103/3fv7-p8cs) (search snippet)

**The 2025–2026 counterpoint (real numbers can work with a different composition rule)**
- Hoffreumon & Woods, "Quantum theory does not need complex numbers," arXiv:2504.02808 (v1 3 Apr 2025, v2 9 Oct 2025). They argue the 2021 conclusion was premature. Their real-number theory keeps "representation locality" and positive semi-definite states and effects, and it uses a modified state space under the tensor product. They say it is **experimentally indistinguishable** from complex quantum theory and that complex numbers are "a mere convenience." — [arXiv:2504.02808v2](https://arxiv.org/abs/2504.02808v2) (abstract-level only; full text not fetched)
- Barrios Hita, Trushechkin, Kampermann, Epping & Bruß, "Quantum Mechanics Based on Real Numbers: A Consistent Description," *PRL* 136, 240202, published 18 June 2026 (Editors' Suggestion, featured in APS *Physics*). They argue the 2021 postulate for combining systems is too restrictive. A physically motivated alternative gives theories written entirely in real numbers that are experimentally indistinguishable from standard quantum mechanics. — [idw press release, 2026-06-19](https://nachrichten.idw-online.de/2026/06/19/physics-publication-in-physical-review-letters-does-quantum-mechanics-need-complex-numbers); [Live Science](https://www.livescience.com/physics-mathematics/complex-numbers-are-not-needed-for-quantum-mechanics-physicists-develop-quantum-model-that-uses-only-real-numbers-for-first-time-ever); [arXiv:2503.17307](https://arxiv.org/pdf/2503.17307); [APS Physics feature PDF](https://physics.aps.org/featured-article-pdf/10.1103/4k13-sdjh)

### Inferences
- **The two results do not conflict.** The 2022 experiments rule out "real quantum theory + the standard tensor-product rule for combining independent systems." The 2025–2026 papers change that combining rule. An accurate summary for Astra: *complex numbers are the natural language of quantum mechanics, and they are required if systems combine in the standard way; whether nature needs them at the level of foundations is debated as of 2026.* None of this changes practice. Every quantum SDK, textbook and hardware platform uses complex amplitudes.
- **Plain-language model:** treat each amplitude as an arrow, a complex number r·e^{iφ}. Probability is the arrow's length squared. When two paths lead to the same outcome, add their arrows. Arrows pointing the same way reinforce (constructive interference). Arrows half a turn apart, differing by a factor e^{iπ} = −1, cancel (destructive interference). Euler's formula is the rule for writing and turning those arrows.
- Aaronson's point that real amplitudes suffice for computation means the *speedup* of quantum computers does not come from the imaginary unit. It comes from interference of signed or complex amplitudes over an exponentially large state space (see sections 3 and 7).

### Gaps
- I could not read the full texts of Renou et al., Chen et al., Wu et al., Hoffreumon–Woods or Barrios Hita et al. (hosts blocked). Scores, sigma values and claims come from abstracts and snippets.
- I found no expert reaction to the June 2026 PRL paper beyond press releases, and no sign of community consensus. I also could not confirm whether Hoffreumon–Woods has been published in a journal.
- Li et al. (2022, optical) details, such as score and article number, were not retrieved.

## 2. Time evolution U = e^{−iHt/ħ}, rotation gates, the Bloch sphere, global vs relative phase, and e^{iπ} = −1 as the phase flip

### Takeaway
All closed-system quantum dynamics, and so every gate, is a matrix exponential e^{−iHt/ħ}. For Pauli matrices, which square to the identity, this is literally Euler's formula with a matrix where i·θ used to be: e^{−iθP/2} = cos(θ/2)·I − i·sin(θ/2)·P. The Z gate is diag(1, e^{iπ}), so it is Euler's identity as a gate. A −1 on the *whole* state is physically invisible. A −1 on *one branch* of a superposition (a relative phase) is the sign flip behind interference, phase kickback and oracle algorithms.

### Cited Findings
- 3Blue1Brown's lesson "e^(iπ) in 3.14 minutes, using dynamics" (Grant Sanderson, 7 July 2019, Differential Equations ch. 5) imagines a point whose velocity is always *i × its position*. It moves around the unit circle, and after π seconds it has gone halfway around to −1. — [3blue1brown.com lesson](https://www.3blue1brown.com/lessons/eulers-formula-dynamically)
- **Matrix Euler formula:** if A² = I then exp(iθA) = cos θ·I + i sin θ·A. The proof splits the Taylor series into even powers (giving I) and odd powers (giving A). For a unit vector n, exp(iθ n·σ) = cos θ·I + i sin θ (n·σ). This is a standard exercise in courses built on Nielsen & Chuang §2.1. — [problem set (ilorentz.org)](https://www.ilorentz.org/QI/problemset_linalg_QI.pdf); [EPFL homework solution](https://moodle.epfl.ch/pluginfile.php/3384480/mod_resource/content/2/solution%20homework%202.pdf)
- **[verified locally]** R_z(θ) = e^{−iθZ/2} equals cos(θ/2)·I − i sin(θ/2)·Z. R_z(π) = −i·Z, which is the Z gate up to a global phase. R_z(2π) = −I: a full 360° turn of a qubit gives a factor of −1, which is Euler's identity again.
- Qiskit writes its two-qubit ZZ rotation as RZZ(θ) = exp(−i θ/2 Z⊗Z), a direct sum of RZ rotations. Its global-RZ gate is exp(−i Σ_j Z_j φ), which reduces to RZ for one qubit. So Qiskit rotation gates follow the e^{−iθ(Pauli)/2} convention. — [IBM Qiskit docs, RZZGate](https://quantum.cloud.ibm.com/docs/api/qiskit/0.31/qiskit.circuit.library.RZZGate); [IBM Qiskit docs, GRZ](https://quantum.cloud.ibm.com/docs/api/qiskit/0.40/qiskit.circuit.library.GRZ)
- Hamiltonian simulation is defined as implementing U = e^{−iHt} for a given Hamiltonian H (in units where ħ = 1). — [Wikipedia, "Hamiltonian simulation"](https://en.wikipedia.org/wiki/Hamiltonian_simulation)
- **Phase kickback:** when a controlled-U acts on an eigenstate of U, the eigenvalue's phase is "kicked back" onto the control qubit. — [PennyLane demo, "Phase kickback"](https://pennylane.ai/demos/tutorial_phase_kickback)
- **Hadamard test:** prepare an ancilla in |+⟩, apply controlled-U, apply H, measure. If U|ψ⟩ = e^{iφ}|ψ⟩, then P(ancilla = 0) = cos²(φ/2). — [Qulacs Quantum Native Dojo, "Hadamard test"](https://dojo.qulacs.org/en/latest/notebooks/2.2_Hadamard_test.html); [arXiv:2512.19615](https://arxiv.org/pdf/2512.19615)
- **[verified locally]** Hadamard test with U = Z: target |0⟩ (eigenvalue +1 = e^{i0}) gives P(0) = 1. Target |1⟩ (eigenvalue −1 = e^{iπ}) gives P(0) = 0, so the ancilla reads out Euler's −1 with certainty, matching cos²(π/2) = 0.
- 3Blue1Brown's "But what is quantum computing? (Grover's Algorithm)" (released 30 April 2025, ~37 min) covers qubits, state vectors, complex values and Grover's search. Scott Aaronson called it a masterpiece that dispels the "tries all possibilities in parallel" misconception. A follow-up note, "Where my explanation of Grover's algorithm failed" (4 May 2025), clarifies the setup. — [video (YouTube id RQWpF2Gb-gU)](https://www.youtube.com/watch?v=RQWpF2Gb-gU); [Aaronson blog mirror](https://www.goodreads.com/author/show/2952149.Scott_Aaronson/blog?page=3); [3B1B follow-up note](https://members.3blue1brown.com/posts/where-my-of-128116047)

### Inferences
- **The "Euler clocks" picture.** This is the main conceptual bridge, and it rests on the verified math above. Schrödinger's equation, iħ dψ/dt = Hψ, applied to a state of definite energy E reduces to dψ/dt = −i(E/ħ)ψ. That is the same "velocity = i × position" equation as in 3Blue1Brown's lesson, so ψ(t) = e^{−iEt/ħ}ψ(0). A general state is a mix of energy states, and each one runs its own clock hand around Euler's circle at its own speed E/ħ. Everything observable comes from the *relative* angles between the hands, which means from energy *differences*. In this picture, simulating physics means running the clocks; quantum phase estimation means reading a clock hand's angle (section 3); Trotterization is a way to run the clocks when you can't separate the hands analytically (section 3).
- **Global vs relative phase** is the single most important subtlety for Astra. e^{iπ} applied to an entire state changes nothing measurable. Applied to one branch of a superposition, it turns "always 0" into "always 1" after a Hadamard. The same −1 is invisible or decisive depending on *where* it sits.
- **e^{iπ} = −1 in algorithms** [background, not source-checked this session]: oracle algorithms (Deutsch–Jozsa, Bernstein–Vazirani, Grover) commonly encode a yes/no answer f(x) as a sign, (−1)^{f(x)} = e^{iπ f(x)}, using phase kickback onto an ancilla in |−⟩. Grover's oracle flips the sign of the marked item's amplitude. IBM's "Fundamentals of Quantum Algorithms" course covers these.
- **The 720° spinor fact** [background, not source-checked this session]: R_z(2π) = −I is a global phase for an isolated qubit. It becomes a measurable relative phase if only one branch is rotated, for example with a controlled rotation. Neutron-interferometry experiments in the 1970s observed this sign change for spin-½ particles. I did not retrieve a source.
- [background, not source-checked this session] Qiskit's RZ(θ) = diag(e^{−iθ/2}, e^{iθ/2}) and phase gate P(θ) = diag(1, e^{iθ}) differ only by the global phase e^{iθ/2}, so they give identical measurement statistics. Verify on the current [Qiskit RZGate page](https://quantum.cloud.ibm.com/docs/api/qiskit/qiskit.circuit.library.RZGate).

### Gaps
- The current Qiskit RZGate and PhaseGate doc pages were not retrieved, so the exact global-phase convention was not checked against IBM docs this session.
- No source was retrieved for the neutron 4π-rotation experiments or for formal statements of the oracle sign-flip in the algorithm lessons.

## 3. Hamiltonian simulation (Trotter–Suzuki, quantum phase estimation, quantum Fourier transform): how directly is Euler's formula the building block?

### Takeaway
"Simulating physics on a quantum computer" means building e^{−iHt} for a model Hamiltonian H. Product (Trotter–Suzuki) formulas split it into many small exponentials of simple terms, each one a rotation gate, which is Euler's formula for Pauli strings. The QFT is a grid of roots of unity e^{2πijk/N}. QPE reads out eigenphases e^{2πiθ}. Euler's formula is the "atom" of these circuits, and Euler's identity is exactly the N = 2 QFT, the Hadamard. The hard, physics-specific work lies elsewhere: choosing H, encoding it in qubits, handling terms that don't commute, preparing states, and fighting noise.

### Cited Findings
- Lloyd, "Universal Quantum Simulators," *Science* 273(5278):1073–1078 (23 Aug 1996), showed Feynman's 1982 conjecture is correct: quantum computers can efficiently simulate **local** quantum systems. Here H is a sum of m terms, each acting on at most k subsystems. Lloyd used the Trotter product formula: approximate the exponential of a sum by products of the exponentials of each term over many small time steps, with bounded error. A commonly cited cost is ∝ t²·k·g²/ε (t = time, g = local dimension, ε = error), per Knee & Munro's secondary description. — [Brown, Munro & Kendon, arXiv:1004.5528](https://arxiv.org/pdf/1004.5528); [Knee & Munro, arXiv:1502.04536](https://arxiv.org/pdf/1502.04536); primary: [doi:10.1126/science.273.5278.1073](https://doi.org/10.1126/science.273.5278.1073) (not fetched)
- Trotter formulas are now usually called "product formulas": they simulate a sum of Hamiltonian terms by simulating each term separately for a short time slice. — [Wikipedia, "Hamiltonian simulation"](https://en.wikipedia.org/wiki/Hamiltonian_simulation)
- **[verified locally]** First-order Trotter for H = X + Z, t = 1, compared with the exact e^{−iHt} (spectral-norm error): n = 1 step gives 0.80, n = 4 gives 0.18, n = 16 gives 0.044, n = 64 gives 0.011. The error falls roughly as 1/n, so more, smaller Euler rotations give a better approximation.
- **QFT:** QFT_N maps |j⟩ to (1/√N) Σ_k ω_N^{jk}|k⟩ with ω_N^{jk} = e^{2πi·jk/N}. It is the quantum analogue of the discrete Fourier transform and is built from Hadamard and controlled-phase gates. — [IBM Quantum Learning, Utility-scale QC, "Quantum phase estimation" (Kento Ueda, May 2024)](https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/quantum-phase-estimation); [IBM Qiskit in Classrooms, QFT module](https://quantum.cloud.ibm.com/learning/en/modules/computer-science/qft.md)
- **QPE:** the input is a unitary circuit and one of its eigenvectors. The output is the phase θ ∈ [0, 1) of its eigenvalue e^{2πiθ}. QPE plus the QFT gives Shor's factoring algorithm. — [IBM Quantum Learning, Fundamentals of Quantum Algorithms, "Phase estimation procedure"](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure)
- **[verified locally]** QFT_4 built from 4th roots of unity is unitary, and the four roots sum to 0. The Hadamard gate equals QFT_2 with ω = e^{iπ}: H = (1/√2)[[1, 1], [1, e^{iπ}]].

### Inferences
- **Euler's identity as a sum of roots of unity.** The N roots of unity always sum to zero. For N = 2 the roots are 1 and e^{iπ}, so that sum *is* e^{iπ} + 1 = 0. The Hadamard is QFT_2, so Euler's identity is exactly the cancellation that makes the Hadamard interfere. This is the most rigorous sense in which Euler's identity sits inside quantum algorithms. Larger QFTs generalize it: N arrows spread evenly around the circle cancel unless their phases line up.
- **How directly is Euler's formula the building block?** At gate level, very directly. Every single-qubit gate is a global phase times a rotation e^{−iθ n·σ/2}. Trotter steps for Pauli-string terms e^{−iθ P/2} are compiled to an RZ wrapped in CNOTs and basis changes [background, not source-checked this session]. At algorithm level, Euler's formula is the *language*, not the *engine*. The cost and difficulty come from non-commuting terms (Trotter error), the number of terms, mapping fermions to qubits (e.g., Jordan–Wigner), state preparation, and error correction.
- Since Lloyd, higher-accuracy methods have been developed: higher-order Suzuki formulas, linear combinations of unitaries, quantum signal processing, qubitization [background, not source-checked this session]. They still output e^{−iHt}, and the "Euler clocks" picture from section 2 still describes what they compute.
- **Where the quantum advantage comes from:** an n-qubit state has 2^n complex amplitudes (tensor product). That exponential bookkeeping is Feynman's point (section 4). Euler's formula describes how each amplitude turns. It does not explain why there are so many amplitudes.

### Gaps
- The primary Lloyd paper, Suzuki's higher-order formulas, and modern Trotter-error analyses (e.g., Childs et al., "Theory of Trotter error") were not retrieved.
- The full QPE derivation (phase-to-bitstring mapping) was not read in the IBM lesson. The search returned only definitions.

## 4. Feynman's 1982 "Simulating Physics with Computers," explained simply

### Takeaway
Feynman's argument: describing a quantum system on an ordinary computer takes an amount of memory that grows exponentially with the number of particles. So build the computer out of quantum parts that follow the same rules as the system being simulated. Lloyd (1996) proved this works efficiently for local Hamiltonians.

### Cited Findings
- R. P. Feynman, "Simulating Physics with Computers," *International Journal of Theoretical Physics* 21(6/7):467–488 (June 1982), DOI 10.1007/BF02650179, received 7 May 1981. It was delivered as the keynote at the Physics of Computation Conference, MIT Endicott House, May 1981. — [Springer](https://link.springer.com/article/10.1007/BF02650179); [arXiv:2405.03366](https://arxiv.org/html/2405.03366v1); [arXiv:2405.20780](https://arxiv.org/pdf/2405.20780)
- Feynman focused on simulating quantum systems because classical digital computers scale poorly at it. The paper is regarded as one of the most influential works in founding quantum computing as a discipline. — [arXiv:2405.03366](https://arxiv.org/pdf/2405.03366)
- Lloyd (1996) is credited with proving Feynman's conjecture for local quantum systems. — [arXiv:1004.5528](https://arxiv.org/pdf/1004.5528)
- [background; the PDF at [cqi.inf.usi.ch](https://cqi.inf.usi.ch/qic/Feynman1982.pdf) could not be fetched to verify wording] The paper's best-known line: "Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical, and by golly it's a wonderful problem, because it doesn't look so easy." The paper also argues that describing R particles on N grid points classically takes on the order of N^R numbers, and proposes a "universal quantum simulator."

### Inferences
- **Game-dev analogy for Astra:** in a classical engine, adding one particle adds a few floats to the save file. In an exact quantum simulation, adding one qubit-sized particle *doubles* the save file (2^n complex amplitudes). Around 50 such particles needs about 2^50 ≈ 10^15 complex numbers, which strains the largest supercomputers. Feynman's proposal is to let the hardware itself hold those amplitudes. Euler's formula then describes how the hardware turns them, through e^{−iHt}.
- Feynman's argument is about *quantum* systems: molecules, materials, field theories. It is not a claim that a quantum computer can simulate "the universe" as a whole. Scope and limits of cosmology simulation are covered by the other researchers.

### Gaps
- Exact quotes, including the "dammit" line, the N^R counting argument, and Feynman's discussion of negative probabilities, could not be verified against the full text this session (host blocked).

## 5. Explainer resources that tie Euler's formula, phase and quantum computing together

### Takeaway
A good path for a self-taught builder: 3Blue1Brown on e^{iπ} as motion, then 3Blue1Brown on Grover (amplitudes, signs), then Quantum Country (spaced-repetition primer), then IBM Quantum Learning's Fundamentals courses and QPE/QFT lessons in Qiskit, then Aaronson for "why complex," with Nielsen & Chuang as the reference text.

### Cited Findings
- **3Blue1Brown, "e^(iπ) in 3.14 minutes, using dynamics"** (2019) is the best single intuition for why e^{it} moves around a circle, and it is the same equation as Schrödinger's for one energy state. — [lesson page](https://www.3blue1brown.com/lessons/eulers-formula-dynamically)
- **3Blue1Brown, "But what is quantum computing? (Grover's Algorithm)"** (30 Apr 2025), plus the follow-up note on what the explanation got wrong. — [video](https://www.youtube.com/watch?v=RQWpF2Gb-gU); [follow-up](https://members.3blue1brown.com/posts/where-my-of-128116047)
- **Quantum Country** (Andy Matuschak & Michael Nielsen, 2019–2020). The essay "Quantum computing for the very curious" explains how quantum computers work in depth ("not … a popularization based on hand-wavy analogies"), with 112 spaced-repetition questions embedded in the text (the "mnemonic medium"). — [Matuschak & Nielsen, "How can we develop transformative tools for thought?" (mirror)](https://www.goodreads.com/author_blog_posts/19121247-andy-matuschak-and-michael-nielsen-how-can-we-develop-tr); [Matuschak notes, "Mnemonic medium"](https://notes.andymatuschak.org/Mnemonic_medium); [UChicago EPiQC Quantum Country tutorials](https://www.epiqc.cs.uchicago.edu/quantumcountrytutorials); site: https://quantum.country (URL from background, not fetched)
- **IBM Quantum Learning:** *Fundamentals of Quantum Algorithms* covers phase estimation and factoring. *Utility-scale Quantum Computing* Lesson 05 (QFT + QPE; simulator demos; code shown as static images that may be out of date). The *Qiskit in Classrooms* QFT module covers the classical DFT first, then the quantum version. — [Fundamentals: phase estimation](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure); [Utility-scale: QPE](https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/quantum-phase-estimation); [QFT module](https://quantum.cloud.ibm.com/learning/en/modules/computer-science/qft.md)
- **John Watrous, *Understanding Quantum Information and Computation*** (arXiv:2507.11536, 2025), a book-length text that appeared in search results alongside the IBM course material. — [arXiv:2507.11536](https://arxiv.org/pdf/2507.11536) (I did not verify the link to the IBM course)
- **Scott Aaronson:** *QCSD* Lecture 9 "Quantum" (standalone), "Why are amplitudes complex?", and "Is QM an Island in Theoryspace?". — [Lecture 9](https://scottaaronson.blog/?p=188); [Why complex?](https://scottaaronson.blog/?p=4021); [Island paper](https://arxiv.org/abs/quant-ph/0401062)
- **Hands-on phase demos:** the PennyLane phase-kickback demo, the Qulacs Hadamard-test notebook, and the Wolfram "Phase Differences" lesson. — [PennyLane](https://pennylane.ai/demos/tutorial_phase_kickback); [Qulacs](https://dojo.qulacs.org/en/latest/notebooks/2.2_Hadamard_test.html); [Wolfram](https://wolframcloud.com/obj/jmcnally0/Published/IntroductionToQuantumComputing/Lesson8-PhaseDifferences.nb)
- [background, not source-checked this session] **Nielsen & Chuang**, *Quantum Computation and Quantum Information* (10th anniversary ed., Cambridge UP, 2010): §2.1 (linear algebra, including the matrix-exponential exercise), §4.2 (single-qubit rotations R_x, R_y, R_z), §4.7 (simulation of quantum systems), §5.1–5.2 (QFT, phase estimation). **John Preskill's Caltech Ph219/CS219 lecture notes**: http://theory.caltech.edu/~preskill/ph219/ (URL not fetched).

### Inferences
- A suggested order that builds on Euler's formula step by step: (1) 3B1B dynamics lesson (e^{it} as motion); (2) Quantum Country essay 1 (qubits, gates as matrices); (3) the H–P(θ)–H "Euler slider" demo in section 6; (4) the Hadamard test and phase kickback (PennyLane/Qulacs); (5) IBM QFT and QPE lessons; (6) Trotterization of a two-spin model (section 3 numbers); (7) Aaronson and the 2021–2026 complex-numbers debate as enrichment.

### Gaps
- I did not verify whether the legacy "Qiskit Textbook" phase chapters still exist at their old URLs or were fully folded into IBM Quantum Learning.
- The Preskill notes URL and Nielsen & Chuang section numbers were not checked this session.

## 6. Has anyone built something explicitly around Euler's identity + quantum computing? A simple runnable demo

### Takeaway
I found **no** project, paper or artwork that explicitly makes Euler's identity the organizing foundation of quantum computing or quantum simulation. The link shows up as a step inside lecture notes, Bloch-sphere tools and 3Blue1Brown-style explainers. That leaves an open niche for Astra. One small demo makes the identity directly visible: in the circuit H → P(θ) → H on |0⟩, the amplitude of outcome 0 is (1 + e^{iθ})/2. At θ = π that is (e^{iπ} + 1)/2, the left side of Euler's identity, so outcome 0 never happens.

### Cited Findings
- Lecture notes use Euler's formula to move from complex amplitudes to the trigonometric, Bloch-sphere form of a qubit. — [arXiv:2503.19109](https://arxiv.org/pdf/2503.19109)
- Interactive Bloch-sphere tools already exist: a FastHTML browser demo with gate buttons, an open-source globe-rotation visualizer, and a Microsoft Store app that animates single-qubit gates as rotations. None of them mentions Euler's identity explicitly. — [FastHTML gallery Bloch sphere](https://gallery.fastht.ml/vizualizations/bloch_sphere/display); [GitHub hmasum52/BlochSphereVisualizer](https://github.com/hmasum52/BlochSphereVisualizer); [Microsoft Store app](https://apps.microsoft.com/detail/9pj77hf1w39t?hl=en-US); [DEV Community Bloch sphere post](https://dev.to/kauemiziara/bloch-sphere-qubit-visualization-4869)
- 3Blue1Brown's dynamics lesson is the closest well-known explainer that builds intuition from e^{iπ}, but it is about differential equations, not quantum computing. — [3B1B lesson](https://www.3blue1brown.com/lessons/eulers-formula-dynamically)
- **[verified locally] "Euler slider" demo:** for H·P(θ)·H|0⟩ the amplitudes are (1 + e^{iθ})/2 for outcome 0 and (1 − e^{iθ})/2 for outcome 1, so P(1) = sin²(θ/2). Numerically: θ = 0 gives P(1) = 0; θ = π/2 gives 0.5; θ = π gives **1.000** (amplitude of 0 is exactly 0); θ = 2π gives 0 again. With θ = π, P(π) = Z, so H·Z·H = X, and Euler's −1 becomes a bit flip.
- **[verified locally] Hadamard-test variant:** ancilla |+⟩, controlled-Z onto target |1⟩, H on the ancilla, then measure. The ancilla gives 1 with certainty, which is phase kickback of e^{iπ}. With target |0⟩ there is no kickback and the result is always 0. The theory is in the [Qulacs Hadamard-test notebook](https://dojo.qulacs.org/en/latest/notebooks/2.2_Hadamard_test.html) and [PennyLane phase kickback](https://pennylane.ai/demos/tutorial_phase_kickback).

Demo code. The numpy version was run this session. The Qiskit version was **not** run here (Qiskit not checked in this environment), so check it against current Qiskit docs.

```python
# numpy, tested 2026-11-03
import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
for theta in np.linspace(0, 2*np.pi, 9):
    P = np.diag([1, np.exp(1j*theta)])           # phase gate = Euler's formula on |1>
    out = H @ P @ H @ np.array([1, 0])
    print(f"{theta/np.pi:.2f}π  amp0={(1+np.exp(1j*theta))/2:.3f}  P(1)={abs(out[1])**2:.3f}")
# at θ = π: amp0 = (e^{iπ} + 1)/2 = 0  -> outcome 1 is certain
```

```python
# Qiskit sketch, NOT run in this session
from math import pi
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
qc = QuantumCircuit(1)
qc.h(0); qc.p(pi, 0); qc.h(0)              # p(pi) == Z == diag(1, e^{iπ})
print(Statevector(qc).probabilities_dict())  # expected {'1': 1.0}
```

### Inferences
- **Demo ideas that fit Astra's VR/Unity skills** (suggestions, not existing projects):
  - (a) A VR "Euler slider": a hand-held dial sets θ, a 3D Bloch sphere shows the state, a unit circle shows the arrows 1 and e^{iθ} adding up, and a bar shows P(1) = sin²(θ/2). Snapping the dial to π makes the two arrows cancel visibly.
  - (b) "Euler clocks" for a two-level Hamiltonian: two clock hands at speeds E₁/ħ and E₂/ħ, with the measured probability oscillating at the beat frequency (E₂ − E₁)/ħ.
  - (c) A Trotter toy: show the exact e^{−i(X+Z)t} path on the Bloch sphere next to the n-step zig-zag of alternating X and Z Euler rotations, so the error shrinking roughly as 1/n becomes visible.
  - (d) A desktop pet that "flips its sign" through a real or simulated H–Z–H circuit.
  All four can run on a classical statevector simulator, since one or two qubits are trivial to simulate exactly.
- These demos teach the right lesson: phase is invisible until interference reveals it.

### Gaps
- I found no published artwork, installation or paper explicitly titled or framed around "Euler's identity + quantum computing." My search was limited to a few queries, so smaller educator blogs or art projects may exist that I didn't find.
- I could not check whether 3Blue1Brown's Grover video explicitly calls the oracle's sign flip "e^{iπ}".

## 7. Where "model Euler's identity and make it the foundation of how we use quantum computing to simulate our universe" is right, and where it is overstated

### Takeaway
**Right:** Euler's formula is the native language of quantum dynamics. Amplitudes are e^{iφ}-style arrows, time evolution is e^{−iHt/ħ}, every gate is an exponential of Pauli matrices, the QFT is built from roots of unity, and e^{iπ} = −1 is the sign flip that drives interference. It is a sound *teaching* foundation. **Overstated:** Euler's identity is one value (θ = π) of a general math identity. It contains no physics on its own. It doesn't say which Hamiltonian describes the universe, it isn't the source of quantum speedup, its necessity is debated at the level of foundations, and no quantum computer is on a path to simulate "our universe" as a whole.

### Cited Findings
- **Right, the dynamics:** quantum simulation means implementing U = e^{−iHt}, a complex exponential. — [Wikipedia, Hamiltonian simulation](https://en.wikipedia.org/wiki/Hamiltonian_simulation). For Pauli generators this reduces exactly to Euler's form, cos·I + i·sin·P. — [ilorentz.org problem set](https://www.ilorentz.org/QI/problemset_linalg_QI.pdf); **[verified locally]**
- **Right, the algorithms:** the QFT matrix entries are e^{2πijk/N}, and QPE outputs the angle of an eigenvalue e^{2πiθ}. — [IBM QPE lesson](https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/quantum-phase-estimation); [IBM Fundamentals](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure)
- **Right, the identity:** Z = diag(1, e^{iπ}), and the Hadamard equals QFT_2 with ω = e^{iπ}. **[verified locally]** Phase kickback moves that −1 onto a control qubit. — [PennyLane](https://pennylane.ai/demos/tutorial_phase_kickback)
- **Overstated, speedup source:** real amplitudes typically suffice for quantum computing. — [Aaronson, "Why are amplitudes complex?"](https://scottaaronson.blog/?p=4021). Feynman's case rests on the exponential cost of classical simulation as particle number grows. — [arXiv:2405.03366](https://arxiv.org/pdf/2405.03366)
- **Overstated, necessity:** complex numbers are required under the standard composition rule. — [Renou et al. 2021](https://web3.arxiv.org/abs/2101.10873); [Chen et al. 2022](https://physics.aps.org/featured-article-pdf/10.1103/PhysRevLett.128.040403); [Wu et al. 2022](https://link.aps.org/doi/10.1103/PhysRevLett.129.140401). Real-number theories with modified composition are reported as experimentally indistinguishable. — [Hoffreumon & Woods 2025](https://arxiv.org/abs/2504.02808v2); [Barrios Hita et al., PRL 2026](https://nachrichten.idw-online.de/2026/06/19/physics-publication-in-physical-review-letters-does-quantum-mechanics-need-complex-numbers)
- **Overstated, scope:** efficient quantum simulation is proven for *local* Hamiltonians, i.e., specific models, not "the universe" wholesale. — [Lloyd 1996 via arXiv:1004.5528](https://arxiv.org/pdf/1004.5528)

### Inferences
- **A more accurate framing Astra could adopt:** "Use *Euler's formula* (rotation by e^{iθ}) as the visual and mathematical core of how I teach and build quantum simulations. *Euler's identity* (e^{iπ} = −1) is the signature moment where a half-turn makes alternatives cancel." This is fully correct and still keeps Euler at the center.
- **What else the foundation needs,** each a separate concept beyond Euler:
  - (1) linear superposition and the tensor product (why n qubits give 2^n amplitudes);
  - (2) the Born rule (probability = |amplitude|²);
  - (3) measurement and decoherence (phases leak to the environment, which is the main reason hardware is hard);
  - (4) the Hamiltonian H itself, which is where the physics of any simulated "universe" lives;
  - (5) error correction.
  Euler's formula describes how amplitudes *turn*. It says nothing about what H is or how many amplitudes there are.
- **Caution on phrasing:** avoid "Euler's identity is the foundation of the universe" or "quantum computers run on Euler's identity." Each wording is technically defensible in parts but invites hype. "Every quantum gate is an Euler-style rotation" is both accurate and striking.
- A practical point: one- and two-qubit Euler demos run exactly on any laptop. Real quantum hardware is needed only when the simulated system is too large to hold 2^n amplitudes classically. The other researchers cover the practical path.

### Gaps
- I found no authoritative educator or researcher who explicitly frames Euler's identity as *the* foundation of quantum simulation, so there is no expert source to cite for or against that exact framing. The assessment above is my synthesis of the cited sources.
