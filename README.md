# 🚢 MARIS — Maritime Intelligence & Response System

<p align="center">

<img src="screenshots/pic5.jpeg" alt="MARIS Dashboard" width="900">

</p>

## 🌊 Overview

**MARIS (Maritime Intelligence & Response System)** is an explainable maritime intelligence platform designed to detect potential oil spills, estimate their probable source zones, and correlate them with vessel movement data.

MARIS combines:

- 🛰️ Sentinel-1 SAR imagery
- 🌊 Ocean-current backtracking
- 🚢 AIS vessel data
- 🧠 Explainable scoring
- 📍 Geospatial visualization
- 🚨 Investigation alerts

The goal is to transform fragmented maritime data into an **evidence-based investigation workflow**.

---

## 🎯 Problem Statement

Oil spills at sea can spread rapidly, making it difficult to determine their original source.

Traditional investigation requires analysts to manually combine:

> Satellite imagery + Ocean dynamics + Vessel movement + Historical information

MARIS brings these data sources together into a single investigation platform.

---

# 🧠 How MARIS Works

```text
              🛰️ SATELLITE DATA
                     │
                     ▼
              SAR PROCESSING
                     │
                     ▼
            🟡 ANOMALY DETECTION
                     │
                     ▼
             🌊 OCEAN BACKTRACK
                     │
                     ▼
              🟢 SOURCE ZONE
                     │
                     ▼
                🚢 AIS DATA
                     │
                     ▼
             🧠 VESSEL RANKING
                     │
                     ▼
              🚨 INVESTIGATION
