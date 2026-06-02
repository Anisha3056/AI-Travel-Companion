// src/components/SearchSection.jsx

function SearchSection({
  query,
  setQuery,
  searchAirbnb
}) {

  return (

    <div className="search-section">

      <h1>
        ✈️ AI Travel Companion
      </h1>
      <br />
      

      <p>
        Discover personalized Airbnb recommendations using AI-powered semantic search.
      </p>

      <div className="search-box">

        <input
          type="text"
          placeholder="Describe your dream stay..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <button
          onClick={searchAirbnb}
        >
          Search
        </button>

      </div>

    </div>

  );

}

export default SearchSection;