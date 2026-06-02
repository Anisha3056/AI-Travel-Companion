function PropertyModal({

  property,

  onClose

}) {

  if (!property) return null;

  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>
          {property.name}
        </h2>

        <p>
          📍 {property.neighbourhood}
        </p>

        <p>
          ⭐ {property.rating}
        </p>

        <p>
          💰 ${property.price}/night
        </p>

        <hr />

        <h3>
          Stay Details
        </h3>

        <p>
          🏠 {property.property_type}
        </p>

        <p>
          👥 {property.accommodates} guests
        </p>

        <p>
          🛏 {property.bedrooms} bedrooms
        </p>

        <p>
          🛌 {property.beds} beds
        </p>

        <p>
          🛁 {property.bathrooms}
        </p>

        <hr />

        <h3>
          Booking Information
        </h3>

        <p>
          🌙 Minimum stay:
          {property.minimum_nights} nights
        </p>

        <p>
          📅 Available:
          {property.availability_30}
          days next month
        </p>

        <p>
          ⚡ Instant Book:
          {
            property.instant_bookable === "t"
              ? "Yes"
              : "No"
          }
        </p>

        <hr />

        <h3>
          Host Information
        </h3>

        <p>
          👤 Hosting since:
          {
            property.host_since
              ?.split("-")[0]
          }
        </p>

        <p>
          🏆 Superhost:
          {
            property.superhost === "t"
              ? "Yes"
              : "No"
          }
        </p>

        <p>
          📞 Response Rate:
          {property.response_rate}
        </p>

        <p>
          📝 Reviews:
          {property.number_of_reviews}
        </p>

      </div>

    </div>

  );

}

export default PropertyModal;