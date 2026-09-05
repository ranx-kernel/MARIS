# ◈ MARIS
Maritime Intelligence & Response System
<div align="center">

🛰️ SPACE • 🌊 OCEAN • 🚢 AIS • 🧠 INTELLIGENCE
AI-Powered Maritime Oil Spill Detection & Vessel Source Investigation

SMART INDIA HACKATHON 2026

SIH26143 • NTRO • SPACE TECHNOLOGY

</div>

## 🚨 THE MISSION
When an oil spill occurs at sea, detecting the slick is only the beginning.

The real questions are:

Where is the spill?
Where did it originate?
Which vessels should investigators examine first?

MARIS — Maritime Intelligence & Response System — combines satellite SAR imagery, ocean-current information and AIS vessel intelligence into a unified investigation pipeline.

MARIS Intelligence Pipeline
🛰️ SATELLITE SAR
        │
        ▼
   SAR PROCESSING
     VV + VH
        │
        ▼
 POTENTIAL SPILL
    DETECTION
        │
        ▼
 🌊 OCEAN CURRENT
     ANALYSIS
        │
        ▼
 ↩️ BACKWARD
   TRAJECTORY
        │
        ▼
 🟢 PROBABLE
 SOURCE ZONE
        │
        ▼
 🚢 AIS CORRELATION
 VESSEL ANALYSIS
        │
        ▼
 🧠 EVIDENCE FUSION
  & VESSEL RANKING
        │
        ▼
 🚨 INVESTIGATION
       ALERT
MARIS doesn't just detect where the spill is — it investigates where it may have originated.

## 🎯 PROBLEM STATEMENT
Oil-spill investigation is a multi-source intelligence problem.

A satellite can identify a suspicious surface anomaly, but investigators still need to determine:

Where the spill originated

How the slick moved

Which vessels were present near the probable source

Which vessels deserve investigation first

Why a particular vessel was prioritized

Traditional Workflow
Satellite Image
      │
      ▼
Potential Slick
      │
      ▼
Manual Analysis
      │
      ├──────── Ocean Data
      │
      └──────── AIS Data
                │
                ▼
        Manual Correlation
                │
                ▼
          Investigation
MARIS Workflow
Satellite ──────┐
                │
Ocean ──────────┼────► MARIS
                │       │
AIS ────────────┘       ▼
                 Evidence Fusion
                        │
                        ▼
                  Source Zone
                        │
                        ▼
                  Vessel Ranking
                        │
                        ▼
                   Investigation
## 💡 OUR SOLUTION
MARIS creates a complete evidence chain:

🛰️ DETECT
    ↓
🌊 BACKTRACK
    ↓
📍 ESTIMATE SOURCE
    ↓
🚢 CORRELATE VESSELS
    ↓
🧠 FUSE EVIDENCE
    ↓
📊 RANK CANDIDATES
    ↓
🚨 SUPPORT INVESTIGATION
Layer	Purpose
🛰️ SAR	Detect potential oil-spill anomalies
🌊 Ocean Currents	Reconstruct possible slick movement
📍 Source Zone	Estimate probable origin region
🚢 AIS	Identify nearby vessels
🧠 Evidence Fusion	Combine multiple signals
📊 Ranking	Prioritize vessels for investigation
## 🖥️ MARIS MISSION CONTROL


The MARIS dashboard provides a unified operational view containing:

Interactive maritime map

SAR anomaly candidates

Probable source zones

Vessel locations

Investigation controls

Pipeline progress

Evidence information

Investigation alerts

The objective is to reduce the need to switch between multiple disconnected tools.

## 🛰️ 01 — SAR INTELLIGENCE
MARIS uses Synthetic Aperture Radar (SAR) for maritime anomaly detection.

The prototype processes dual-polarization SAR information:

              SENTINEL-1 SAR
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       VV POL               VH POL
          │                   │
          └─────────┬─────────┘
                    ▼
             SAR ANALYSIS
                    │
                    ▼
             ANOMALY SCORING
                    │
                    ▼
           CANDIDATE REGIONS
SAR Processing Pipeline
Raw SAR
   │
   ▼
Radiometric Calibration
   │
   ▼
Sigma-0 / dB Conversion
   │
   ▼
Local Background Estimation
   │
   ▼
VV + VH Analysis
   │
   ▼
Anomaly Detection
   │
   ▼
Morphological Filtering
   │
   ▼
Connected Components
   │
   ▼
Candidate Extraction
MARIS does not assume:

Dark Pixel = Oil
Instead, suspicious anomalies are evaluated using multiple characteristics.

Potential look-alikes include:

Low-wind regions

Ship wakes

Biogenic slicks

Ocean fronts

Other surface phenomena

Therefore, SAR detection is treated as potential evidence, not standalone proof.

## 🔍 SAR ANOMALY DETECTION


MARIS converts suspicious SAR regions into structured investigation candidates.

SAR IMAGE
    │
    ▼
CALIBRATION
    │
    ▼
VV + VH ANALYSIS
    │
    ▼
LOCAL ANOMALY DETECTION
    │
    ▼
MORPHOLOGICAL FILTERING
    │
    ▼
CONNECTED COMPONENTS
    │
    ▼
SAR CANDIDATES
Instead of returning a single unexplained prediction, the system produces candidate regions that can be investigated using additional environmental and vessel evidence.

## 🌊 02 — OCEAN BACKTRACKING
Oil does not remain stationary after release.

Ocean currents can transport a slick away from its original release location.

MARIS therefore performs backward trajectory analysis.

              SATELLITE OBSERVATION
                       ●
                      ╱
                     ╱
                    ╱
                   ╱
                  ●
           PROBABLE SOURCE
Concept
Observed Slick Position
          +
Elapsed Time
          +
Ocean Current Vector
          │
          ▼
Backward Transport
          │
          ▼
Probable Source Zone
This changes the investigation question from:

Where is the oil?

to:

Where could the oil have originated?

## 🗺️ SOURCE-ZONE ESTIMATION


The map connects detected SAR anomalies with estimated source zones.

🟡 SAR CANDIDATE
       │
       │
       │ BACKWARD
       │ TRAJECTORY
       │
       ▼
🟢 PROBABLE SOURCE ZONE
The source zone provides a focused geographical area for vessel correlation.

## 🚢 03 — AIS CORRELATION
Once a probable source zone is estimated, MARIS correlates vessel information with:

Geographic proximity

Temporal proximity

Vessel type

Distance from source

Time difference from the estimated event

The system then ranks vessel candidates.

                  SOURCE ZONE
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      DISTANCE        TIME      VESSEL TYPE
         45%           30%           25%
          │            │             │
          └────────────┼─────────────┘
                       ▼
              ASSOCIATION SCORE
                       │
                       ▼
               INVESTIGATION RANK
## 🧠 EXPLAINABLE ASSOCIATION MODEL
MARIS uses an interpretable weighted scoring model.

Evidence Signal	Weight
Spatial Proximity	45%
Temporal Proximity	30%
Vessel Relevance	25%
Total	100%
Example Investigation Result
╔════════════════════════════════════╗
║       INVESTIGATION RESULT        ║
╠════════════════════════════════════╣
║                                    ║
║  MV CORAL STAR                     ║
║  Oil / Product Tanker              ║
║                                    ║
║  Spatial Score        98.75        ║
║  Temporal Score       86.67        ║
║  Vessel Relevance    100.00        ║
║                                    ║
║  ASSOCIATION           95.4        ║
║  INVESTIGATION RANK       #1       ║
║                                    ║
╚════════════════════════════════════╝
⚠️ ASSOCIATION ≠ LIABILITY

The score is designed to prioritize candidates for further investigation.

It does not establish legal responsibility.

## 🚢 VESSEL INTELLIGENCE


The vessel intelligence layer transforms raw vessel presence into structured investigative evidence.

Vessel Identity
      ↓
Vessel Type
      ↓
Position
      ↓
Distance from Source
      ↓
Temporal Difference
      ↓
Spatial Score
      ↓
Temporal Score
      ↓
Vessel Relevance
      ↓
Overall Association
      ↓
Investigation Rank
Instead of simply saying:

"A vessel was nearby."

MARIS provides:

"These vessels are the strongest candidates for investigation based on the available evidence."

## 🧠 04 — EVIDENCE FUSION
The core intelligence layer combines multiple independent evidence sources.

             ┌──────────────────┐
             │   SAR EVIDENCE   │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ OCEAN DYNAMICS  │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │  SOURCE ZONE    │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │   AIS PRESENCE  │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ EVIDENCE FUSION │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ EXPLAINABLE     │
             │ VESSEL RANKING  │
             └──────────────────┘
The objective is not to create a black-box verdict.

The objective is to create an explainable investigation trail.

##🧪 TWO INVESTIGATION MODES
MARIS demonstrates two modes.

## 🔬 MODE A — HISTORICAL VALIDATION
The historical mode validates the pipeline using the 2017 Ennore oil-spill incident.

ENNORE INCIDENT
       │
       ▼
SENTINEL-1A OBSERVATION
       │
       ▼
SAR ANALYSIS
       │
       ▼
OCEAN BACKTRACKING
       │
       ▼
SOURCE-ZONE ESTIMATION
       │
       ▼
HISTORICAL VESSEL VALIDATION
The historical incident involved:

MT DAWN KANCHIPURAM
Oil / Product Tanker

Documented spill-source vessel.

BW MAPLE
LPG Carrier

Collision participant.

The historical case is used as a validation reference rather than as a retrospectively generated AI verdict.

## 🕵️ MODE B — UNKNOWN SPILL INVESTIGATION
The unknown investigation mode removes the known source vessel.

╔══════════════════════════════════╗
║       NEW INVESTIGATION          ║
╠══════════════════════════════════╣
║                                  ║
║ CASE STATUS : ACTIVE             ║
║ SOURCE      : UNKNOWN            ║
║ VESSEL      : UNKNOWN            ║
║                                  ║
╚══════════════════════════════════╝
MARIS executes the investigation pipeline:

20%    SATELLITE INGESTION
       ↓
40%    SAR PROCESSING
       ↓
55%    ANOMALY DETECTION
       ↓
70%    OCEAN BACKTRACKING
       ↓
85%    AIS CORRELATION
       ↓
100%   INVESTIGATION RANKING
The result is a ranked candidate list.

Note: The unknown-investigation AIS candidates shown in the prototype are synthetic demonstration data. A production implementation would connect to authorized real AIS data sources.

## ⚡ WHY MARIS IS DIFFERENT
Conventional Workflow
Detect Spill
     ↓
Search Nearby Vessels
     ↓
Manual Investigation
## MARIS Workflow
             🛰️
       DETECT ANOMALY
             ↓
             🌊
      RECONSTRUCT DRIFT
             ↓
             📍
       ESTIMATE SOURCE
             ↓
             🚢
      CORRELATE VESSELS
             ↓
             🧠
       FUSE EVIDENCE
             ↓
             📊
        RANK CANDIDATES
             ↓
             🚨
      SUPPORT INVESTIGATION
## Core Innovation
Spatial + Temporal + Physical + Vessel Intelligence

combined into one explainable investigation pipeline.

## 🏗️ SYSTEM ARCHITECTURE
                         ┌──────────────────────┐
                         │        MARIS         │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
                  ▼                                   ▼
          ┌───────────────┐                   ┌───────────────┐
          │   FRONTEND    │                   │    BACKEND    │
          │ React + Vite  │                   │ FastAPI + Py  │
          └───────┬───────┘                   └───────┬───────┘
                  │                                   │
                  ▼                         ┌─────────┼─────────┐
          ┌───────────────┐                 │         │         │
          │   MapLibre    │                 ▼         ▼         ▼
          │  Maritime Map │               ┌────┐    ┌─────┐   ┌────┐
          └───────────────┘               │ SAR│    │Ocean│   │AIS │
                                          └─┬──┘    └──┬──┘   └─┬──┘
                                            │          │        │
                                            └──────────┼────────┘
                                                       ▼
                                             ┌──────────────────┐
                                             │ EVIDENCE FUSION  │
                                             └────────┬─────────┘
                                                      ▼
                                             ┌──────────────────┐
                                             │ EXPLAINABLE      │
                                             │ RANKING ENGINE   │
                                             └────────┬─────────┘
                                                      ▼
                                             ┌──────────────────┐
                                             │ INVESTIGATION    │
                                             │ ALERT            │
                                             └──────────────────┘
## 🧰 TECHNOLOGY STACK
Frontend
React

Vite

MapLibre GL

React Map GL

Recharts

Lucide React

Backend
Python

FastAPI

NumPy

SciPy

Scientific Processing
Sentinel-1 SAR

VV / VH Polarization

Radiometric Calibration

Sigma-0 / dB Analysis

Local Background Estimation

Connected Components

Spatial Interpolation

Ocean Current Backtracking

Geospatial Analysis

Data Sources
Satellite SAR

NOAA GODAS Ocean Current Data

AIS / Vessel Presence Architecture

Historical Maritime Incident Data

## 📂 PROJECT STRUCTURE
MARIS/
│
├── backend/
│   ├── main.py
│   └── ais_correlator.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── MapView.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   └── case/
│       ├── ennore_2017.json
│       ├── ennore_2017_timeline.json
│       └── sentinel1_ennore_target.json
│
├── notebooks/
│   └── 01_ennore_data_exploration.ipynb
│
├── screenshots/
│   ├── pic1.jpeg
│   ├── pic2.jpeg
│   ├── pic3.jpeg
│   └── pic4.jpeg
│
├── .gitignore
├── LICENSE
└── README.md
## ▶️ QUICK START
1. Clone Repository
git clone https://github.com/ranx-kernel/MARIS.git
cd MARIS
2. Create Python Environment
python -m venv .venv
Activate:

.venv\Scripts\activate
3. Start Backend
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
Backend:

http://localhost:8000
4. Start Frontend
Open another terminal:

cd frontend
npm install
npm run dev
Open the Vite development URL shown in the terminal.

## 🔐 SECURITY
Never commit API credentials or access tokens to GitHub.

Use environment variables:

GFW_TOKEN=<your-token>
Sensitive credentials should remain outside the repository.

Large raw satellite products are also excluded from version control.

## ⚠️ CURRENT LIMITATIONS
MARIS is currently a research and hackathon prototype.

SAR dark anomalies require additional validation before being classified as confirmed oil.

Coarse ocean-current fields can limit source-position precision.

AIS vessel-presence data is not equivalent to a continuous vessel track.

Unknown-investigation AIS candidates are synthetic demonstration data.

Production deployment requires authorized operational AIS feeds.

Higher-resolution ocean models would improve trajectory reconstruction.

Improved coastline and land-water masking would improve detection.

Multi-source environmental validation would increase confidence.

## 🚀 FUTURE ROADMAP
CURRENT PROTOTYPE
        │
        ▼
REAL-TIME AIS INTEGRATION
        │
        ▼
HIGH-RESOLUTION OCEAN MODELS
        │
        ▼
DEEP-LEARNING SAR SEGMENTATION
        │
        ▼
WIND + WAVE + CURRENT FUSION
        │
        ▼
VESSEL BEHAVIOUR ANALYSIS
        │
        ▼
REAL-TIME SATELLITE INGESTION
        │
        ▼
AUTOMATED ALERTING
        │
        ▼
OPERATIONAL MARITIME
INTELLIGENCE PLATFORM

## Planned Enhancements
🤖 Deep-learning oil-spill segmentation

🌊 Ensemble ocean-drift prediction

🚢 Continuous AIS track reconstruction

🌬️ Wind and wave integration

🧠 Multi-modal evidence fusion

🌐 Real-time satellite ingestion

🚨 Automated investigation alerts

🗺️ Large-area maritime monitoring

📊 Historical incident analytics

🔎 Investigator-focused case management

## 🌍 POTENTIAL APPLICATIONS
🌊 Environmental Protection
Early identification and investigation of potential marine pollution.

⚓ Coastal & Port Monitoring
Monitoring high-traffic coastal and port-adjacent regions.

🚢 Maritime Safety
Supporting maritime incident reconstruction and vessel movement analysis.

🛰️ Remote Maritime Surveillance
Combining satellite observations with vessel intelligence.

🏛️ Decision Support
Providing investigators with a structured multi-source intelligence picture.

## 🎯 IMPACT
MARIS addresses the gap between spill detection and source investigation.

BEFORE MARIS
Satellite
    +
Ocean Data
    +
AIS
    ↓
Manual Analysis
    ↓
Investigation
WITH MARIS
Satellite ──┐
            │
Ocean ──────┼──► MARIS
            │      │
AIS ────────┘      ▼
             Evidence Fusion
                    │
                    ▼
              Probable Source
                    │
                    ▼
              Vessel Correlation
                    │
                    ▼
              Explainable Ranking
                    │
                    ▼
              Investigation Alert
## 🧠 DESIGN PHILOSOPHY
MARIS follows three principles.

01 — MULTI-SOURCE
No single data source is treated as sufficient.

SAR + OCEAN + AIS
02 — EXPLAINABLE
The system shows why a vessel was prioritized.

Spatial
   +
Temporal
   +
Vessel Relevance
   =
Association
03 — INVESTIGATIVE
MARIS supports investigators instead of making unsupported legal conclusions.

Detection
    ↓
Evidence
    ↓
Correlation
    ↓
Prioritization
    ↓
Human Investigation
## ⚖️ RESPONSIBLE INTELLIGENCE
MARIS is an investigative decision-support system.

An association score must not be interpreted as:

Proof of wrongdoing

Legal liability

Criminal attribution

Definitive identification of a polluter

Final attribution should involve:

Verified AIS records

Official incident reports

Physical evidence

Environmental observations

Domain experts

Appropriate legal procedures

ASSOCIATION ≠ LIABILITY

## 🏆 SMART INDIA HACKATHON 2026
<div align="center">

SIH26143
NTRO
SPACE TECHNOLOGY
<br>

🛰️ FROM SPACE
↓
🌊 TO SEA
↓
🚢 TO SOURCE
<br>

DETECT • BACKTRACK • CORRELATE • INVESTIGATE
</div>

## 📜 LICENSE
This project is released under the MIT License.

External satellite imagery, AIS information, ocean-model products and other third-party datasets remain subject to their respective terms and licenses.

<div align="center">

◈ MARIS
Maritime Intelligence & Response System
Turning maritime data into an explainable investigation trail.

<br>

DETECT. BACKTRACK. CORRELATE. INVESTIGATE.
</div>
