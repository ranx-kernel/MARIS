# ◈ MARIS
## Maritime Intelligence & Response System

<div align="center">

### 🛰️ SPACE • 🌊 OCEAN • 🚢 AIS • 🧠 INTELLIGENCE

**An explainable multi-source maritime intelligence platform for potential oil-spill detection and vessel-source investigation.**

**Smart India Hackathon 2026 · SIH26143 · NTRO · Space Technology**

</div>

---

## ⚡ What is MARIS?

**MARIS** transforms a difficult maritime investigation into a connected evidence pipeline.

A satellite can reveal **where a suspicious slick is**.  
Ocean dynamics can help estimate **where it came from**.  
AIS can reveal **which vessels were present around the probable source**.

MARIS connects all three.

```text
┌──────────────────┐
│  🛰️ SATELLITE   │
│   SENTINEL-1 SAR │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 🔍 SAR ANALYSIS  │
│ VV + VH Anomaly  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 🌊 OCEAN MODEL   │
│ Current Field    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ ↩️ BACKTRACKING  │
│ Source Estimator │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 🚢 AIS CORRELATOR│
│ Vessel Presence  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 🧠 FUSION ENGINE │
│ Explainable Rank │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 🚨 INVESTIGATION │
│ ALERT + CASE FILE│
└──────────────────┘
