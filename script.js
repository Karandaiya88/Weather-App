const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const apiKey = '779f2afa5734e90b003bafa7d3bb171f';


searchBtn.addEventListener('click', () => {
  if (cityInput.value.trim() !== '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
});

cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && cityInput.value.trim() !== '') {
    updateWeatherInfo(cityInput.value);
    cityInput.value = '';
    cityInput.blur();
  }
});


async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

async function updateWeatherInfo(city) {
  try {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod != 200) {
      showDisplaySection(notFoundSection);
      return;
    }

    
    document.querySelector('.country-txt').textContent =` ${weatherData.name}, ${weatherData.sys.country}`;
    const date = new Date();
    document.querySelector('.current-data-txt').textContent = date.toDateString();

    
    document.querySelector('.temp-txt').textContent = `${Math.round(weatherData.main.temp)} °C`;
    document.querySelector('.condition-txt').textContent = weatherData.weather[0].main;

    
    document.querySelector('.humidity-value-txt').textContent = `${weatherData.main.humidity}%`;
    document.querySelector('.wind-value-txt').textContent = `${weatherData.wind.speed} m/s`;

   
    const iconCode = weatherData.weather[0].icon;
    document.querySelector('.weather-summary-img').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    
    const forecastData = await getFetchData('forecast', city);
    updateForecast(forecastData);

    showDisplaySection(weatherInfoSection);
  } catch (error) {
    console.error('Error fetching weather:', error);
    showDisplaySection(notFoundSection);
  }
}


function updateForecast(forecastData) {
  const forecastContainer = document.querySelector('.forecast-items-container');
  forecastContainer.innerHTML = ''; 

  const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0);

  dailyForecast.slice(0, 4).forEach(day => {
    const date = new Date(day.dt_txt);
    const iconCode = day.weather[0].icon;
    const temp = Math.round(day.main.temp);

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h5 class="forecast-item-date regular-txt">${date.toDateString().slice(4, 10)}</h5>
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" class="forecast-item-img">
      <h5 class="forecast-item-temp">${temp} °C</h5>
    `;
    forecastContainer.appendChild(forecastItem);
  });
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(sec => sec.style.display = 'none');
  section.style.display = 'flex';
}