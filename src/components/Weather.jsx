const Weather = ({weather}) => {

  if (Object.prototype.hasOwnProperty.call(weather, "error")){
    return(
      <div className='weatherInfo error'>{weather.error.message}</div>
    );
  }

  const current = weather.current;

  return(
    <div className='weatherInfo'>
      <h1>Weather in {weather.location.name}</h1>
      <div className="weatherImg"><img src={current.condition.icon} alt={current.condition.text} /></div>
      <p>Temperature: {current.temp_c}º Celsius</p>
      <p>Feels like: {current.feelslike_c}º Celsius</p>
      <p>Wind: {(current.wind_kph / 3.6).toFixed(1)} m/s</p>
      <p>Humidity: {current.humidity}%</p>
    </div>
  );

}

export default Weather;