function Filters({
  maxPrice,
  setMaxPrice,

  roomType,
  setRoomType,

  minRating,
  setMinRating,

  accommodates,
  setAccommodates,

  amenities,
  setAmenities
}) {

  const popularAmenities = [
    "Wifi",
    "Dedicated workspace",
    "Kitchen",
    "Air conditioning",
    "Coffee maker",
    "Free parking"
  ];

  const toggleAmenity = (amenity) => {

    if (amenities.includes(amenity)) {

      setAmenities(
        amenities.filter(
          item => item !== amenity
        )
      );

    } else {

      setAmenities([
        ...amenities,
        amenity
      ]);

    }

  };

  return (

    <div className="filters-container">

      <h3>Filters</h3>

      {/* Budget */}

      <label>
        Max Budget: ${maxPrice}
      </label>

      <input
        type="range"
        min="50"
        max="500"
        step="10"
        value={maxPrice}
        onChange={(e) =>
          setMaxPrice(
            Number(e.target.value)
          )
        }
      />

      {/* Room Type */}

      <label>
        Room Type
      </label>

      <select
        value={roomType}
        onChange={(e) =>
          setRoomType(
            e.target.value
          )
        }
      >

        <option value="">
          Any
        </option>

        <option value="Entire home/apt">
          Entire Home
        </option>

        <option value="Private room">
          Private Room
        </option>

      </select>

      {/* Rating */}

      <label>
        Minimum Rating
      </label>
      <div className="rating-buttons">
        <button
        className={
            minRating === 4
            ? "rating-btn active"
            : "rating-btn"
        }
        onClick={() => setMinRating(4)}
        >
            ⭐ 4+
        </button>
        <button
        className={
            minRating === 4.5
            ? "rating-btn active"
            : "rating-btn"
        }
        onClick={() => setMinRating(4.5)}
        >
            ⭐ 4.5+
            </button>
            <button
            className={
                minRating === 4.8
                ? "rating-btn active"
                : "rating-btn"
            }
            onClick={() => setMinRating(4.8)}
        >
            ⭐ 4.8+
        </button>
        </div>
      {/* Guests */}

      <label>
        Guests
      </label>

      <input
        type="number"
        min="1"
        value={accommodates}
        onChange={(e) =>
          setAccommodates(
            Number(e.target.value)
          )
        }
      />

      {/* Amenities */}

      <h4>Amenities</h4>

      <div className="amenities-container">

        {
          popularAmenities.map(
            (amenity) => (

              <button
                key={amenity}
                className={
                  amenities.includes(amenity)
                  ? "amenity-chip active"
                  : "amenity-chip"
                }
                onClick={() =>
                  toggleAmenity(amenity)
                }
              >
                {amenity}
              </button>

            )
          )
        }

      </div>

    </div>

  );

}

export default Filters;