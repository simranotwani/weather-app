// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [city, setCity] = useState("");
//   const [weather, setWeather] = useState(null);
//   const [error, setError] = useState(false);

//   const apiKey = "a5b24062aa6e5f59f74bcd9cb104f0e8";
//   const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

//   const checkWeather = async () => {
//     if (!city) return;

//     try {
//       const res = await fetch(
//         `${apiUrl}?q=${city}&units=metric&appid=${apiKey}`
//       );

//       if (!res.ok) {
//         setError(true);
//         setWeather(null);
//         return;
//       }

//       const data = await res.json();
//       setWeather(data);
//       setError(false);
//     } catch (err) {
//       setError(true);
//     }
//   };

//   const getWeatherIcon = (main) => {
//     switch (main) {
//       case "Clouds":
//         return "/images/clouds.png";
//       case "Clear":
//         return "/images/clear.png";
//       case "Rain":
//         return "/images/rain.png";
//       case "Drizzle":
//         return "/images/drizzle.png";
//       case "Mist":
//         return "/images/mist.png";
//       default:
//         return "/images/clear.png";
//     }
//   };

//   return (
//     <div className="app">
//       <div className="card">
//         <div className="search">
//           <input
//             type="text"
//             placeholder="Enter city name"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && checkWeather()}
//           />
//           <button onClick={checkWeather}>
//             🔍
//           </button>
//         </div>

//         {error && (
//           <div className="error">
//             <p>Invalid City Name</p>
//           </div>
//         )}

//         {weather && (
//           <div className="weather">
//             <img
//               src={getWeatherIcon(weather.weather[0].main)}
//               className="weather-icon"
//               alt="weather"
//             />
//             <h1>{Math.round(weather.main.temp)}°C</h1>
//             <h2>{weather.name}</h2>

//             <div className="details">
//               <div className="col">
//                 <img src="/images/humidity.png" alt="humidity" />
//                 <div>
//                   <p className="humidity">{weather.main.humidity}%</p>
//                   <p>Humidity</p>
//                 </div>
//               </div>

//               <div className="col">
//                 <img src="/images/wind.png" alt="wind" />
//                 <div>
//                   <p className="wind">{weather.wind.speed} km/h</p>
//                   <p>Wind Speed</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  const apiKey = "a5b24062aa6e5f59f74bcd9cb104f0e8";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const res = await fetch(
        `${apiUrl}?q=${city}&units=metric&appid=${apiKey}`
      );

      if (!res.ok) {
        setError(true);
        setWeather(null);
        return;
      }

      const data = await res.json();
      setWeather(data);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="app">
      <div className="card">
        {/* SEARCH */}
        <div className="search">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button onClick={fetchWeather}>🔍</button>
        </div>

        {/* ERROR */}
        {error && <p className="error">Invalid city name</p>}

        {/* TABLE */}
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
                <tr>
                  <th>Pressure</th>
                  <td>{weather.main.pressure} hPa</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
