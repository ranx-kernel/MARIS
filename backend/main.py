import asyncio
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ais_correlator import rank_vessels


# ============================================================
# MARIS - Maritime Intelligence & Response System
# ============================================================

app = FastAPI(
    title="MARIS",
    description=(
        "Maritime Intelligence & Response System for "
        "satellite oil-spill detection, ocean backtracking "
        "and AIS vessel association."
    ),
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HISTORICAL ENNORE 2017 CASE
# ============================================================

ENNORE_CASE = {
    "case": "ENNORE-2017",

    "incident": {
        "name": "Ennore Oil Spill",
        "date": "2017-01-28",
        "time_ist": "03:50 IST",
        "latitude": 13.2282,
        "longitude": 80.3633,
        "description": (
            "Historical oil-spill incident following a collision "
            "near Kamarajar Port, Ennore."
        ),
    },

    "satellite": {
        "platform": "Sentinel-1A",
        "acquisition_date": "2017-01-29",
        "acquisition_time_ist": "06:01 IST",
        "acquisition_time_utc": "00:31:32 UTC",
        "polarization": "VV + VH",
        "mode": "IW",
        "product": "GRD",
        "scene": (
            "S1A_IW_GRDH_1SDV_20170129T003132_"
            "20170129T003157_015039_01892E_6D04.SAFE"
        ),
    },

    "elapsed_hours": 26.18,

    "ocean_model": {
        "name": "NOAA GODAS",
        "surface_level_m": 5,
        "u_ms": -0.0494,
        "v_ms": -0.2441,
        "speed_ms": 0.2491,
        "direction_deg": -101.45,
        "transport_km": 23.47,
        "resolution_note": (
            "Coarse monthly ocean-current proxy used for "
            "historical prototype backtracking."
        ),
    },

    # --------------------------------------------------------
    # SAR CANDIDATES
    # --------------------------------------------------------

    "candidates": [
        {
            "id": "#1583",
            "latitude": 13.233286,
            "longitude": 80.389185,
            "area_km2": 0.0312,
            "mean_vv_db": -24.03,
            "mean_vh_db": -24.63,
            "confidence": "HIGH",
            "score": 86,
        },
        {
            "id": "#1385",
            "latitude": 13.252392,
            "longitude": 80.399569,
            "area_km2": 0.0310,
            "mean_vv_db": -24.30,
            "mean_vh_db": -24.92,
            "confidence": "MEDIUM",
            "score": 78,
        },
        {
            "id": "#2416",
            "latitude": 13.118246,
            "longitude": 80.497572,
            "area_km2": 0.0345,
            "mean_vv_db": -24.00,
            "mean_vh_db": -24.68,
            "confidence": "LOW",
            "score": 62,
        },
    ],

    # --------------------------------------------------------
    # BACKTRACKED SOURCE ZONES
    # --------------------------------------------------------

    "source_zones": [
        {
            "candidate": "#1583",
            "latitude": 13.439951,
            "longitude": 80.432150,
        },
        {
            "candidate": "#1385",
            "latitude": 13.459057,
            "longitude": 80.442537,
        },
        {
            "candidate": "#2416",
            "latitude": 13.324911,
            "longitude": 80.540516,
        },
    ],

    # --------------------------------------------------------
    # HISTORICAL VALIDATION VESSELS
    # --------------------------------------------------------

    "historical_vessels": [
        {
            "name": "MT DAWN KANCHIPURAM",
            "type": "Oil / Product Tanker",
            "role": "SPILL-SOURCE VESSEL",
        },
        {
            "name": "BW MAPLE",
            "type": "LPG Carrier",
            "role": "COLLISION PARTICIPANT",
        },
    ],
}


# ============================================================
# UNKNOWN SPILL INVESTIGATION - SYNTHETIC AIS DATA
# ============================================================
#
# IMPORTANT:
# These are DEMO AIS records for the unknown-spill mode.
# They are NOT claimed to be real historical AIS records.
#
# The purpose is to demonstrate how MARIS ranks vessels
# based on spatial proximity, temporal proximity and vessel
# relevance.
# ============================================================

INVESTIGATION_VESSELS = [
    {
        "name": "MV CORAL STAR",
        "type": "Oil / Product Tanker",
        "latitude": 13.4382,
        "longitude": 80.4351,
        "hours_from_event": 0.8,
    },

    {
        "name": "MV EASTERN WIND",
        "type": "Container Vessel",
        "latitude": 13.4210,
        "longitude": 80.4490,
        "hours_from_event": 2.1,
    },

    {
        "name": "MV OCEAN QUEST",
        "type": "Cargo Vessel",
        "latitude": 13.3900,
        "longitude": 80.4700,
        "hours_from_event": 3.4,
    },

    {
        "name": "MV BLUE HORIZON",
        "type": "LPG Carrier",
        "latitude": 13.3100,
        "longitude": 80.5200,
        "hours_from_event": 5.2,
    },
]


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "system": "MARIS",
        "status": "online",
        "version": "1.0.0",
        "message": (
            "Maritime Intelligence & Response System "
            "backend is running."
        ),
    }


# ============================================================
# COMPLETE ENNORE CASE
# ============================================================

@app.get("/api/ennore")
def get_ennore():

    return ENNORE_CASE


# ============================================================
# SAR CANDIDATES
# ============================================================

@app.get("/api/candidates")
def get_candidates():

    return {
        "case": "ENNORE-2017",
        "count": len(ENNORE_CASE["candidates"]),
        "candidates": ENNORE_CASE["candidates"],
    }


# ============================================================
# BACKTRACKED SOURCE ZONES
# ============================================================

@app.get("/api/source-zones")
def get_source_zones():

    return {
        "case": "ENNORE-2017",
        "elapsed_hours": ENNORE_CASE["elapsed_hours"],
        "transport_km": ENNORE_CASE["ocean_model"]["transport_km"],
        "source_zones": ENNORE_CASE["source_zones"],
    }


# ============================================================
# HISTORICAL AIS VALIDATION
# ============================================================

@app.get("/api/historical-vessels")
def get_historical_vessels():

    return {
        "case": "ENNORE-2017",
        "validation": True,
        "vessels": ENNORE_CASE["historical_vessels"],
        "documented_source_vessel": (
            "MT DAWN KANCHIPURAM"
        ),
    }


# ============================================================
# UNKNOWN SPILL INVESTIGATION
# ============================================================

@app.get("/api/investigation")
def investigation():

    # --------------------------------------------------------
    # Select strongest SAR candidate
    # --------------------------------------------------------

    candidate = ENNORE_CASE["candidates"][0]

    # --------------------------------------------------------
    # Select corresponding backtracked source zone
    # --------------------------------------------------------

    source_zone = None

    for zone in ENNORE_CASE["source_zones"]:

        if zone["candidate"] == candidate["id"]:
            source_zone = zone
            break

    # Safety fallback
    if source_zone is None:
        source_zone = ENNORE_CASE["source_zones"][0]

    # --------------------------------------------------------
    # Run AIS correlation engine
    # --------------------------------------------------------

    ranked_vessels = rank_vessels(
        vessels=INVESTIGATION_VESSELS,
        source_lat=source_zone["latitude"],
        source_lon=source_zone["longitude"],
    )

    # --------------------------------------------------------
    # Highest association
    # --------------------------------------------------------

    highest_association = ranked_vessels[0]

    # --------------------------------------------------------
    # Determine investigation priority
    # --------------------------------------------------------

    score = highest_association["association_score"]

    if score >= 80:
        priority = "HIGH"

    elif score >= 60:
        priority = "MEDIUM"

    else:
        priority = "LOW"

    # --------------------------------------------------------
    # Return complete investigation result
    # --------------------------------------------------------

    return {
        "case": "UNKNOWN-SPILL-DEMO",

        "mode": "UNKNOWN SPILL INVESTIGATION",

        "data_type": "SYNTHETIC_AIS_DEMO",

        "sar_candidate": candidate,

        "source_zone": source_zone,

        "elapsed_hours": ENNORE_CASE["elapsed_hours"],

        "vessels": ranked_vessels,

        "highest_association": highest_association,

        "investigation_priority": priority,

        "weights": {
            "spatial_proximity": 45,
            "temporal_proximity": 30,
            "vessel_relevance": 25,
        },

        "method": {
            "spatial": (
                "Closer AIS vessel position to the "
                "backtracked source zone increases score."
            ),
            "temporal": (
                "AIS presence closer to the estimated "
                "spill/source time increases score."
            ),
            "vessel_relevance": (
                "Vessel type is used as contextual relevance, "
                "not as proof of responsibility."
            ),
        },

        "disclaimer": (
            "Association score is an investigative ranking "
            "and does not establish legal responsibility."
        ),
    }


# ============================================================
# REPLAY ENGINE
# ============================================================

@app.get("/api/replay")
async def replay():

    events = []

    # --------------------------------------------------------
    # STAGE 1 - SATELLITE
    # --------------------------------------------------------

    events.append(
        {
            "stage": "satellite",
            "status": "complete",
            "message": "Sentinel-1A acquisition loaded",
            "progress": 20,
        }
    )

    await asyncio.sleep(0.5)

    # --------------------------------------------------------
    # STAGE 2 - SAR
    # --------------------------------------------------------

    events.append(
        {
            "stage": "sar",
            "status": "complete",
            "message": "VV + VH SAR processing complete",
            "progress": 40,
        }
    )

    await asyncio.sleep(0.5)

    # --------------------------------------------------------
    # STAGE 3 - DETECTION
    # --------------------------------------------------------

    events.append(
        {
            "stage": "detection",
            "status": "complete",
            "message": "3 maritime dark anomalies detected",
            "progress": 55,
            "candidates": ENNORE_CASE["candidates"],
        }
    )

    await asyncio.sleep(0.5)

    # --------------------------------------------------------
    # STAGE 4 - BACKTRACKING
    # --------------------------------------------------------

    events.append(
        {
            "stage": "backtracking",
            "status": "complete",
            "message": "Ocean-current backtracking complete",
            "progress": 70,
            "elapsed_hours": ENNORE_CASE["elapsed_hours"],
            "transport_km": ENNORE_CASE["ocean_model"][
                "transport_km"
            ],
            "source_zones": ENNORE_CASE["source_zones"],
        }
    )

    await asyncio.sleep(0.5)

    # --------------------------------------------------------
    # STAGE 5 - AIS
    # --------------------------------------------------------

    events.append(
        {
            "stage": "ais",
            "status": "complete",
            "message": "AIS correlation complete",
            "progress": 85,
            "vessels": ENNORE_CASE["historical_vessels"],
        }
    )

    await asyncio.sleep(0.5)

    # --------------------------------------------------------
    # STAGE 6 - ALERT
    # --------------------------------------------------------

    events.append(
        {
            "stage": "alert",
            "status": "alert",
            "message": "Potential oil-spill event identified",
            "progress": 100,

            "alert": {
                "severity": "HIGH",

                "location": {
                    "latitude": (
                        ENNORE_CASE["candidates"][0]["latitude"]
                    ),
                    "longitude": (
                        ENNORE_CASE["candidates"][0]["longitude"]
                    ),
                },

                "sar_confidence": "HIGH",

                "source_confidence": "MEDIUM",

                "historical_validation": True,

                "documented_source_vessel": (
                    "MT DAWN KANCHIPURAM"
                ),
            },
        }
    )

    return {
        "case": "ENNORE-2017",
        "replay": events,
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
    }