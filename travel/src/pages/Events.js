import { useState } from "react";
import { useBookings } from "../context/BookingContext";
import "../styles/events.css";

function Events() {
  const { events, addBooking, favorites, toggleFavorite } = useBookings();

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    addBooking(
      data.get("name"),
      data.get("phone"),
      data.get("email"),
      selectedEvent.name
    );

    closeModal();
  };

  const isFavorite = (eventId) =>
    favorites.some((fav) => fav.id === eventId);

  return (
    <div className="events-page">
      <section className="app-section-card mb-3">
        <div className="section-heading mb-2">
          <h2 className="mb-1">Events</h2>
        </div>
        <p className="text-muted mb-1">
          Running, cycling, music and cultural events that you could plan a trip
          around in Lebanon.
        </p>
        <p className="events-note mb-0">
          Dates and details may change, so always check the official event pages
          before you travel.
        </p>
      </section>

      <section className="app-section-card events-section">
        {events.length === 0 ? (
          <p className="text-muted">Loading events...</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-image-wrap">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="event-image"
                  />
                  <span className="event-season-pill">{event.season}</span>
                </div>

                <div className="event-body">
                  <h3 className="event-title">{event.name}</h3>
                  <p className="event-place">{event.place}</p>
                  <p className="event-description">{event.description}</p>

                  <div className="event-footer">
                    <span className="event-type-pill">{event.type}</span>

                    <div className="event-actions">
                      <button
                        type="button"
                        className={
                          "event-favorite-icon" +
                          (isFavorite(event.id) ? " is-favorite" : "")
                        }
                        aria-label="Add to favourites"
                        onClick={() => toggleFavorite(event)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
                               2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 
                               4.5 2.09C12.09 4.81 13.76 4 15.5 4 
                               18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 
                               11.54L12 21.35z"
                            fill={
                              isFavorite(event.id) ? "#e0245e" : "none"
                            }
                            stroke="#e0245e"
                            strokeWidth="1.7"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm event-book-btn"
                        onClick={() => openModal(event)}
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className="modal-overlay modal-open">
          <div className="modal-card modal-animate">
            <h3>Book: {selectedEvent?.name}</h3>

            <form onSubmit={handleBookingSubmit}>
              <div className="mb-2">
                <label>Name</label>
                <input name="name" className="form-control" required />
              </div>

              <div className="mb-2">
                <label>Phone number</label>
                <input name="phone" className="form-control" required />
              </div>

              <div className="mb-2">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  Submit booking
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
