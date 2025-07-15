
import React, { useState, useEffect } from 'react';
import Topbuttons from './components/Topbuttons';
import Inputs from './components/inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TempAndDetails from './components/TempAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherService';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Capitalize(str){
return str.charAt(0).toUpperCase() + str.slice(1);
}

const App = () => {

  const [query, setQuery] = useState({q: 'paris'})
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState(null)

  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(`Fetching weather data for ${Capitalize(cityName)}`);
    await getFormattedWeatherData({ ...query, units}).then((data) => {
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`)
      setWeather(data);
    })
  };
  
  useEffect(() => {
    getWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return  "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-600 to-blue-700";
    return "from-yellow-600 to-orange-700";
  };

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 items-center justify-center py-4 px-32  bg-gradient-to-br shadow-xl shadow-gray-400  text-amber-50 ${formatBackground()}`}>
      <Topbuttons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} setUnits={setUnits}/>

      {weather && (
        <>
        <TimeAndLocation weather={weather} />
        <TempAndDetails weather={weather} units={units}/>
        <Forecast title="3 hour step forecast" data={weather.hourly}/>
        <Forecast title="daily forecast" data= {weather.daily}/>
        </>
      )}
      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored"/>
    </div>
  )
}

export default App
