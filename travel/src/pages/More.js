import { useEffect, useState } from "react";
import "../styles/more.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

function More() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [cityOption, setCityOption] = useState("");
  const [cities, setCities] = useState([]);

  const loadSuggestions = () => {
    fetch(`${API}/suggestions`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch(console.log);
  };

  const loadCities = () => {
    fetch(`${API}/cities`)
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(console.log);
  };

  useEffect(() => {
    loadSuggestions();
    loadCities();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const selectedCity =
      data.get("citySelect") === "other"
        ? data.get("cityOther")
        : data.get("citySelect");

    const newSuggestion = {
      name: data.get("name"),
      city: selectedCity,
      place: data.get("place"),
      maps_link: data.get("maps"),
      description: data.get("description"),
    };

    fetch(`${API}/addSuggestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSuggestion),
    })
      .then((res) => res.json())
      .then(() => {
        loadSuggestions();
        e.target.reset();
        setCityOption("");
      })
      .catch(console.log);
  };

  const removeSuggestion = (id) => {
    fetch(`${API}/deleteSuggestion/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setSuggestions((prev) => prev.filter((s) => s.id !== id)))
      .catch(console.log);
  };

  return (
    <div className="more-page">
      <section className="app-section-card">
        <div className="more-suggest-header mb-3">
          <div>
            <h2 className="mb-1">Suggest a place</h2>
            <p className="text-muted mb-0">
              Share a city or place in Lebanon that you think should be added in future versions.
            </p>
          </div>

          <button
            className="btn btn-outline-primary btn-sm more-toggle-btn"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? "Hide" : "Show"}
          </button>
        </div>

        {isOpen && (
          <>
            <form className="more-form" onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input name="name" className="form-control" required />
              </div>

              <div className="mb-2">
                <label className="form-label">City</label>
                <select
                  name="citySelect"
                  className="form-select"
                  required
                  value={cityOption}
                  onChange={(e) => setCityOption(e.target.value)}
                >
                  <option value="">Choose a city…</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="other">Other city</option>
                </select>
              </div>

              {cityOption === "other" && (
                <div className="mb-2">
                  <label className="form-label">Other city name</label>
                  <input
                    name="cityOther"
                    className="form-control"
                    placeholder="Type the city name"
                    required
                  />
                </div>
              )}

              <div className="mb-2">
                <label className="form-label">Place</label>
                <input name="place" className="form-control" required />
              </div>

              <div className="mb-2">
                <label className="form-label">Maps link</label>
                <input name="maps" className="form-control" />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows="2" />
              </div>

              <button type="submit" className="btn btn-primary">
                Send suggestion
              </button>
            </form>

            {suggestions.length > 0 && (
              <div className="more-table-wrapper mt-4">
                <h3 className="more-table-title">Your suggestions</h3>

                <div className="table-responsive">
                  <table className="table more-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Place</th>
                        <th>Maps</th>
                        <th>Description</th>
                        <th>Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {suggestions.map((s, index) => (
                        <tr key={s.id}>
                          <td>{index + 1}</td>
                          <td>{s.name}</td>
                          <td>{s.city}</td>
                          <td>{s.place}</td>

                          <td className="more-table-link">
                            {s.maps_link ? (
                              <a href={s.maps_link} target="_blank" rel="noopener noreferrer">
                                Open
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>

                          <td>{s.description || "—"}</td>

                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeSuggestion(s.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default More;
