from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.recommender import get_property_details, hybrid_airbnb_search
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# REQUEST SCHEMA
# =========================================

class SearchRequest(BaseModel):

    query: str
    max_price: float | None = None
    room_type: str | None = None
    min_rating: float | None = None
    accommodates: int | None = None
    amenities: list[str] | None = None
    top_n: int = 5


# =========================================
# ROOT ENDPOINT
# =========================================

@app.get("/")
def home():
    return {
        "message":
        "Airbnb Semantic Recommendation API Running"
    }



# =========================================
# SEARCH ENDPOINT
# =========================================

@app.post("/recommend")

def recommend(data: SearchRequest):

    results = hybrid_airbnb_search(
        query=data.query,
        max_price=data.max_price,
        room_type=data.room_type,
        min_rating=data.min_rating,
        accommodates=data.accommodates,
        amenities=data.amenities,
        top_n=data.top_n
    )

    return {
        "recommendations": results
    }
    
@app.get("/property/{property_id}")
def get_property(property_id: int):

    details = get_property_details(
        property_id
    )

    if details is None:

        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    return details