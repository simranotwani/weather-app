import { useEffect, useState } from "react";
import "./App.css";

const ITEMS_PER_PAGE = 5;

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  // 🔥 Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const apiKey = "a5b24062aa6e5f59f74bcd9cb104f0e8";

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("weatherHistory")) || [];
    const storedPage =
      Number(localStorage.getItem("historyPage")) || 1;

    setHistory(storedHistory);
    setPage(storedPage);
  }, []);

  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("historyPage", page);
  }, [page]);

  const fetchCities = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${apiKey}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`
      );

      if (!res.ok) {
        setError("City not found");
        return;
      }

      const data = await res.json();
      setWeather(data);
      setError("");
      setSuggestions([]);
      setQuery(city.name);

      setHistory((prev) => [
        {
          id: Date.now(),
          name: data.name,
          temp: data.main.temp,
        },
        ...prev,
      ]);

      setPage(1);
    } catch {
      setError("Something went wrong");
    }
  };

  // 🔥 Open custom popup
  const openDeletePopup = (id) => {
    setDeleteId(id);
    setShowPopup(true);
  };

  // 🔥 Confirm delete
  const confirmDelete = () => {
    const updatedHistory = history.filter(
      (item) => item.id !== deleteId
    );
    setHistory(updatedHistory);
    setShowPopup(false);
    setDeleteId(null);

    setMessage("History deleted successfully ✅");
    setTimeout(() => setMessage(""), 2000);

    const newTotalPages = Math.ceil(
      updatedHistory.length / ITEMS_PER_PAGE
    );
    if (page > newTotalPages) {
      setPage(newTotalPages || 1);
    }
  };

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedHistory = history.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="app">
      <div className="card layout">
        {/* LEFT */}
        <div className="left">
          <input
            type="text"
            placeholder="Type city name..."
            value={query}
            onChange={(e) => fetchCities(e.target.value)}
          />

          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => fetchWeather(city)}>
                  {city.name}, {city.country}
                </li>
              ))}
            </ul>
          )}

          {error && <p className="error">{error}</p>}

          {weather && (
            <table>
              <tbody>
                <tr><th>City</th><td>{weather.name}</td></tr>
                <tr><th>Temp</th><td>{Math.round(weather.main.temp)} °C</td></tr>
                <tr><th>Humidity</th><td>{weather.main.humidity}%</td></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT */}
        <div className="right">
          <h3>Search History</h3>
          {message && <p style={{ color: "#d4ffea" }}>{message}</p>}

          {paginatedHistory.map((item) => (
            <div className="history-item" key={item.id}>
              <span>
                {item.name} — {Math.round(item.temp)}°C
              </span>
              <button onClick={() => openDeletePopup(item.id)}>❌</button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 CUSTOM CONFIRMATION POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Delete History?</h3>
            <p>Are you sure you want to delete this record?</p>

            <div className="popup-actions">
              <button onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

