function QueryBadges({ query }) {

  const badges = [];

  const q = query.toLowerCase();

  if (
    q.includes("romantic") ||
    q.includes("couple")
  ) {
    badges.push("💕 Romantic");
  }

  if (
    q.includes("nightlife") ||
    q.includes("party")
  ) {
    badges.push("🎵 Nightlife");
  }

  if (
    q.includes("remote work") ||
    q.includes("workspace")
  ) {
    badges.push("💻 Remote Work");
  }

  if (
    q.includes("family")
  ) {
    badges.push("👨‍👩‍👧‍👦 Family");
  }

  if (
    q.includes("wifi")
  ) {
    badges.push("📶 Fast WiFi");
  }

  if (
    q.includes("luxury")
  ) {
    badges.push("✨ Luxury");
  }

  return (

    <div className="query-badges">

      {
        badges.map(
          (badge, index) => (

            <span
              key={index}
              className="query-badge"
            >
              {badge}
            </span>

          )
        )
      }

    </div>

  );

}

export default QueryBadges;