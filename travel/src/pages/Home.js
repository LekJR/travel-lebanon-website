import { Link } from "react-router-dom";
import "../styles/home.css";

import mountLebanonMain from "../assets/Mount Lebanon/mount.jpg";
import tyreMain from "../assets/tyre/road-ruins-Lebanon-Tyre.jpg";
import baalbekMain from "../assets/Baalbek/baalbek.jpg";

const cityHighlights = [
  {
    id: "mount",
    name: "Mount Lebanon",
    description: "Cool mountains, cedar forests and traditional villages.",
    image: mountLebanonMain,
  },
  {
    id: "tyre",
    name: "Tyre",
    description: "Old harbor, Roman ruins and a long sandy beach.",
    image: tyreMain,
  },
  {
    id: "baalbek",
    name: "Baalbek",
    description: "Huge Roman temples and views over the Bekaa valley.",
    image: baalbekMain,
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="app-section-card home-main">
        <div className="home-main-left">
          <div className="feature-pill mb-3">Travel Lebanon · Web</div>

          <h1 className="home-hero-title mb-2">
            Discover Lebanon, city by city
          </h1>

          <p className="home-hero-subtitle mb-3">
            Browse Lebanese cities, explore interesting places to visit and get
            ideas for events and activities that could be part of your next
            trip.
          </p>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <Link to="/cities" className="btn btn-primary">
              Explore cities
            </Link>
            <Link to="/events" className="btn btn-outline-primary">
              View events
            </Link>
          </div>
        </div>

        <div className="home-main-right">
          <h2 className="home-cities-title">Pick a city to start</h2>
          <div className="home-city-grid">
            {cityHighlights.map((city) => (
              <Link
                key={city.id}
                to="/cities"
                className="home-city-card text-decoration-none"
              >
                <div className="home-city-image-wrap">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="home-city-image"
                  />
                </div>
                <div className="home-city-body">
                  <h3 className="home-city-name">{city.name}</h3>
                  <p className="home-city-description mb-0">
                    {city.description}
                  </p>
                  <span className="home-city-cta">Open cities page →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section-card home-features">
        <h2 className="home-features-title mb-3">What you can do here</h2>
        <div className="home-features-grid">
          <div className="home-feature">
            <div className="home-feature-icon">🏙️</div>
            <div>
              <div className="home-feature-title">Browse cities</div>
              <div className="home-feature-text">
                Discover key cities around Lebanon with a quick overview of what
                makes each one special.
              </div>
            </div>
          </div>

          <div className="home-feature">
            <div className="home-feature-icon">📍</div>
            <div>
              <div className="home-feature-title">Explore places</div>
              <div className="home-feature-text">
                See curated places with photos and short descriptions – from
                nature spots to historical sites.
              </div>
            </div>
          </div>

          <div className="home-feature">
            <div className="home-feature-icon">🎉</div>
            <div>
              <div className="home-feature-title">Check events</div>
              <div className="home-feature-text">
                Get inspired by sample events like marathons, bike rides,
                seaside walks and cultural festivals.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
