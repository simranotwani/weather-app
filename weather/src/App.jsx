import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const apiKey = "a5b24062aa6e5f59f74bcd9cb104f0e8";

  /* Fetch city suggestions */
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
      setError("Failed to fetch cities");
    }
  };

  /* Fetch weather for selected city */
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
        { id: Date.now(), name: data.name, temp: data.main.temp },
        ...prev,
      ]);
    } catch {
      setError("Something went wrong");
    }
  };

  /* Delete history item */
  const deleteHistory = (id) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  return (
    <div className="app">
      <div className="card">

        {/* SEARCH INPUT */}
        <div className="search">
          <input
            type="text"
            placeholder="Type city name..."
            value={query}
            onChange={(e) => fetchCities(e.target.value)}
          />
        </div>

        {/* AUTOCOMPLETE LIST */}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((city, index) => (
              <li key={index} onClick={() => fetchWeather(city)}>
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}

        {/* ERROR */}
        {error && <p className="error">{error}</p>}

        {/* WEATHER TABLE */}
        {weather && (
          <div className="table-container">
            <h2 className="table-title">Weather Details</h2>
            <table className="weather-table">
              <tbody>
                <tr>
                  <th>City</th>
                  <td>{weather.name}</td>
                </tr>
                <tr>
                  <th>Temperature</th>
                  <td>{Math.round(weather.main.temp)} °C</td>
                </tr>
                <tr>
                  <th>Feels Like</th>
                  <td>{Math.round(weather.main.feels_like)} °C</td>
                </tr>
                <tr>
                  <th>Weather</th>
                  <td>{weather.weather[0].main}</td>
                </tr>
                <tr>
                  <th>Humidity</th>
                  <td>{weather.main.humidity} %</td>
                </tr>
                <tr>
                  <th>Wind Speed</th>
                  <td>{weather.wind.speed} km/h</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SEARCH HISTORY */}
        {history.length > 0 && (
          <div className="history">
            <h3>Search History</h3>
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <span>
                  {item.name} — {Math.round(item.temp)}°C
                </span>
                <button onClick={() => deleteHistory(item.id)}>❌</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
