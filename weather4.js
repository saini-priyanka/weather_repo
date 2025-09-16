const apiKey = 'a5d0606b64d944c290e103952251209';

window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      },
      () => {
        console.log('Geolocation not allowed, please search manually.');
      }
    );
  }
};

async function getWeatherByLocation(lat, lon) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
  const response = await fetch(url);
  const data = await response.json();
  displayWeatherData(data);
}

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
  const response = await fetch(url);
  const data = await response.json();
  displayWeatherData(data);
}


  function displayWeatherData(data) {
  document.getElementById('condition').innerHTML = `
    <img src="https:${data.current.condition.icon}" alt="weather icon" class="weather-icon" />
    ${data.current.condition.text}`;

  document.getElementById('city').innerText = data.location.name;
  document.getElementById('datetime').innerText = data.location.localtime;
  document.getElementById('temp').innerText =` ${data.current.temp_c}°C`;

  document.getElementById('feelslike').innerHTML = `
    <img src="icons/feellike.jpg" alt="feelslike icon" class="small-icon"/>
    ${data.current.feelslike_c}°C`;

  document.getElementById('humidity').innerHTML = `
    <img src="icons/humility.jpg" alt="humidity icon" class="small-icon"/>
    ${data.current.humidity}%`;

  document.getElementById('wind').innerHTML = `
    <img src="icons/wind.jpg" alt="wind icon" class="small-icon"/>
    ${data.current.wind_kph} km/h`;

  const weeklyForecast = document.getElementById('weeklyForecast');
  weeklyForecast.innerHTML = '';
  data.forecast.forecastday.forEach(day => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <p>${day.date}</p>
      <img src="https:${day.day.condition.icon}" alt="icon"/>
      <p>${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</p>
      <p>${day.day.condition.text}</p>
    `;
    weeklyForecast.appendChild(card);
  });

  const hourlyForecast = document.getElementById('hourlyForecast');
  hourlyForecast.innerHTML = '';
  data.forecast.forecastday[0].hour.forEach(hour => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <p>${hour.time.split(' ')[1]}</p>
      <img src="https:${hour.condition.icon}" alt="icon"/>
      <p>${hour.temp_c}°C</p>
      <p>${hour.condition.text}</p>
    `;
    hourlyForecast.appendChild(card);
  });

  setBackground(data.current.condition.text, data.current.is_day);
}

const images = {
  clouds: "/images/clouds.jpg",
  clearDay: "images/clear-day.jpg",
  clearNight: "images/clear-night.jpg",
  rain: "images/rain.jpg",
  snow: "images/snow.jpg",
  thunderstorm: "images/thunderstorm.jpg",
  drizzle: "images/drizzel.jpg"
};

function setBackground(condition, isDay) {
  const body = document.body;
  let lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("clear")) {
    body.style.backgroundImage = isDay === 1
      ? `url(${images.clearDay})`
      : `url(${images.clearNight})`;
  } else if (lowerCondition.includes("cloud")) {
    body.style.backgroundImage =`url(${images.clouds})`;
  } else if (lowerCondition.includes("rain")) {
    body.style.backgroundImage = `url(${images.rain})`;
  } else if (lowerCondition.includes("snow")) {
    body.style.backgroundImage = `url(${images.snow})`;
  } else if (lowerCondition.includes("thunder")) {
    body.style.backgroundImage = `url(${images.thunderstorm})`;
  } else if (lowerCondition.includes("drizzle")) {
    body.style.backgroundImage = `url(${images.drizzle})`;
  } else {
    body.style.backgroundImage = isDay === 1
      ? `url(${images.clearDay})`
      : `url(${images.clearNight})`;
  }

  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
}