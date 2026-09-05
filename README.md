MARIS --- Maritime Intelligence & Response System

SIH 2026 | Problem Statement: SIH26143 | Organization: NTRO
Satellite-based oil-spill detection, ocean-current backtracking, and
explainable vessel association using AIS data.

MARIS is a maritime intelligence prototype designed to help investigate
potential oil spills at sea.

Satellite SAR → Spill Anomaly → Ocean Backtracking → Probable Source
Zone → AIS Correlation → Vessel Ranking → Investigation Alert

🚨 The Problem

When an oil spill occurs at sea, detecting the slick is only the
beginning. Authorities also need to determine where the spill may have
originated and which vessels were present near that probable source.

MARIS brings satellite imagery, ocean dynamics, and vessel movement
information into one explainable investigation workflow.

💡 Our Solution

🛰️ Satellite SAR

Processes dual-polarization VV and VH SAR information to identify
suspicious maritime dark anomalies.

🌊 Ocean-Current Backtracking

Uses ocean-current information and the elapsed time between an incident
and satellite observation to estimate a probable source zone.

🚢 AIS Vessel Correlation

Correlates vessels around the estimated source zone using:

Spatial proximity

Temporal proximity

Vessel relevance

The output is an investigative association ranking, not a
declaration of guilt.

Association score ≠ legal responsibility.

🧠 MARIS Investigation Pipeline

                   🛰️ SATELLITE SAR
                          │
                          ▼
                 SAR PREPROCESSING
                          │
                          ▼
                DARK ANOMALY DETECTION
                          │
                          ▼
                 POTENTIAL SLICK
                          │
                          ▼
                    🌊 OCEAN MODEL
                          │
                          ▼
                BACKWARD TRAJECTORY
                          │
                          ▼
                PROBABLE SOURCE ZONE
                          │
                          ▼
                    🚢 AIS DATA
                          │
                          ▼
                 VESSEL CORRELATION
                          │
                          ▼
              EXPLAINABLE ASSOCIATION
                       RANKING
                          │
                          ▼
                   🚨 INVESTIGATION

🖥️ Prototype Screenshots

1. MARIS Dashboard



The main interface provides the maritime map, investigation controls,
SAR candidates, vessel information, source zones, and system status.

2. SAR Spill Detection



MARIS identifies suspicious SAR dark anomalies as investigation
candidates rather than automatically declaring every dark region to be
oil.

3. Ocean Backtracking & Source Zone



The detected anomaly is backtracked through ocean-current information to
estimate a probable source zone.

4. Vessel Association & Investigation



MARIS correlates vessels around the estimated source zone and produces
an interpretable ranking based on spatial, temporal, and vessel-type
relevance.

🧪 Demonstration Modes

Historical Validation

MARIS includes a historical validation workflow based on the 2017
Ennore oil-spill incident.

The workflow demonstrates:

Sentinel-1A SAR imagery

Incident timing

Ocean-current information

Source-zone estimation

Historical vessel information

The documented casualty involved MT Dawn Kanchipuram and BW
Maple. The historical case is used as a validation reference rather
than presenting a retrospective AI score as ground truth.

🕵️ Unknown Spill Investigation

The second mode removes the known source information and starts with:

SOURCE UNKNOWN

MARIS then executes:

Satellite
   ↓
SAR Detection
   ↓
Source-Zone Estimation
   ↓
AIS Correlation
   ↓
Candidate Ranking

Example prototype result

MV CORAL STAR --- Rank #1

Spatial Proximity       98.75
Temporal Proximity      86.67
Vessel Relevance       100.00
Association Score        95.4

The unknown-investigation AIS candidates in this prototype are
synthetic demonstration data. They do not represent a real
accusation or live vessel finding.

📊 Explainable Association Model

Spatial Proximity       45%
Temporal Proximity      30%
Vessel Relevance        25%
                       ─────
                       100%

The resulting association score prioritizes vessels for investigation.
It does not establish legal liability.

🛰️ Satellite Processing

MARIS uses Sentinel-1 SAR observations and dual-polarization VV/VH
information for maritime anomaly analysis.

VV ──────┐
         ├──► SAR Anomaly Analysis
VH ──────┘

A dark SAR region is not automatically oil. Possible look-alikes include
low-wind areas, ship wakes, biogenic slicks, and ocean fronts. MARIS
therefore combines SAR evidence with other evidence sources.

🌊 Ocean Backtracking

The location observed by the satellite may differ from the release
location because the slick can move with ocean dynamics.

Satellite observation
        +
Incident-to-observation time
        +
Ocean-current field
        ↓
Backward trajectory
        ↓
Probable source zone

🚢 AIS Correlation

After estimating a source zone, MARIS correlates vessel information with
the relevant region and timeframe.

The prototype can display:

Vessel identity

Vessel type

Position

Distance from source zone

Temporal difference

Association score

Ranking

This transforms:

"There is a possible spill here."

into:

"These vessels are the strongest candidates for investigation."

🗺️ Interactive Maritime Map

The prototype visualizes:

🟡 SAR anomaly candidates

🟢 Probable source zones

🔴 Historical incident location

🔵 Vessel positions

─ ─ Backtracking trajectories

🚨 Investigation alerts

🏗️ System Architecture

┌─────────────────────────────────────────────┐
│                 MARIS UI                    │
│            React + MapLibre                 │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                │
│       Investigation & API Orchestration     │
└───────────┬─────────────┬─────────────┬─────┘
            │             │             │
            ▼             ▼             ▼
       Satellite       Ocean Model      AIS
        SAR Data       Current Data     Data
            │             │             │
            └─────────────┼─────────────┘
                          ▼
                 Evidence Correlation
                          │
                          ▼
                Explainable Ranking
                          │
                          ▼
                    Alert / Case

🛠️ Technology Stack

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

SAR/raster processing

Data & Integration

Sentinel-1 SAR

NOAA GODAS ocean-current information

AIS / vessel-presence architecture

Historical maritime incident information

📁 Project Structure

MARIS/
├── backend/
│   ├── main.py
│   └── ais_correlator.py
├── data/
│   └── case/
├── frontend/
│   └── src/
│       ├── components/
│       │   └── MapView.jsx
│       ├── App.jsx
│       └── ...
├── notebooks/
│   └── 01_ennore_data_exploration.ipynb
├── screenshots/
│   ├── pic1.jpeg
│   ├── pic2.jpeg
│   ├── pic3.jpeg
│   └── pic4.jpeg
├── .gitignore
├── LICENSE
└── README.md

▶️ Running the Prototype

Backend

python -m venv .venv
.venv\Scripts\activate
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open the local Vite URL displayed in the terminal.

🔬 Prototype Limitations

MARIS is currently a research and hackathon prototype.

SAR dark anomalies require additional validation before being
treated as confirmed oil.

Coarse ocean-current data can limit precise source reconstruction.

AIS vessel-presence data is not equivalent to a continuous vessel
track.

Unknown-investigation vessel records in this prototype are synthetic
demonstration data.

Production deployment would require operational AIS feeds,
higher-resolution ocean models, robust coastline/land-water masking,
and additional environmental validation.

🚀 Future Scope

Real-time satellite, AIS, weather, and ocean-current ingestion

Deep-learning oil-spill segmentation

High-resolution ensemble drift modelling

Continuous AIS track reconstruction

Multi-evidence fusion

Automated alerts for maritime authorities

Regional and national-scale deployment

🎯 Impact

MARIS reduces the gap between spill detection and source
investigation.

WHERE IS IT?
     ↓
WHERE DID IT COME FROM?
     ↓
WHO WAS THERE?
     ↓
WHO SHOULD BE INVESTIGATED FIRST?

⚖️ Responsible Use

MARIS is an investigative decision-support prototype.

An association score should not be interpreted as proof of wrongdoing,
legal liability, or guilt. Final attribution should involve verified AIS
records, official incident reports, physical evidence, environmental
observations, expert investigation, and appropriate legal procedures.

👥 Project

MARIS --- Maritime Intelligence & Response System

Developed for:

Smart India Hackathon 2026
Problem Statement: SIH26143
Organization: NTRO
Domain: Space Technology

📜 License

This project is licensed under the MIT License.

External datasets, satellite imagery, AIS data, and ocean-model products
remain subject to their respective providers' terms and licenses.

⭐ MARIS

From Space → To Sea → To Source

Detect. Backtrack. Correlate. Investigate.
