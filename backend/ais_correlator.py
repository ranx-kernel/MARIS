from math import radians, sin, cos, sqrt, atan2


# ============================================================
# DISTANCE
# ============================================================

def haversine_km(
    lat1,
    lon1,
    lat2,
    lon2,
):
    """
    Calculate great-circle distance between two coordinates.
    """

    earth_radius_km = 6371.0

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        +
        cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a),
    )

    return earth_radius_km * c


# ============================================================
# SPATIAL SCORE
# ============================================================

def distance_score(
    distance_km,
    max_distance=30,
):
    """
    Convert distance to a 0-100 score.

    0 km  -> 100
    30 km -> 0
    """

    if distance_km >= max_distance:
        return 0.0

    score = 100 * (
        1 - distance_km / max_distance
    )

    return round(
        max(0, score),
        2,
    )


# ============================================================
# TEMPORAL SCORE
# ============================================================

def temporal_score(
    hours_from_event,
    max_hours=6,
):
    """
    Convert temporal difference to a 0-100 score.
    """

    hours = abs(hours_from_event)

    if hours >= max_hours:
        return 0.0

    score = 100 * (
        1 - hours / max_hours
    )

    return round(
        max(0, score),
        2,
    )


# ============================================================
# VESSEL RELEVANCE
# ============================================================

def vessel_type_score(
    vessel_type,
):
    """
    Contextual relevance of vessel type.

    This is NOT evidence that a vessel caused a spill.
    """

    vessel_type = vessel_type.lower()

    if "oil" in vessel_type:
        return 100.0

    if "tanker" in vessel_type:
        return 100.0

    if "product" in vessel_type:
        return 95.0

    if "cargo" in vessel_type:
        return 65.0

    if "container" in vessel_type:
        return 55.0

    if "lpg" in vessel_type:
        return 50.0

    return 40.0


# ============================================================
# ASSOCIATION SCORE
# ============================================================

def calculate_association(
    vessel,
    source_lat,
    source_lon,
):
    """
    Calculate an explainable association score.

    Current prototype weighting:

        Spatial proximity  = 45%
        Temporal proximity = 30%
        Vessel relevance   = 25%

    This is an investigation ranking,
    NOT a legal determination.
    """

    # --------------------------------------------------------
    # Distance
    # --------------------------------------------------------

    distance_km = haversine_km(
        source_lat,
        source_lon,
        vessel["latitude"],
        vessel["longitude"],
    )

    # --------------------------------------------------------
    # Individual scores
    # --------------------------------------------------------

    spatial = distance_score(
        distance_km
    )

    temporal = temporal_score(
        vessel["hours_from_event"]
    )

    relevance = vessel_type_score(
        vessel["type"]
    )

    # --------------------------------------------------------
    # Weighted association
    # --------------------------------------------------------

    association = (
        spatial * 0.45
        +
        temporal * 0.30
        +
        relevance * 0.25
    )

    return {
        "name": vessel["name"],
        "type": vessel["type"],

        "latitude": vessel["latitude"],
        "longitude": vessel["longitude"],

        "distance_km": round(
            distance_km,
            2,
        ),

        "hours_from_event": vessel[
            "hours_from_event"
        ],

        "spatial_score": round(
            spatial,
            2,
        ),

        "temporal_score": round(
            temporal,
            2,
        ),

        "vessel_relevance": round(
            relevance,
            2,
        ),

        "association_score": round(
            association,
            1,
        ),
    }


# ============================================================
# RANK VESSELS
# ============================================================

def rank_vessels(
    vessels,
    source_lat,
    source_lon,
):
    """
    Calculate and rank all candidate vessels.
    """

    ranked = []

    for vessel in vessels:

        result = calculate_association(
            vessel=vessel,
            source_lat=source_lat,
            source_lon=source_lon,
        )

        ranked.append(result)

    ranked.sort(
        key=lambda vessel: vessel[
            "association_score"
        ],
        reverse=True,
    )

    for index, vessel in enumerate(
        ranked,
        start=1,
    ):
        vessel["rank"] = index

    return ranked