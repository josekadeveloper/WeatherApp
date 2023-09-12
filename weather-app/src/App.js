import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import Forecast from './components/forecast/forecast';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const locationData = (position) => {
      const { latitude, longitude } = position.coords;

      fetch(`${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(async (data) => {
          const weatherResponse = await data;

          setCurrentWeather({ city: data.name, ...weatherResponse });
        });

      fetch(`${WEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(async (data) => {
          const forecastResponse = await data;

          setForecast({ city: data.name, ...forecastResponse });
        });
    }

    navigator.geolocation.getCurrentPosition(locationData);
  }, []);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      });
  }

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
