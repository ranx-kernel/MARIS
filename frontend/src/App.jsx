import { useEffect, useState } from "react";
import MapView from "./components/MapView";
import "./App.css";


/* ============================================================
   MARIS
   Maritime Intelligence & Response System
   ============================================================ */

const API_BASE = "http://127.0.0.1:8000";


/* ============================================================
   SYNTHETIC AIS DATA
   ------------------------------------------------------------
   DEMO ONLY.
   These vessels are NOT real investigation results.
   They simulate AIS candidates for the prototype.
   ============================================================ */

const INVESTIGATION_VESSELS = [
  {
    name: "MV CORAL STAR",
    type: "Oil / Product Tanker",
    latitude: 13.4382,
    longitude: 80.4351,
    distance_km: 0.37,
    hours_from_event: 0.8,
    spatial_score: 98.75,
    temporal_score: 86.67,
    vessel_relevance: 100.0,
    association_score: 95.4,
    rank: 1,
  },

  {
    name: "MV EASTERN WIND",
    type: "Container Vessel",
    latitude: 13.421,
    longitude: 80.449,
    distance_km: 2.79,
    hours_from_event: 2.1,
    spatial_score: 90.71,
    temporal_score: 65.0,
    vessel_relevance: 55.0,
    association_score: 74.1,
    rank: 2,
  },

  {
    name: "MV OCEAN QUEST",
    type: "Cargo Vessel",
    latitude: 13.39,
    longitude: 80.47,
    distance_km: 6.9,
    hours_from_event: 3.4,
    spatial_score: 77.0,
    temporal_score: 43.33,
    vessel_relevance: 65.0,
    association_score: 63.9,
    rank: 3,
  },

  {
    name: "MV BLUE HORIZON",
    type: "LPG Carrier",
    latitude: 13.31,
    longitude: 80.52,
    distance_km: 17.29,
    hours_from_event: 5.2,
    spatial_score: 42.35,
    temporal_score: 13.33,
    vessel_relevance: 50.0,
    association_score: 35.6,
    rank: 4,
  },
];


/* ============================================================
   INVESTIGATION DATA
   ============================================================ */

const INVESTIGATION_DATA = {
  case: "UNKNOWN-SPILL-DEMO",

  mode: "UNKNOWN SPILL INVESTIGATION",

  data_type: "SYNTHETIC_AIS_DEMO",

  sar_candidate: {
    id: "#1583",
    latitude: 13.233286,
    longitude: 80.389185,
    area_km2: 0.0312,
    mean_vv_db: -24.03,
    mean_vh_db: -24.63,
    confidence: "HIGH",
    score: 86,
  },

  source_zone: {
    candidate: "#1583",
    latitude: 13.439951,
    longitude: 80.43215,
  },

  elapsed_hours: 26.18,

  vessels: INVESTIGATION_VESSELS,

  highest_association: INVESTIGATION_VESSELS[0],

  investigation_priority: "HIGH",

  weights: {
    spatial_proximity: 45,
    temporal_proximity: 30,
    vessel_relevance: 25,
  },

  disclaimer:
    "Association score is an investigative ranking and does not establish legal responsibility.",
};


/* ============================================================
   COMPONENT
   ============================================================ */

function App() {

  /* ==========================================================
     MODE
     ========================================================== */

  const [mode, setMode] = useState("historical");


  /* ==========================================================
     HISTORICAL CASE DATA
     ========================================================== */

  const [caseData, setCaseData] = useState(null);

  const [selectedCandidate, setSelectedCandidate] =
    useState("#1583");


  /* ==========================================================
     HISTORICAL REPLAY STATE
     ========================================================== */

  const [progress, setProgress] = useState(0);

  const [currentStage, setCurrentStage] =
    useState(null);

  const [replayEvents, setReplayEvents] =
    useState([]);

  const [replaying, setReplaying] =
    useState(false);

  const [historicalAlert, setHistoricalAlert] =
    useState(null);


  /* ==========================================================
     INVESTIGATION STATE
     ========================================================== */

  const [investigationProgress, setInvestigationProgress] =
    useState(0);

  const [investigationStage, setInvestigationStage] =
    useState(null);

  const [investigationRunning, setInvestigationRunning] =
    useState(false);

  const [investigationActive, setInvestigationActive] =
    useState(false);

  const [investigationEvents, setInvestigationEvents] =
    useState([]);

  const [investigationAlert, setInvestigationAlert] =
    useState(null);


  /* ==========================================================
     LOAD HISTORICAL ENNORE DATA
     ========================================================== */

  useEffect(() => {

    fetch(`${API_BASE}/api/ennore`)

      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to load Ennore case"
          );
        }

        return response.json();

      })

      .then((data) => {

        setCaseData(data);

        if (
          data?.candidates &&
          data.candidates.length > 0
        ) {

          setSelectedCandidate(
            data.candidates[0].id
          );

        }

      })

      .catch((error) => {

        console.error(
          "MARIS backend connection error:",
          error
        );

      });

  }, []);


  /* ==========================================================
     SWITCH MODE
     ========================================================== */

  const switchMode = (newMode) => {

    if (newMode === mode) {
      return;
    }


    /* ========================================================
       HISTORICAL MODE
       ======================================================== */

    if (newMode === "historical") {

      setMode("historical");

      /* Historical must begin at 0% */

      setProgress(0);

      setCurrentStage(null);

      setReplayEvents([]);

      setReplaying(false);

      setHistoricalAlert(null);


      /* Reset investigation */

      setInvestigationProgress(0);

      setInvestigationStage(null);

      setInvestigationRunning(false);

      setInvestigationActive(false);

      setInvestigationEvents([]);

      setInvestigationAlert(null);

      return;
    }


    /* ========================================================
       UNKNOWN INVESTIGATION MODE
       ======================================================== */

    if (newMode === "investigation") {

      setMode("investigation");

      /* Investigation must begin at 0% */

      setInvestigationProgress(0);

      setInvestigationStage(null);

      setInvestigationRunning(false);

      setInvestigationActive(false);

      setInvestigationEvents([]);

      setInvestigationAlert(null);


      /* Reset historical replay */

      setProgress(0);

      setCurrentStage(null);

      setReplayEvents([]);

      setReplaying(false);

      setHistoricalAlert(null);

    }

  };


  /* ============================================================
     HISTORICAL ENNORE REPLAY
     ============================================================ */

  const startReplay = async () => {

    if (replaying) {
      return;
    }

    if (mode !== "historical") {
      return;
    }


    setReplaying(true);

    setProgress(0);

    setCurrentStage(null);

    setReplayEvents([]);

    setHistoricalAlert(null);


    try {

      const response =
        await fetch(
          `${API_BASE}/api/replay`
        );


      if (!response.ok) {

        throw new Error(
          "Replay request failed"
        );

      }


      const data =
        await response.json();


      if (
        !data.replay ||
        !Array.isArray(data.replay)
      ) {

        throw new Error(
          "Invalid replay response"
        );

      }


      /* Process each pipeline stage */

      for (
        let i = 0;
        i < data.replay.length;
        i++
      ) {

        const event =
          data.replay[i];


        setCurrentStage(
          event.stage
        );


        setProgress(
          event.progress
        );


        setReplayEvents(
          (previous) => [
            ...previous,
            event,
          ]
        );


        /* Update candidate */

        if (
          event.stage === "detection" &&
          event.candidates &&
          event.candidates.length > 0
        ) {

          setSelectedCandidate(
            event.candidates[0].id
          );

        }


        /* Final alert */

        if (
          event.stage === "alert" &&
          event.alert
        ) {

          setHistoricalAlert(
            event.alert
          );

        }


        /* Replay timing */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

      }

    }

    catch (error) {

      console.error(
        "ENNORE REPLAY ERROR:",
        error
      );

    }

    finally {

      setReplaying(false);

    }

  };


  /* ============================================================
     UNKNOWN SPILL INVESTIGATION
     ============================================================ */

  const startInvestigation = async () => {

    if (investigationRunning) {
      return;
    }

    if (mode !== "investigation") {
      return;
    }


    /* ========================================================
       RESET
       ======================================================== */

    setInvestigationRunning(true);

    setInvestigationActive(false);

    setInvestigationProgress(0);

    setInvestigationStage(null);

    setInvestigationEvents([]);

    setInvestigationAlert(null);


    /* ========================================================
       PIPELINE STAGES
       ======================================================== */

    const stages = [

      {
        stage: "satellite",
        progress: 20,
        message:
          "SAR acquisition available",
      },

      {
        stage: "sar",
        progress: 40,
        message:
          "Dual-pol VV + VH anomaly analysis complete",
      },

      {
        stage: "detection",
        progress: 55,
        message:
          "Candidate #1583 selected",
      },

      {
        stage: "backtracking",
        progress: 70,
        message:
          "Ocean-current source backtracking complete",
      },

      {
        stage: "ais",
        progress: 85,
        message:
          "AIS vessel correlation complete",
      },

      {
        stage: "result",
        progress: 100,
        message:
          "Highest association ranked",
      },

    ];


    /* ========================================================
       RUN EACH STAGE
       ======================================================== */

    for (
      const event of stages
    ) {

      setInvestigationStage(
        event.stage
      );

      setInvestigationProgress(
        event.progress
      );


      setInvestigationEvents(
        (previous) => [
          ...previous,
          event,
        ]
      );


      /* ======================================================
         FINAL INVESTIGATION RESULT
         ====================================================== */

      if (
        event.stage === "result"
      ) {

        setInvestigationActive(
          true
        );


        setInvestigationAlert({

          severity: "HIGH",

          location: {

            latitude:
              INVESTIGATION_DATA
                .sar_candidate
                .latitude,

            longitude:
              INVESTIGATION_DATA
                .sar_candidate
                .longitude,

          },

          sar_confidence: "HIGH",

          source_confidence: "MEDIUM",

          historical_validation: false,

        });

      }


      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000
          )
      );

    }


    setInvestigationRunning(
      false
    );

  };


  /* ============================================================
     RESET HISTORICAL
     ============================================================ */

  const resetHistorical = () => {

    setProgress(0);

    setCurrentStage(null);

    setReplayEvents([]);

    setReplaying(false);

    setHistoricalAlert(null);

  };


  /* ============================================================
     RESET INVESTIGATION
     ============================================================ */

  const resetInvestigation = () => {

    setInvestigationProgress(0);

    setInvestigationStage(null);

    setInvestigationRunning(false);

    setInvestigationActive(false);

    setInvestigationEvents([]);

    setInvestigationAlert(null);

  };


  /* ============================================================
     RESET CURRENT MODE
     ============================================================ */

  const resetCurrentMode = () => {

    if (mode === "historical") {

      resetHistorical();

    } else {

      resetInvestigation();

    }

  };


  /* ============================================================
     DERIVED DATA
     ============================================================ */

  const isHistorical =
    mode === "historical";

  const isInvestigation =
    mode === "investigation";


  const candidates =
    caseData?.candidates || [];


  const historicalVessels =
    caseData?.historical_vessels || [];


  const oceanModel =
    caseData?.ocean_model || null;


  const satellite =
    caseData?.satellite || null;


  const incident =
    caseData?.incident || null;


  /* ============================================================
     CURRENT PROGRESS
     ============================================================ */

  const displayedProgress =
    isHistorical
      ? progress
      : investigationProgress;


  /* ============================================================
     CURRENT PIPELINE LABEL
     ============================================================ */

  const getStageLabel = () => {

    if (isHistorical) {

      switch (currentStage) {

        case "satellite":
          return "SATELLITE INGESTION";

        case "sar":
          return "SAR PROCESSING";

        case "detection":
          return "ANOMALY DETECTION";

        case "backtracking":
          return "SOURCE BACKTRACKING";

        case "ais":
          return "AIS CORRELATION";

        case "alert":
          return "ALERT";

        default:
          return "READY";

      }

    }


    switch (investigationStage) {

      case "satellite":
        return "SATELLITE INGESTION";

      case "sar":
        return "SAR PROCESSING";

      case "detection":
        return "ANOMALY DETECTION";

      case "backtracking":
        return "SOURCE BACKTRACKING";

      case "ais":
        return "AIS CORRELATION";

      case "result":
        return "INVESTIGATION RESULT";

      default:
        return "INVESTIGATION READY";

    }

  };


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <div className="app">


      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="topbar">


        {/* ====================================================
            MARIS BRAND
            ==================================================== */}

        <div className="brand">


          {/* CLEAN MARIS ICON */}

          <div className="brand-logo-container">
  <svg
    className="maris-logo-svg"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="MARIS logo"
  >
    {/* Outer shield */}
    <path
      d="M50 5
         L88 18
         L84 58
         C81 77 68 91 50 96
         C32 91 19 77 16 58
         L12 18
         Z"
      fill="#071923"
      stroke="#00D9FF"
      strokeWidth="3"
    />

    {/* Ocean wave */}
    <path
      d="M20 55
         C30 48 38 50 46 57
         C54 64 63 64 78 53"
      fill="none"
      stroke="#00D9FF"
      strokeWidth="6"
      strokeLinecap="round"
    />

    <path
      d="M20 67
         C31 60 40 62 48 69
         C56 76 66 75 78 65"
      fill="none"
      stroke="#008FB3"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Maritime vessel silhouette */}
    <path
      d="M29 43
         L34 30
         L67 30
         L73 43
         L80 48
         L76 53
         L25 53
         L20 48
         Z"
      fill="#00D9FF"
    />

    {/* Ship cabin */}
    <rect
      x="42"
      y="22"
      width="17"
      height="9"
      rx="2"
      fill="#00D9FF"
    />

    {/* Radar / signal */}
    <path
      d="M50 13
         L50 22
         M42 17
         Q50 9 58 17"
      fill="none"
      stroke="#00D9FF"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* MARIS M */}
    <text
      x="50"
      y="88"
      textAnchor="middle"
      fill="#FFFFFF"
      fontSize="18"
      fontWeight="900"
      fontFamily="Arial, Helvetica, sans-serif"
      letterSpacing="2"
    >
      M
    </text>
  </svg>
</div>


          {/* BRAND TEXT */}

          <div className="brand-text">


            <div className="brand-name">

              MARIS

            </div>


            <div className="brand-subtitle">

              MARITIME INTELLIGENCE & RESPONSE SYSTEM

            </div>


          </div>


        </div>


        {/* ====================================================
            MODE SWITCH
            ==================================================== */}

        <div className="mode-switch">


          <button

            className={
              mode === "historical"
                ? "mode-button active"
                : "mode-button"
            }

            onClick={() =>
              switchMode("historical")
            }

          >

            HISTORICAL VALIDATION

          </button>


          <button

            className={
              mode === "investigation"
                ? "mode-button active"
                : "mode-button"
            }

            onClick={() =>
              switchMode("investigation")
            }

          >

            UNKNOWN SPILL INVESTIGATION

          </button>


        </div>


        {/* ====================================================
            SYSTEM STATUS
            ==================================================== */}

        <div className="system-status">

          <span className="status-dot"></span>

          SYSTEM ONLINE

        </div>


      </header>


      {/* ======================================================
          MAIN DASHBOARD
          ====================================================== */}

      <main className="dashboard">


        {/* ====================================================
            LEFT PANEL
            ==================================================== */}

        <aside className="left-panel">


          {/* PANEL TITLE */}

          <div className="panel-header">


            <div className="panel-title">

              {isHistorical
                ? "LIVE MONITOR"
                : "LIVE INVESTIGATION"}

            </div>


            <div className="panel-status">

              ● LIVE

            </div>


          </div>


          {/* ==================================================
              PIPELINE
              ================================================== */}

          <div className="progress-section">


            <div className="progress-label">


              <span>
                PIPELINE
              </span>


              <strong>

                {displayedProgress}%

              </strong>


            </div>


            <div className="progress-bar">


              <div

                className="progress-fill"

                style={{
                  width:
                    `${displayedProgress}%`,
                }}

              />

            </div>


            <div className="stage-name">

              {getStageLabel()}

            </div>


          </div>


          {/* ==================================================
              HISTORICAL CONTROLS
              ================================================== */}

          {isHistorical && (

            <div className="replay-controls">


              <button

                className="replay-button"

                onClick={startReplay}

                disabled={replaying}

              >

                {replaying
                  ? "● REPLAY RUNNING..."
                  : "▶ START ENNORE REPLAY"}

              </button>


              <button

                className="reset-button"

                onClick={resetCurrentMode}

              >

                ↻ RESET

              </button>


            </div>

          )}


          {/* ==================================================
              INVESTIGATION CONTROLS
              ================================================== */}

          {isInvestigation && (

            <>


              <div className="replay-controls">


                <button

                  className="replay-button"

                  onClick={
                    startInvestigation
                  }

                  disabled={
                    investigationRunning
                  }

                >

                  {investigationRunning

                    ? "● INVESTIGATION RUNNING..."

                    : investigationActive

                      ? "↻ RUN INVESTIGATION AGAIN"

                      : "▶ START SPILL INVESTIGATION"}

                </button>


                <button

                  className="reset-button"

                  onClick={resetCurrentMode}

                >

                  ↻ RESET

                </button>


              </div>


              <div className="investigation-live-status">


                <div className="live-status-dot">

                  ●

                </div>


                <div>


                  <strong>

                    {investigationActive

                      ? "INVESTIGATION COMPLETE"

                      : investigationRunning

                        ? "INVESTIGATION RUNNING"

                        : "INVESTIGATION READY"}

                  </strong>


                  <span>

                    {investigationActive

                      ? "AIS correlation engine completed"

                      : investigationRunning

                        ? "Correlating multi-source evidence"

                        : "Awaiting investigation start"}

                  </span>


                </div>


              </div>


            </>

          )}


          {/* ==================================================
              EVENT TIMELINE
              ================================================== */}

          <div className="timeline">


            <div className="timeline-title">

              EVENT TIMELINE

            </div>


            {/* HISTORICAL TIMELINE */}

            {isHistorical && (

              replayEvents.length === 0

                ? (

                  <div className="timeline-empty">

                    Waiting for replay...

                  </div>

                )

                : (

                  replayEvents.map(
                    (event, index) => (

                      <div

                        className="timeline-event"

                        key={
                          `${event.stage}-${index}`
                        }

                      >


                        <div className="timeline-marker">

                          ✓

                        </div>


                        <div>


                          <div className="timeline-stage">

                            {event.stage.toUpperCase()}

                          </div>


                          <div className="timeline-message">

                            {event.message}

                          </div>


                        </div>


                      </div>

                    )
                  )

                )

            )}


            {/* INVESTIGATION TIMELINE */}

            {isInvestigation && (

              investigationEvents.length === 0

                ? (

                  <div className="timeline-empty">

                    Waiting for investigation...

                  </div>

                )

                : (

                  investigationEvents.map(
                    (event, index) => (

                      <div

                        className="timeline-event"

                        key={
                          `investigation-${event.stage}-${index}`
                        }

                      >


                        <div className="timeline-marker">

                          ✓

                        </div>


                        <div>


                          <div className="timeline-stage">

                            {event.stage.toUpperCase()}

                          </div>


                          <div className="timeline-message">

                            {event.message}

                          </div>


                        </div>


                      </div>

                    )
                  )

                )

            )}


          </div>


          {/* ==================================================
              HISTORICAL SATELLITE CARD
              ================================================== */}

          {isHistorical &&
            satellite && (

              <div className="info-card">


                <div className="card-label">

                  SATELLITE

                </div>


                <div className="card-value">

                  {satellite.platform}

                </div>


                <div className="card-meta">

                  {satellite.acquisition_date}

                  {" • "}

                  {satellite.acquisition_time_ist}

                </div>


                <div className="card-meta">

                  {satellite.polarization}

                  {" • "}

                  {satellite.mode}

                </div>


              </div>

            )}


          {/* ==================================================
              INVESTIGATION SATELLITE CARD
              ================================================== */}

          {isInvestigation && (

            <div className="info-card">


              <div className="card-label">

                SATELLITE

              </div>


              <div className="card-value">

                SENTINEL-1A

              </div>


              <div className="card-meta">

                SAR acquisition available

              </div>


              <div className="card-meta">

                Dual-pol VV + VH

              </div>


            </div>

          )}


          {/* ==================================================
              HISTORICAL CANDIDATES
              ================================================== */}

          {isHistorical &&
            candidates.length > 0 && (

              <div className="candidate-section">


                <div className="card-label">

                  SAR CANDIDATES

                </div>


                {candidates.map(
                  (candidate) => (

                    <div

                      key={candidate.id}

                      className={
                        selectedCandidate ===
                        candidate.id

                          ? "candidate-row selected"

                          : "candidate-row"
                      }

                      onClick={() =>
                        setSelectedCandidate(
                          candidate.id
                        )
                      }

                    >


                      <div>


                        <strong>

                          {candidate.id}

                        </strong>


                        <span>

                          {candidate.area_km2}
                          {" km²"}

                        </span>


                      </div>


                      <span

                        className={
                          `confidence ${candidate.confidence.toLowerCase()}`
                        }

                      >

                        {candidate.confidence}

                      </span>


                    </div>

                  )
                )}


              </div>

            )}


          {/* ==================================================
              INVESTIGATION CANDIDATE
              ================================================== */}

          {isInvestigation && (

            <div className="candidate-section">


              <div className="card-label">

                SELECTED SAR CANDIDATE

              </div>


              <div className="candidate-row selected">


                <div>


                  <strong>

                    #1583

                  </strong>


                  <span>

                    0.0312 km²

                  </span>


                </div>


                <span className="confidence high">

                  HIGH

                </span>


              </div>


            </div>

          )}


          {/* ==================================================
              HISTORICAL OCEAN MODEL
              ================================================== */}

          {isHistorical &&
            oceanModel && (

              <div className="info-card">


                <div className="card-label">

                  OCEAN MODEL

                </div>


                <div className="card-value">

                  {oceanModel.name}

                </div>


                <div className="card-meta">

                  Speed:
                  {" "}
                  {oceanModel.speed_ms}
                  {" m/s"}

                </div>


                <div className="card-meta">

                  Transport:
                  {" "}
                  {oceanModel.transport_km}
                  {" km"}

                </div>


              </div>

            )}


          {/* ==================================================
              INVESTIGATION SOURCE ZONE
              ================================================== */}

          {isInvestigation && (

            <div className="source-card">


              <div className="card-label">

                BACKTRACKED SOURCE ZONE

              </div>


              <div className="source-coordinate">

                13.439951° N

              </div>


              <div className="source-coordinate">

                80.432150° E

              </div>


              <div className="card-meta">

                Transport:
                {" "}
                23.47 km

              </div>


            </div>

          )}


        </aside>


        {/* ====================================================
            CENTER MAP
            ==================================================== */}

        <section className="map-panel">


          <MapView

            mode={mode}

            selectedCandidate={
              selectedCandidate
            }

            onCandidateSelect={
              setSelectedCandidate
            }

          />


          {/* ==================================================
              HISTORICAL ALERT
              ================================================== */}

          {isHistorical &&
            historicalAlert && (

              <div className="map-alert">


                <div className="alert-icon">

                  ⚠

                </div>


                <div>


                  <div className="map-alert-title">

                    POTENTIAL OIL SPILL

                  </div>


                  <div className="map-alert-text">

                    Multi-source evidence
                    correlation completed

                  </div>


                </div>


                <div className="alert-confidence">

                  {historicalAlert.severity}

                </div>


              </div>

            )}


          {/* ==================================================
              INVESTIGATION ALERT

              IMPORTANT:
              This only appears AFTER 100%.
              ================================================== */}

          {isInvestigation &&
            investigationActive &&
            investigationAlert && (

              <div className="map-alert">


                <div className="alert-icon">

                  ⚠

                </div>


                <div>


                  <div className="map-alert-title">

                    POTENTIAL OIL SPILL

                  </div>


                  <div className="map-alert-text">

                    Multi-source evidence
                    correlation completed

                  </div>


                </div>


                <div className="alert-confidence">

                  {investigationAlert.severity}

                </div>


              </div>

            )}


        </section>


        {/* ====================================================
            RIGHT PANEL
            ==================================================== */}

        <aside className="right-panel">


          {/* ==================================================
              HISTORICAL VALIDATION
              ================================================== */}

          {isHistorical && (

            <>


              <div className="panel-header">


                <div className="panel-title">

                  HISTORICAL AIS VALIDATION

                </div>


              </div>


              {/* HISTORICAL CASE */}

              <div className="validation-banner">


                <div className="validation-icon">

                  ✓

                </div>


                <div>


                  <strong>

                    HISTORICAL CASE

                  </strong>


                  <span>

                    Ennore • 28 Jan 2017

                  </span>


                </div>


              </div>


              {/* HISTORICAL VESSELS */}

              {historicalVessels.map(
                (vessel) => (

                  <div

                    className="historical-vessel"

                    key={vessel.name}

                  >


                    <div className="vessel-icon">

                      🚢

                    </div>


                    <div className="vessel-info">


                      <strong>

                        {vessel.name}

                      </strong>


                      <span>

                        {vessel.type}

                      </span>


                      <small>

                        {vessel.role}

                      </small>


                    </div>


                  </div>

                )
              )}


              {/* DOCUMENTED SOURCE */}

              <div className="validation-card">


                <div className="card-label">

                  DOCUMENTED SOURCE VESSEL

                </div>


                <div className="documented-vessel">

                  MT DAWN KANCHIPURAM

                </div>


                <div className="card-meta">

                  Historical validation reference

                </div>


              </div>


              {/* INCIDENT */}

              {incident && (

                <div className="incident-card">


                  <div className="card-label">

                    INCIDENT

                  </div>


                  <div className="incident-name">

                    {incident.name}

                  </div>


                  <div className="card-meta">

                    {incident.date}

                    {" • "}

                    {incident.time_ist}

                  </div>


                </div>

              )}


            </>

          )}


          {/* ==================================================
              UNKNOWN SPILL INVESTIGATION
              ================================================== */}

          {isInvestigation && (

            <>


              <div className="panel-header">


                <div className="panel-title">

                  UNKNOWN SPILL INVESTIGATION

                </div>


              </div>


              {/* DEMO DATA LABEL */}

              <div className="investigation-data-badge">

                SYNTHETIC AIS DEMO

              </div>


              {/* =================================================
                  BEFORE INVESTIGATION
                  ================================================= */}

              {!investigationActive && (

                <div className="investigation-ready-card">


                  <div className="card-label">

                    INVESTIGATION STATUS

                  </div>


                  <div className="investigation-ready-title">

                    {investigationRunning

                      ? "ANALYZING..."

                      : "READY TO ANALYZE"}

                  </div>


                  <div className="card-meta">

                    SAR candidate #1583 selected.

                    {" "}

                    Start the investigation to

                    {" "}

                    correlate the backtracked

                    {" "}

                    source zone with AIS.

                  </div>


                </div>

              )}


              {/* =================================================
                  AFTER INVESTIGATION
                  ================================================= */}

              {investigationActive && (

                <>


                  {/* ALERT */}

                  <div className="alert-card">


                    <div className="alert-label">

                      ⚠ POTENTIAL OIL SPILL

                    </div>


                    <div className="alert-description">

                      Multi-source evidence
                      correlation completed.

                    </div>


                  </div>


                  {/* =================================================
                      HIGHEST ASSOCIATION
                      ================================================= */}

                  <div className="association-card">


                    <div className="association-heading">

                      HIGHEST ASSOCIATION

                    </div>


                    <div className="association-name">

                      {
                        INVESTIGATION_DATA
                          .highest_association
                          .name
                      }

                    </div>


                    <div className="association-score">

                      {
                        INVESTIGATION_DATA
                          .highest_association
                          .association_score
                      }%

                    </div>


                    <div className="association-subtitle">

                      Investigation Priority #1

                    </div>


                  </div>


                  {/* =================================================
                      AIS VESSEL RANKING
                      ================================================= */}

                  <div className="vessel-ranking">


                    <div className="ranking-title">

                      AIS VESSEL RANKING

                    </div>


                    {INVESTIGATION_DATA.vessels.map(
                      (vessel) => (

                        <div

                          className={
                            vessel.rank === 1
                              ? "ranking-row top-ranked"
                              : "ranking-row"
                          }

                          key={vessel.name}

                        >


                          <div className="ranking-number">

                            #{vessel.rank}

                          </div>


                          <div className="ranking-vessel">


                            <strong>

                              {vessel.name}

                            </strong>


                            <span>

                              {vessel.type}

                            </span>


                            <small>

                              {vessel.distance_km}

                              {" km • "}

                              {vessel.hours_from_event}

                              {" h"}

                            </small>


                          </div>


                          <div className="ranking-score">

                            {vessel.association_score}%

                          </div>


                        </div>

                      )
                    )}


                  </div>


                  {/* =================================================
                      ASSOCIATION MODEL
                      ================================================= */}

                  <div className="breakdown-card">


                    <div className="model-title">

                      ASSOCIATION MODEL

                    </div>


                    <div className="breakdown-row">


                      <span>

                        Spatial proximity

                      </span>


                      <strong>

                        45%

                      </strong>


                    </div>


                    <div className="breakdown-row">


                      <span>

                        Temporal proximity

                      </span>


                      <strong>

                        30%

                      </strong>


                    </div>


                    <div className="breakdown-row">


                      <span>

                        Vessel relevance

                      </span>


                      <strong>

                        25%

                      </strong>


                    </div>


                  </div>


                  {/* =================================================
                      SOURCE ZONE
                      ================================================= */}

                  <div className="source-card">


                    <div className="card-label">

                      BACKTRACKED SOURCE ZONE

                    </div>


                    <div className="source-coordinate">

                      13.439951° N

                    </div>


                    <div className="source-coordinate">

                      80.432150° E

                    </div>


                    <div className="card-meta">

                      Estimated transport:
                      {" "}
                      23.47 km

                    </div>


                  </div>


                  {/* =================================================
                      DISCLAIMER
                      ================================================= */}

                  <div className="investigation-disclaimer">

                    {
                      INVESTIGATION_DATA
                        .disclaimer
                    }

                  </div>


                </>

              )}


            </>

          )}


        </aside>


      </main>

    </div>

  );
}


export default App;