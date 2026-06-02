// src/components/RecommendationCard.jsx

function RecommendationCard({
  property,
  onClick
}) {

  return (

    <div className="recommendation-card" onClick={onClick}>

      <h2>
        {property.name}
      </h2>

      <div className="card-details">

        <p>
          💰 ${property.price}
        </p>

        <p>
          ⭐ {property.review_scores_rating}
        </p>

        <p>
          👥 {property.accommodates}
        </p>

      </div>

      <div className="recommendation-reason">

        ✨ {property.why_recommended}

      </div>

    </div>

  );

}

export default RecommendationCard;