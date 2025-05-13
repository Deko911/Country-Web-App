const baseURL = "http://api.weatherapi.com/v1/current.json";

const getWeatherFromCity = (city) => {

    const url = `${baseURL}?key=${import.meta.env.VITE_KEY}&q=${city}`
    let data = fetch(url).then(
        response => response.json().then(data => data));
    
    return data;

}

export default {getWeatherFromCity}

