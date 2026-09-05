import { useMemo, useState } from "react";
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";


// ============================================================
// MARIS MAP
// ============================================================

const INITIAL_VIEW = {
  longitude: 80.43,
  latitude: 13.34,
  zoom: 10.3,
};


// ============================================================
// HISTORICAL INCIDENT
// ============================================================

const HISTORICAL_INCIDENT = {
  latitude: 13.2282,
  longitude: 80.3633,
};


// ============================================================
// SAR CANDIDATES
// ============================================================

const SAR_CANDIDATES = [
  {
    id: "#1583",
    latitude: 13.233286,
    longitude: 80.389185,
    confidence: "HIGH",
    score: 86,
  },

  {
    id: "#1385",
    latitude: 13.252392,
    longitude: 80.399569,
    confidence: "MEDIUM",
    score: 78,
  },

  {
    id: "#2416",
    latitude: 13.118246,
    longitude: 80.497572,
    confidence: "LOW",
    score: 62,
  },
];


// ============================================================
// BACKTRACKED SOURCE ZONES
// ============================================================

const SOURCE_ZONES = [
  {
    candidate: "#1583",
    latitude: 13.439951,
    longitude: 80.432150,
  },

  {
    candidate: "#1385",
    latitude: 13.459057,
    longitude: 80.442537,
  },

  {
    candidate: "#2416",
    latitude: 13.324911,
    longitude: 80.540516,
  },
];


// ============================================================
// HISTORICAL VESSELS
// ============================================================

const HISTORICAL_VESSELS = [
  {
    name: "MT DAWN KANCHIPURAM",
    type: "Oil / Product Tanker",

    // Visual validation position only.
    // Not claimed as exact AIS position.
    latitude: 13.2270,
    longitude: 80.3720,

    role: "SPILL-SOURCE VESSEL",
  },

  {
    name: "BW MAPLE",
    type: "LPG Carrier",

    // Visual validation position only.
    latitude: 13.2300,
    longitude: 80.3570,

    role: "COLLISION PARTICIPANT",
  },
];


// ============================================================
// SYNTHETIC INVESTIGATION AIS
// ============================================================

const INVESTIGATION_VESSELS = [
  {
    name: "MV CORAL STAR",
    type: "Oil / Product Tanker",
    latitude: 13.4382,
    longitude: 80.4351,
    score: 95.4,
  },

  {
    name: "MV EASTERN WIND",
    type: "Container Vessel",
    latitude: 13.4210,
    longitude: 80.4490,
    score: 74.1,
  },

  {
    name: "MV OCEAN QUEST",
    type: "Cargo Vessel",
    latitude: 13.3900,
    longitude: 80.4700,
    score: 63.9,
  },

  {
    name: "MV BLUE HORIZON",
    type: "LPG Carrier",
    latitude: 13.3100,
    longitude: 80.5200,
    score: 35.6,
  },
];


// ============================================================
// SOURCE ZONE GEOJSON
// ============================================================

function createLine(
  startLat,
  startLon,
  endLat,
  endLon
) {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [startLon, startLat],
        [endLon, endLat],
      ],
    },
  };
}


// ============================================================
// MAP COMPONENT
// ============================================================

function MapView({
  mode,
  selectedCandidate,
  onCandidateSelect,
}) {

  const [popup, setPopup] = useState(null);


  // ==========================================================
  // ACTIVE CANDIDATE
  // ==========================================================

  const activeCandidate =
    SAR_CANDIDATES.find(
      candidate =>
        candidate.id === selectedCandidate
    ) || SAR_CANDIDATES[0];


  // ==========================================================
  // BACKTRACKING LINES
  // ==========================================================

  const sourceLines = useMemo(() => {

    return SOURCE_ZONES.map(zone => {

      const candidate =
        SAR_CANDIDATES.find(
          item =>
            item.id === zone.candidate
        );

      if (!candidate) {
        return null;
      }

      return createLine(
        candidate.latitude,
        candidate.longitude,
        zone.latitude,
        zone.longitude
      );

    }).filter(Boolean);

  }, []);


  // ==========================================================
  // GEOJSON
  // ==========================================================

  const sourceGeoJSON = {
    type: "FeatureCollection",

    features: sourceLines,
  };


  // ==========================================================
  // MAP
  // ==========================================================

  return (

    <div
      className="maris-map"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
        position: "relative",
      }}
    >

      <Map

        initialViewState={INITIAL_VIEW}

        mapStyle={{
          version: 8,

          sources: {

            "osm-tiles": {
              type: "raster",

              tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],

              tileSize: 256,

              attribution:
                "© OpenStreetMap contributors",
            },

          },

          layers: [

            {
              id: "osm",

              type: "raster",

              source: "osm-tiles",

              paint: {
                "raster-opacity": 0.72,
              },
            },

          ],
        }}

        style={{
          width: "100%",
          height: "100%",
        }}

      >

        <NavigationControl
          position="bottom-right"
        />


        {/* ==================================================
            BACKTRACKING LINES
        ================================================== */}

        <Source
          id="backtracking-lines"
          type="geojson"
          data={sourceGeoJSON}
        >

          <Layer

            id="backtracking-layer"

            type="line"

            paint={{
              "line-color": "#00d9ff",
              "line-width": 2,
              "line-dasharray": [
                4,
                4,
              ],
              "line-opacity": 0.7,
            }}

          />

        </Source>


        {/* ==================================================
            HISTORICAL INCIDENT
        ================================================== */}

        {mode === "historical" && (

          <Marker

            longitude={
              HISTORICAL_INCIDENT.longitude
            }

            latitude={
              HISTORICAL_INCIDENT.latitude
            }

            anchor="center"

          >

            <div
              className="historical-marker"
              onClick={() =>
                setPopup({
                  type: "incident",
                  latitude:
                    HISTORICAL_INCIDENT.latitude,
                  longitude:
                    HISTORICAL_INCIDENT.longitude,
                })
              }
            >

              <div className="incident-pulse" />

              <div className="incident-dot">
                ⚠
              </div>

            </div>

          </Marker>

        )}


        {/* ==================================================
            SAR CANDIDATES
        ================================================== */}

        {SAR_CANDIDATES.map(
          candidate => (

            <Marker

              key={candidate.id}

              longitude={
                candidate.longitude
              }

              latitude={
                candidate.latitude
              }

              anchor="center"

            >

              <div

                className={
                  candidate.id ===
                  activeCandidate.id
                    ? "sar-marker selected"
                    : "sar-marker"
                }

                onClick={() => {

                  onCandidateSelect(
                    candidate.id
                  );

                  setPopup({
                    type: "candidate",
                    data: candidate,
                  });

                }}

              >

                <div className="sar-glow" />

                <div className="sar-dot">

                  {candidate.id}

                </div>

              </div>

            </Marker>

          )
        )}


        {/* ==================================================
            SOURCE ZONES
        ================================================== */}

        {SOURCE_ZONES.map(
          zone => (

            <Marker

              key={
                `source-${zone.candidate}`
              }

              longitude={
                zone.longitude
              }

              latitude={
                zone.latitude
              }

              anchor="center"

            >

              <div

                className="source-marker"

                onClick={() =>
                  setPopup({
                    type: "source",
                    data: zone,
                  })
                }

              >

                <div className="source-ring" />

                <div className="source-dot" />

              </div>

            </Marker>

          )
        )}


        {/* ==================================================
            HISTORICAL VESSELS
        ================================================== */}

        {mode === "historical" &&
          HISTORICAL_VESSELS.map(
            vessel => (

              <Marker

                key={vessel.name}

                longitude={
                  vessel.longitude
                }

                latitude={
                  vessel.latitude
                }

                anchor="center"

              >

                <div

                  className="ais-marker"

                  onClick={() =>
                    setPopup({
                      type: "vessel",
                      data: vessel,
                    })
                  }

                >

                  🚢

                </div>

              </Marker>

            )
          )}


        {/* ==================================================
            INVESTIGATION AIS
        ================================================== */}

        {mode === "investigation" &&
          INVESTIGATION_VESSELS.map(
            vessel => (

              <Marker

                key={vessel.name}

                longitude={
                  vessel.longitude
                }

                latitude={
                  vessel.latitude
                }

                anchor="center"

              >

                <div

                  className={
                    vessel.name ===
                    "MV CORAL STAR"
                      ? "investigation-vessel top"
                      : "investigation-vessel"
                  }

                  onClick={() =>
                    setPopup({
                      type: "investigation",
                      data: vessel,
                    })
                  }

                >

                  <div className="vessel-dot">
                    🚢
                  </div>

                </div>

              </Marker>

            )
          )}


        {/* ==================================================
            POPUP
        ================================================== */}

        {popup && (

          <Popup

            longitude={
              popup.data?.longitude ??
              popup.longitude
            }

            latitude={
              popup.data?.latitude ??
              popup.latitude
            }

            anchor="top"

            closeOnClick={false}

            onClose={() =>
              setPopup(null)
            }

          >

            {popup.type === "candidate" && (

              <div className="map-popup">

                <strong>
                  SAR CANDIDATE
                </strong>

                <div>
                  {popup.data.id}
                </div>

                <small>
                  Confidence:
                  {" "}
                  {popup.data.confidence}
                </small>

                <small>
                  Score:
                  {" "}
                  {popup.data.score}%
                </small>

              </div>

            )}


            {popup.type === "source" && (

              <div className="map-popup">

                <strong>
                  BACKTRACKED SOURCE ZONE
                </strong>

                <div>
                  {popup.data.candidate}
                </div>

                <small>
                  {popup.data.latitude.toFixed(5)}
                  {"°N"}
                </small>

                <small>
                  {popup.data.longitude.toFixed(5)}
                  {"°E"}
                </small>

              </div>

            )}


            {popup.type === "incident" && (

              <div className="map-popup">

                <strong>
                  HISTORICAL INCIDENT
                </strong>

                <div>
                  ENNORE OIL SPILL
                </div>

                <small>
                  28 Jan 2017
                </small>

              </div>

            )}


            {popup.type === "vessel" && (

              <div className="map-popup">

                <strong>
                  {popup.data.name}
                </strong>

                <div>
                  {popup.data.type}
                </div>

                <small>
                  {popup.data.role}
                </small>

              </div>

            )}


            {popup.type === "investigation" && (

              <div className="map-popup">

                <strong>
                  AIS INVESTIGATION
                </strong>

                <div>
                  {popup.data.name}
                </div>

                <small>
                  {popup.data.type}
                </small>

                <small>
                  Association:
                  {" "}
                  {popup.data.score}%
                </small>

              </div>

            )}

          </Popup>

        )}

      </Map>


      {/* ====================================================
          MAP STATUS PANEL
      ==================================================== */}

      <div className="map-status-panel">

        <div className="map-brand">
          MARIS
        </div>

        <div className="map-status-line">

          <span className="map-status-dot" />

          SATELLITE LINK ACTIVE

        </div>

        <div className="map-status-line">

          <span className="map-status-dot" />

          AIS CORRELATION READY

        </div>

        <div className="map-status-line">

          <span className="map-status-dot" />

          OCEAN MODEL LOADED

        </div>

      </div>


      {/* ====================================================
          MODE BADGE
      ==================================================== */}

      <div className="map-mode-badge">

        {mode === "historical"
          ? "HISTORICAL VALIDATION"
          : "UNKNOWN SPILL INVESTIGATION"}

      </div>


      {/* ====================================================
          LEGEND
      ==================================================== */}

      <div className="map-legend">

        <div className="legend-title">
          EVIDENCE LAYERS
        </div>


        <div className="legend-row">

          <span className="legend-sar" />

          SAR Candidate

        </div>


        <div className="legend-row">

          <span className="legend-source" />

          Backtracked Source Zone

        </div>


        <div className="legend-row">

          <span className="legend-ais" />

          AIS Vessel

        </div>


        <div className="legend-row">

          <span className="legend-incident" />

          Historical Incident

        </div>

      </div>

    </div>
  );
}


export default MapView;