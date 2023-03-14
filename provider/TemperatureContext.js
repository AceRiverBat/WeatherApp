import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { API_KEY } from "../constants/Key";

const TemperatureContext = React.createContext(null);

export const useTemp = () => useContext(TemperatureContext);

const TemperatureContextProvider = ({ children }) => {

  const [weatherData, setWeatherData]= useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [stateWeatherData, setStateWeatherData] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission requise");
        return;
      } else {
        let location = await Location.getCurrentPositionAsync({});
        let data = "Waiting...";
        let longitudeLatitude = null;
        data = JSON.stringify(location.coords);
        longitudeLatitude = JSON.parse(data);

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${longitudeLatitude["latitude"]}&lon=${longitudeLatitude["longitude"]}&units=metric&appid=${API_KEY}`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        setWeatherData(weatherData);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${longitudeLatitude["latitude"]}&lon=${longitudeLatitude["longitude"]}&units=metric&appid=${API_KEY}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();
        setForecastData(forecastData);
      }
    })();
  }, []);

  const getStateWeatherData = async(cityVal)=>{
      const URL=`https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=${API_KEY}`;
      const res = await fetch(URL);
      const data = await res.json();
      setStateWeatherData(data);
  }

  const value = { weatherData, forecastData, getStateWeatherData, stateWeatherData };
  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};

export default TemperatureContextProvider;
