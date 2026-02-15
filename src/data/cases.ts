export type ChoiceId = "a" | "b" | "c" | "d";

export type MCQ = {
  id: string;
  question: string;
  choices: { id: ChoiceId; text: string }[];
  answerId: ChoiceId;
  explanation: string;
};

export type Section = {
  id: string;
  title: string;
  content: string[];
  qna: MCQ[];
};

export type CaseModule = {
  id: string;
  title: string;
  subtitle: string;
  priorityOneLiner: string;
  category: "HBT" | "TRAUMA" | "BREAST" | "ENDO" | "GIT" | "VASC" | "PEDIA"; // adjust later
  sections: Section[];
};

export const CASES: CaseModule[] = [
  {
    id: "choledocholithiasis",
    category: "HBT",
    title: "Choledocholithiasis (+/- Acute Cholangitis)",
    subtitle:
      "",
    priorityOneLiner:
      "Priority: Stabilize + early antibiotics → biliary decompression (source control) if indicated → definitive stone clearance + same-admission cholecystectomy when stable.",
    sections: [
      {
        id: "clinical",
        title: "Clinical Recognition (Stem + Differentials + Charcot)",
        content: [
          "41/F with jaundice ± RUQ pain.",
          "Imaging shows CBD dilatation → suspect choledocholithiasis.",
          "If systemic inflammation + cholestasis + imaging evidence → suspect acute cholangitis.",
          "",
          "Charcot Triad (classic):",
          "• Fever (T ≥ 38.0°C)",
          "• RUQ pain",
          "• Jaundice (Tokyo cholestasis supports jaundice: T-bili ≥ 2 mg/dL OR LFTs ≥1.5× ULN)",
          "",
          "Reynolds Pentad (severe cholangitis):",
          "• Charcot triad PLUS",
          "• Hypotension (SBP < 90 mmHg or MAP < 65 mmHg; Grade III shock if vasopressor-requiring to keep MAP ≥ 65)",
          "• Altered mental status",
          "",
          "Differentials:",
          "• Acute calculous cholecystitis",
          "• Malignant biliary obstruction (cholangiocarcinoma, pancreatic head CA)",
          "• Mirizzi syndrome",
          "• Acute viral hepatitis",
          "• Benign biliary stricture",
          "",
          "Board traps (quick recall):",
          "• Charcot triad is NOT required for Tokyo diagnosis.",
          "• RUQ pain alone ≠ cholangitis; need systemic inflammation + cholestasis/imaging evidence.",
        ],
        qna: [
          {
            id: "q1",
            question:
              "Most important early priority in suspected acute cholangitis is:",
            choices: [
              { id: "a", text: "Immediate cholecystectomy for all grades" },
              { id: "b", text: "Pain control only then observe" },
              {
                id: "c",
                text: "Stabilize + start antibiotics + plan biliary decompression for source control",
              },
              { id: "d", text: "Repeat ultrasound daily until stone passes" },
            ],
            answerId: "c",
            explanation:
              "Early priorities are resuscitation + early antibiotics. Source control is biliary drainage (ERCP preferred) depending on severity.",
          },
        ],
      },

      {
        id: "diagnosis-grading",
        title: "Diagnosis + Severity (Tokyo + Pathophysiology)",
        content: [
          "Pathophysiology:",
          "CBD obstruction → ↑ intraductal pressure → bile stasis.",
          "Bacterial ascent from duodenum + high ductal pressure → bacteremia → sepsis risk.",
          "Decompression lowers duct pressure and interrupts septic progression.",
          "",
          "Tokyo Diagnostic Criteria (TG18/TG23) — 3 Categories (A, B, C):",
          "",
          "A (Systemic inflammation):",
          "• Fever/shivering: T ≥ 38.0°C",
          "OR",
          "• Lab inflammation: WBC < 4,000/µL OR > 10,000/µL; CRP ≥ 1 mg/dL",
          "",
          "B (Cholestasis):",
          "• Jaundice: Total bilirubin ≥ 2 mg/dL",
          "OR",
          "• Abnormal liver tests (≥ 1.5 × ULN) of ANY: ALP, GGT, AST, ALT",
          "",
          "C (Imaging):",
          "• Bile duct dilatation (typical adult reference CBD ≥ 7 mm; post-cholecystectomy may be larger)",
          "OR",
          "• Evidence of etiology: stone, stricture, stent obstruction, tumor",
          "",
          "Diagnosis rule:",
          "• Suspected cholangitis = A + (B or C)",
          "• Definite cholangitis = A + B + C",
          "",
          "Tokyo Severity Grading:",
          "",
          "Grade I (Mild):",
          "• Does NOT meet Grade II or Grade III criteria",
          "",
          "Grade II (Moderate): need ≥ 2 of the following:",
          "• WBC > 12,000/µL OR < 4,000/µL",
          "• Temperature ≥ 39°C",
          "• Age ≥ 75 years",
          "• Total bilirubin ≥ 5 mg/dL",
          "• Hypoalbuminemia (albumin < 0.7 × lower limit of normal for that lab)",
          "",
          "Grade III (Severe): organ dysfunction in ≥ 1 system:",
          "• Cardiovascular: hypotension requiring vasopressors to maintain MAP ≥ 65",
          "• Neurologic: altered mental status",
          "• Respiratory: PaO2/FiO2 < 300",
          "• Renal: creatinine ≥ 2.0 mg/dL",
          "• Hepatic: INR ≥ 1.5",
          "• Hematologic: platelets < 100,000/µL",
          "",
          "Numeric board traps (VERY high yield):",
          "• T-bili 1.9 mg/dL does NOT meet Tokyo cholestasis cutoff (needs ≥2).",
          "• Tokyo B abnormal LFTs = ≥1.5× ULN (not mild elevation). Example: ALP 1.2× ULN does NOT qualify.",
          "• Tokyo A can be met by WBC >10,000 (e.g., 10,200 qualifies) BUT Grade II requires WBC >12,000 or <4,000.",
          "• Hypotension alone is NOT Grade III unless requiring vasopressors to maintain MAP ≥65.",
        ],
        qna: [
          {
            id: "tokyo-dx-q1",
            question: "Tokyo Guidelines: 'Definite' acute cholangitis requires:",
            choices: [
              { id: "a", text: "A only" },
              { id: "b", text: "A + B" },
              { id: "c", text: "A + C" },
              { id: "d", text: "A + B + C" },
            ],
            answerId: "d",
            explanation:
              "Definite = systemic inflammation + cholestasis + imaging evidence.",
          },
          {
            id: "tokyo-trap-q2",
            question: "Tokyo B (cholestasis) is met by which of the following?",
            choices: [
              { id: "a", text: "Total bilirubin 1.9 mg/dL" },
              { id: "b", text: "ALP 1.2× ULN" },
              { id: "c", text: "ALT 1.6× ULN" },
              { id: "d", text: "AST 1.1× ULN" },
            ],
            answerId: "c",
            explanation:
              "Tokyo B: T-bili ≥2 OR LFTs ≥1.5× ULN. ALT 1.6× ULN qualifies; the others do not.",
          },
          {
            id: "tokyo-ultra-q3",
            question:
              "Patient with cholangitis has SBP 88 mmHg that improves after fluids, no vasopressors. Labs: INR 1.6, platelets 140k. Tokyo severity is:",
            choices: [
              { id: "a", text: "Grade I (Mild)" },
              { id: "b", text: "Grade II (Moderate)" },
              { id: "c", text: "Grade III (Severe) because SBP < 90" },
              { id: "d", text: "Grade III (Severe) because INR ≥ 1.5" },
            ],
            answerId: "d",
            explanation:
              "Grade III = organ dysfunction in ≥1 system. Hepatic dysfunction is INR ≥1.5 → Grade III even if BP responds to fluids.",
          },
        ],
      },

      {
        id: "resuscitation-antibiotics",
        title: "Resuscitation + Antibiotics (with cutoffs)",
        content: [
          "Resuscitation (sepsis principles):",
          "• Crystalloid: Lactated Ringer’s preferred.",
          "• If hypotensive (SBP < 90 or MAP < 65) OR lactate ≥ 4 mmol/L: give 30 mL/kg within first 3 hours.",
          "• Example: 70 kg → 30 × 70 = 2100 mL bolus.",
          "• Targets: MAP ≥ 65 mmHg; urine output ≥ 0.5 mL/kg/hr.",
          "• If not fluid responsive: early norepinephrine (first-line vasopressor).",
          "• Lactate ≥ 2 mmol/L suggests hypoperfusion; ≥ 4 mmol/L triggers aggressive early resuscitation bundle.",
          "",
          "Antibiotics (start early; tailor to severity + local resistance):",
          "Coverage: Gram-negative enterics (E. coli, Klebsiella) + anaerobes; consider Enterococcus/resistant organisms if healthcare-associated.",
          "",
          "Mild (Grade I) typical options:",
          "• Ceftriaxone 1–2 g IV q24h ± Metronidazole 500 mg IV q8h",
          "",
          "Moderate (Grade II) typical options:",
          "• Piperacillin–Tazobactam 4.5 g IV q6h",
          "OR",
          "• Cefepime 2 g IV q8–12h + Metronidazole 500 mg IV q8h",
          "",
          "Severe (Grade III) / ESBL risk / healthcare-associated:",
          "• Meropenem 1 g IV q8h (adjust renal)",
          "• Add Vancomycin (e.g., 15–20 mg/kg IV q8–12h; adjust by levels/renal) if concern for resistant Gram+ / enterococcus / device-associated infection",
          "",
          "Duration:",
          "• Typically 4–7 days AFTER adequate source control (drainage).",
          "",
          "Numeric board traps:",
          "• Sepsis bolus is weight-based (30 mL/kg), not '1 liter for everyone'.",
          "• Goal MAP is ≥65 mmHg (not ≥70/80 by default).",
        ],
        qna: [
          {
            id: "fluid-q1",
            question:
              "70 kg patient with Grade III cholangitis and hypotension. Initial fluid?",
            choices: [
              { id: "a", text: "500 mL NS only" },
              { id: "b", text: "1 L D5W" },
              { id: "c", text: "30 mL/kg isotonic crystalloid within 3 hours" },
              { id: "d", text: "Albumin first-line" },
            ],
            answerId: "c",
            explanation:
              "If hypotensive or lactate ≥4: give 30 mL/kg crystalloid early, reassess, then start vasopressors if needed.",
          },
          {
            id: "sepsis-ultra-q2",
            question:
              "Cholangitis patient is normotensive (MAP 72) but lactate is 4.6 mmol/L. Best next step (early bundle) is:",
            choices: [
              { id: "a", text: "No bolus because MAP is normal" },
              { id: "b", text: "30 mL/kg crystalloid within 3 hours" },
              { id: "c", text: "Start norepinephrine immediately without fluids" },
              { id: "d", text: "Wait for cultures before antibiotics and fluids" },
            ],
            answerId: "b",
            explanation:
              "Lactate ≥4 triggers early 30 mL/kg crystalloid even if BP looks okay; reassess perfusion after.",
          },
        ],
      },

      {
        id: "ercp-management",
        title: "ERCP Pathway (ASGE + Drainage + Complications + Timing)",
        content: [
          "ASGE 2019 choledocholithiasis risk stratification (key cutoffs):",
          "",
          "High Risk → proceed directly to ERCP if ANY of the following:",
          "• CBD stone seen on imaging",
          "• Clinical ascending cholangitis",
          "• Total bilirubin > 4 mg/dL AND dilated CBD on imaging",
          "",
          "Intermediate Risk → further evaluation (EUS or MRCP) if ANY:",
          "• Abnormal liver biochemical tests (above normal range; often cholestatic pattern)",
          "• Age > 55 years",
          "• Dilated CBD on imaging (without the high-risk bilirubin combination above)",
          "",
          "Low Risk → proceed to cholecystectomy without additional biliary imaging (no predictors).",
          "",
          "Drainage timing (Tokyo concept):",
          "• Grade I: antibiotics/support first; drain if not improving or persistent obstruction.",
          "• Grade II: early biliary drainage recommended (ERCP preferred).",
          "• Grade III: urgent drainage AFTER initial stabilization; ICU-level monitoring often needed.",
          "",
          "Proximal vs distal obstruction:",
          "• Distal CBD stone near ampulla: ERCP usually achieves definitive drainage/therapy.",
          "• Proximal/hilar obstruction: ERCP may not drain all segments → consider PTBD if incomplete drainage risk.",
          "",
          "Definitive timing (stone disease):",
          "• Same-admission cholecystectomy after stabilization/drainage reduces recurrence.",
          "• Poor surgical candidate: individualized timing/strategy.",
          "",
          "ERCP complications (major):",
          "• Post-ERCP pancreatitis (most common)",
          "• Bleeding",
          "• Perforation",
          "• Cholangitis if incomplete drainage",
          "",
          "Pancreatitis prophylaxis (high yield):",
          "• Rectal NSAID: Indomethacin 100 mg PR ONCE (or Diclofenac 100 mg PR ONCE) immediately before/after ERCP (if no contraindication).",
          "• Aggressive periprocedural hydration (LR preferred).",
          "• Pancreatic duct stent in selected high-risk cases (endoscopist decision).",
          "",
          "Numeric board traps:",
          "• ASGE high-risk bilirubin trigger is >4 mg/dL WITH CBD dilatation (not bilirubin alone).",
          "• Incomplete drainage can worsen sepsis (post-ERCP cholangitis).",
        ],
        qna: [
          {
            id: "drainage-q1",
            question: "Urgent/early ERCP drainage is best indicated in:",
            choices: [
              { id: "a", text: "All Grade I cholangitis immediately" },
              {
                id: "b",
                text: "Grade II–III cholangitis or failure to improve on antibiotics/support",
              },
              { id: "c", text: "RUQ pain with normal LFTs and no jaundice" },
              { id: "d", text: "Only after elective MRCP next week" },
            ],
            answerId: "b",
            explanation:
              "Early drainage for Grade II and urgent drainage for Grade III; mild can be antibiotics-first if improving.",
          },
          {
            id: "asge-trap-q2",
            question: "ASGE 2019: Which scenario is 'High Risk' → direct ERCP?",
            choices: [
              { id: "a", text: "Age 60 + abnormal LFTs only" },
              { id: "b", text: "CBD dilated but bilirubin 3.0 mg/dL" },
              { id: "c", text: "Total bilirubin 5.0 mg/dL + dilated CBD" },
              { id: "d", text: "Normal CBD size + RUQ pain only" },
            ],
            answerId: "c",
            explanation:
              "High risk includes bilirubin >4 mg/dL PLUS dilated CBD (or stone seen, or clinical cholangitis).",
          },
          {
            id: "ercp-ultra-q3",
            question:
              "Which patient is MOST appropriate for rectal NSAID + consider pancreatic duct stent to prevent post-ERCP pancreatitis?",
            choices: [
              {
                id: "a",
                text: "Low-risk ERCP: stone extraction, no difficult cannulation",
              },
              {
                id: "b",
                text: "Suspected SOD / pancreatic duct instrumentation / difficult cannulation",
              },
              { id: "c", text: "ERCP canceled; patient for MRCP only" },
              { id: "d", text: "Purely diagnostic ultrasound case" },
            ],
            answerId: "b",
            explanation:
              "High-risk for post-ERCP pancreatitis includes difficult cannulation and pancreatic duct manipulation. NSAID prophylaxis is standard; PD stent considered in high-risk cases by endoscopist.",
          },
        ],
      },

      {
        id: "surgical-cbd",
        title: "Surgical CBD Exploration (T-Tube)",
        content: [
          "Routine T-tube after CBD exploration is NOT standard.",
          "",
          "Indications (practical):",
          "• Uncertain duct clearance (need postoperative cholangiography/access)",
          "• Poor distal flow / edematous ampulla / questionable patency",
          "• Severe inflammation making primary closure unsafe",
          "",
          "Primary closure preferred if:",
          "• Complete stone clearance confirmed",
          "• Good distal flow",
          "• No severe inflammation",
        ],
        qna: [
          {
            id: "ttube-q1",
            question: "Best indication for T-tube placement is:",
            choices: [
              { id: "a", text: "Routine use after all CBD explorations" },
              {
                id: "b",
                text: "Uncertain duct clearance / need postoperative cholangiography",
              },
              { id: "c", text: "To reduce operative time in all cases" },
              { id: "d", text: "Primary closure is always contraindicated" },
            ],
            answerId: "b",
            explanation:
              "T-tube is selective (not routine). Use when clearance is uncertain or postop cholangiography/access is needed.",
          },
        ],
      },

      {
        id: "complications-oral",
        title: "Complications + Oral Defense",
        content: [
          "Complications (disease):",
          "• Septic shock",
          "• Liver abscess",
          "• Recurrent cholangitis",
          "• Chronic obstruction → secondary biliary cirrhosis (long-term)",
          "",
          "Oral Defense Script (board-safe flow):",
          "1) Diagnose suspected/definite cholangitis using Tokyo (A+B+C) with cutoffs.",
          "2) Grade severity (I vs II vs III).",
          "3) Stabilize: LR + 30 mL/kg if hypotensive/MAP<65 or lactate≥4; target MAP≥65 and UO≥0.5 mL/kg/hr; norepinephrine if needed.",
          "4) Start early antibiotics (dose by severity).",
          "5) Source control: ERCP drainage (early Grade II; urgent Grade III) ± PTBD if proximal/incomplete drainage risk.",
          "6) Definitive: same-admission cholecystectomy after stabilization/drainage for gallstone disease.",
          "",
          "Rapid-fire numeric traps:",
          "• Tokyo B jaundice cutoff = T-bili ≥2 mg/dL; Grade II bilirubin cutoff = ≥5 mg/dL.",
          "• Tokyo A WBC abnormal = >10k or <4k; Grade II WBC threshold = >12k or <4k.",
          "• Grade III shock = vasopressor-requiring to keep MAP ≥65 (not just 'BP low').",
        ],
        qna: [],
      },
    ],
  },
];
