import { useState } from "react";
import axios from "axios";
import "./App.css";
import Filters from "./components/Filters";
import QueryBadges from "./components/QueryBadges";
import SearchSection from "./components/SearchSection";
import RecommendationCard from "./components/RecommendationCard";
import PropertyModal from "./components/PropertyModal";
import Footer from "./components/Footer";


function EmptyState() {
  return (
    <div className="empty-state">
      <h2>
        😔 No stays found
      </h2>
      <p>
        Try increasing your budget,
        reducing filters,
        or changing your search.
      </p>
    </div>
  );
}

function App() {
  
  const [query, setQuery] = useState("");

  const [maxPrice, setMaxPrice] = useState(300);
  const [roomType, setRoomType] = useState("Entire home/apt");
  const [minRating, setMinRating] = useState(4.5);
  const [accommodates, setAccommodates] = useState(2);
  const [amenities, setAmenities] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState([]);

  const searchAirbnb = async () => {

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/recommend",
        {
          query,
          max_price: maxPrice,
          room_type: roomType,
          min_rating: minRating,
          accommodates: accommodates,
          amenities: amenities,
          top_n: 5
        }
      );

      setResults(
        response.data.recommendations
      );

      

    } catch(error) {

      console.error(error);

    }
    finally {
      setLoading(false);
    }

  };

  const fetchPropertyDetails = async (propertyId) => {

  try {

    const response = await axios.get(
      `http://127.0.0.1:8000/property/${propertyId}`
    );

    setSelectedProperty(
      response.data
    );

    setShowModal(true);

  }

  catch(error) {

    console.error(error);

  }

};

      {loading && (
        <div className="loading-card">
          ✈️ Searching for your perfect stay...
        </div>
      )}

  return (

    <div>

      <SearchSection
        query={query}
        setQuery={setQuery}
        searchAirbnb={searchAirbnb}
      />

      <div className="main-layout">

  <div className="filters-panel">

    <Filters

      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}

      roomType={roomType}
      setRoomType={setRoomType}

      minRating={minRating}
      setMinRating={setMinRating}

      accommodates={accommodates}
      setAccommodates={setAccommodates}

      amenities={amenities}
      setAmenities={setAmenities}

    />

  </div>

  <div className="results-panel">
    <QueryBadges query={query} />

    {results.length > 0 && (
    <h3 className="results-title">
      Found {results.length} matching your vibe ✨
    </h3>
  )}

     {!loading && results.length === 0 && query.trim() !== "" && (

      <div className="empty-state">

        <h2>✈️ We couldn't find a stay matching this trip</h2>

        <p>
          Try increasing your budget,
          reducing filters,
          or changing your search query.
        </p>

      </div>

    )
   }


    <div className="results-container">

      {
        results.map((property, index) => (

          <RecommendationCard
            key={index}
            property={property}
            onClick={() => fetchPropertyDetails(property.id)  } 
          />

        ))
      }

    </div>

  </div>

{showModal && (
  <PropertyModal
    property={selectedProperty}
    onClose={() => setShowModal(false)}
  />
)}


  </div>
  <Footer />

    </div>
    

  );

}

export default App;