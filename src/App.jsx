import { useEffect, useState } from 'react'
import CountriesList from './components/CountriesList';
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


export default App
