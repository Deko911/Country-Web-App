import { useEffect, useState } from 'react'
import weatherServices from './services/weatherAPI'
import "./style.css"

function App() {
  const [textCountry, setTextCountry] = useState("");
  const [countries, setCountries] = useState(null);
  const [filteredCountries, setFilterCountries] = useState(null);
  
  const hook = () => {
    
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all").then(
      response => response.json().then(data => {
        setCountries(data);
      }));
    }  
    
    useEffect(hook, []);
    
    const handleCountry = (event) => {
      let text = event.target.value;
      setTextCountry(text);
      if (countries) {
        handleFilter(text.toLowerCase())
      }
    }
    
    const handleFilter = (filter) => {
      let filtered = countries.filter(country => {
        return country.name.common.toLowerCase().includes(filter);
      });
      setFilterCountries(filtered);
    }

     if (countries && !filteredCountries) {
      handleFilter(textCountry);
    }
    
    return (
      <>
      <header>
        Find countries <input type="text" value={textCountry} onChange={handleCountry}/>
      </header>
      <CountriesList countries={filteredCountries} search={textCountry} />
    </>
  )
}

const CountriesList = ({countries, search}) => {
  const [resalted, setResalted] = useState(null);
  const [weather, setWeather] = useState(null);
  
  const hook = () => {
    if (resalted !== null){
      if (Object.prototype.hasOwnProperty.call(resalted, "capital")){
        weatherServices.getWeatherFromCity(resalted.capital)
          .then(data => setWeather(data));
      }else{
        setWeather({
          error: {
              code: 404,
              message: "Weather doesn't registered"
        }});
      }
    }
  }
  
  useEffect(hook, [resalted]);
  
  if(!countries){
    return <p>Loading</p>;
  } 

  const handleClick = (c) => {
    if (!resalted){
      setResalted(c);
      return;
    }
    setResalted(resalted.cca3 === c.cca3 ? null : c);
    setWeather(null);
  }

  if(countries.length > 10){
    return (
      <main>
        {resalted ? <Country country={resalted} resalted={true} onClick={() => handleClick(resalted)} weather={weather}/> : ''}
        <p>Found {countries.length} countries</p>
        <p>Too many matches, specify another filter</p>
      </main>
    )
  }
  
  const countriesFiltered = resalted ? countries.filter(c => c.cca3 !== resalted.cca3) : countries;

  return (
    <main>
      {resalted ? <Country country={resalted} resalted={true} onClick={() => handleClick(resalted)} weather={weather}/> : ''}
      <p>Found {countries.length} countries</p>
      <div className='CountryList'>
      {countriesFiltered.map((c) => {
          return(<Country key={`${c.cca3}-${search}`} country={c} resalted={false} onClick={() => handleClick(c)}/>);
        })
      }
      </div>
    </main>
  );

}

const Country = ({country, resalted, onClick, weather}) => {
  
  const langs = Object.values(country.languages);
  const flag = country.flags;
  
  if (!resalted) {
    return(
      <div className='unResalted' onClick={onClick}>
        <img src={flag.png} alt={flag.alt} />
        <span>{country.name.common}</span> 
      </div>
    );
  }


  return(
    <div className='resalted'>
      <div className='countryInfo'>
      <span className="close" onClick={onClick}>X</span>
        <h1>{country.name.common}</h1>
        <br />
        <div className="flag"><img src={flag.png} alt={flag.alt} /></div>
        <p>
          Capital: {country.capital} <br />
        </p>
        <p>
          Area: {country.area.toLocaleString('es-ES')} km²
        </p>
        <h1>Languages</h1>
        <ul>
          {langs.map((lan, i) => <li key={i}>{lan}</li>)}
        </ul>
      </div>
      {weather ? <Weather weather={weather}/> : <div className='weatherInfo'>Loading Weather</div>}
    </div>
    
  );
}

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

export default App
