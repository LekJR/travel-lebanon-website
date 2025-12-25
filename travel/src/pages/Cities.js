import { useState } from "react";
import { cities } from "../data/cities";
import "../styles/cities.css";

function Cities() {
  const [selectedId, setSelectedId] = useState(null);

  const selectedCity = cities.find((city) => city.id === selectedId) || null;

  const handleBack = () => {
    setSelectedId(null);
  };

  return (
    <div className="city-page">
      {!selectedCity && (
        <>
          <section className="app-section-card city-intro mb-3">
            <div className="section-heading mb-2">
              <h2 className="mb-2">Cities in Lebanon</h2>
            </div>
            <p className="city-intro-text mb-0">
              Choose a city from the list below. When you tap a city, you will
              see example places to visit in that area with images and short
              descriptions.
            </p>
          </section>

          <section className="city-list-screen">
            <h2 className="city-list-heading mb-1">Choose a city</h2>
            <p className="city-list-subtext mb-3">
              Select one of the cities below to view places, attractions and
              more.
            </p>

            <div className="city-list-grid">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="city-list-card"
                  onClick={() => setSelectedId(city.id)}
                >
                  <div className="city-list-image-wrap">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="city-list-image"
                    />
                  </div>

                  <div className="city-list-body">
                    <h4 className="city-list-name">{city.name}</h4>
                    <p className="city-list-short mb-0">{city.short}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {selectedCity && (
        <section className="app-section-card city-places-screen">
          <div className="city-places-header mb-3">
            <button
              type="button"
              className="city-back-btn"
              onClick={handleBack}
            >
              ← Back to cities
            </button>

            <div>
              <h2 className="mb-1">
                Places in{" "}
                <span className="city-places-city-name">
                  {selectedCity.name}
                </span>
              </h2>
              <p className="city-places-subtitle mb-0">
                A small list of nature and history locations you could visit in
                this area.
              </p>
            </div>

            <span className="city-places-count">
              {selectedCity.places.length} places
            </span>
          </div>

          <div className="city-places-grid">
            {selectedCity.places.map((place) => (
              <article key={place.id} className="city-place-card">
                <div className="city-place-image-wrap">
                  <img
                    src={place.image}
                    alt={place.title}
                    className="city-place-image"
                  />

                  {place.maps && (
                    <a
                      href={place.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="place-map-btn"
                      title="Open in Google Maps"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="white"
                        width="16"
                        height="16"
                        aria-hidden="true"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 
                          7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 
                          9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 
                          2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 
                          12 11.5z" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="city-place-body">
                  <div className="city-place-header">
                    <div>
                      <h4 className="city-place-title mb-1">
                        {place.title}
                      </h4>
                      <p className="city-place-type mb-1">
                        {place.type}
                      </p>
                    </div>
                  </div>

                  <p className="city-place-description mb-0">
                    {place.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Cities;
