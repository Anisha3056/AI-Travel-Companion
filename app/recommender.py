import os
import random  
import joblib
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model
model = None

def get_model():

    global model

    if model is None:

        model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return model

# Load dataframe and embeddings
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
embeddings = np.load(os.path.join(BASE_DIR, "models", "embeddings.npy"), mmap_mode="r")
airbnb_merged = joblib.load(os.path.join(BASE_DIR, "models", "airbnb_data.pkl"))


def hybrid_airbnb_search(
    query,
    max_price=None,
    room_type=None,
    min_rating=None,
    accommodates=None,
    amenities=None,
    top_n=5,
):
    filtered_df = airbnb_merged.copy()

    # Apply filters
    if max_price is not None:
        filtered_df = filtered_df[filtered_df["price"] <= max_price]

    if room_type is not None:
        filtered_df = filtered_df[filtered_df["room_type"] == room_type]

    if min_rating is not None:
        filtered_df = filtered_df[filtered_df["review_scores_rating"] >= min_rating]

    if accommodates is not None:
        filtered_df = filtered_df[filtered_df["accommodates"] >= accommodates]

    if amenities is not None and len(amenities) > 0:
        for amenity in amenities:
            filtered_df = filtered_df[
                filtered_df["amenities_text"].str.contains(
                    amenity, case=False, na=False
                )
            ]

    if filtered_df.empty:
        return []

    # Vector Search
    query_embedding = get_model().encode(query).reshape(1, -1)
    filtered_embeddings = embeddings[filtered_df.index]
    
    print("Query embedding shape:", query_embedding.shape)
    print("Embeddings shape:", embeddings.shape)
    print("Filtered embeddings shape:", filtered_embeddings.shape)
    
    similarities = cosine_similarity(query_embedding, filtered_embeddings)
    
    print("Query:", query_embedding.shape)
    print("Filtered:", filtered_embeddings.shape)

    sim_scores = list(enumerate(similarities[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    top_matches = sim_scores[:top_n]
    listing_indices = [i[0] for i in top_matches]

    recommendations = filtered_df.iloc[listing_indices][
        [
            "id",
            "name",
            "property_type",
            "room_type",
            "price",
            "review_scores_rating",
            "accommodates",
            "amenities_text",
            "combined_features",
        ]
    ].copy()

    recommendations["similarity_score"] = [
        round(float(i[1]), 3) for i in top_matches
    ]

    # =====================================================
    # GENERATE EXPLANATIONS
    # =====================================================
    def generate_explanation(row, query, max_price, accommodates):
        reasons = []

        # Rating
        rating = row["review_scores_rating"]
        if rating >= 4.9:
            reasons.append(f"⭐ Exceptional guest rating ({rating:.2f})")
        elif rating >= 4.7:
            reasons.append(f"⭐ Highly rated by guests ({rating:.2f})")

        # Budget
        if max_price:
            if row["price"] <= max_price * 0.5:
                reasons.append("💰 Well below your budget")
            elif row["price"] <= max_price:
                reasons.append("💰 Within your budget")

        # Space
        if accommodates:
            if row["accommodates"] >= accommodates + 3:
                reasons.append("👥 Spacious stay for larger groups")
            else:
                reasons.append(f"👥 Fits {accommodates}+ guests")

        # Amenities
        amenities_str = str(row["amenities_text"]).lower()
        if "workspace" in amenities_str:
            reasons.append("💻 Dedicated workspace available")
        if "parking" in amenities_str:
            reasons.append("🚗 Parking available")
        if "wifi" in amenities_str:
            reasons.append("📶 Fast WiFi included")

        # Query-aware
        query_lower = query.lower()
        combined_text = str(row["combined_features"]).lower()

        if "romantic" in query_lower and any(
            word in combined_text
            for word in ["romantic", "cozy", "retreat", "couple"]
        ):
            reasons.append("💕 Matches your romantic getaway vibe")

        if "remote work" in query_lower and "workspace" in amenities_str:
            reasons.append("💻 Ideal for remote work")

        if "nightlife" in query_lower and any(
            word in combined_text
            for word in ["french quarter", "bars", "music", "downtown"]
        ):
            reasons.append("🎵 Close to nightlife hotspots")

        # -------------------------------------------------
        # RANDOM PICK SELECTION
        # -------------------------------------------------
        # Dynamically picks 4 random reasons (or fewer if total reasons < 4)
        num_reasons_to_pick = min(4, len(reasons))
        random_reasons = random.sample(reasons, k=num_reasons_to_pick)

        return " • ".join(random_reasons)

    # Apply formatting
    recommendations["why_recommended"] = recommendations.apply(
        lambda row: generate_explanation(
            row, query, max_price, accommodates
        ),
        axis=1,
    )

    # Clean up structure for response
    recommendations = recommendations.drop(
        columns=["amenities_text", "combined_features"]
    )

    return recommendations.to_dict(orient="records")

def get_property_details(property_id):

    property_data = airbnb_merged[
        airbnb_merged["id"] == property_id
    ]

    if property_data.empty:
        return None

    property_data = property_data.iloc[0]

    return {

        "id": int(property_data["id"]),

        "name": property_data["name"],

        "description": property_data["description"],

        "property_type": property_data["property_type"],

        "room_type": property_data["room_type"],

        "neighbourhood":
        property_data["neighbourhood_cleansed"],

        "price":
        float(property_data["price"]),

        "rating":
        float(property_data["review_scores_rating"]),

        "accommodates":
        int(property_data["accommodates"]),

        "bedrooms":
        property_data["bedrooms"],

        "beds":
        property_data["beds"],

        "bathrooms":
        property_data["bathrooms_text"],

        "minimum_nights":
        int(property_data["minimum_nights"]),

        "availability_30":
        int(property_data["availability_30"]),

        "host_since":
        str(property_data["host_since"]),

        "superhost":
        property_data["host_is_superhost"],

        "response_rate":
        property_data["host_response_rate"],

        "instant_bookable":
        property_data["instant_bookable"],

        "number_of_reviews":
        int(property_data["number_of_reviews"])
    }