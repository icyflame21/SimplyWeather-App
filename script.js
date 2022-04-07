let current_info=document.querySelector('.current-info')
let future_forecast=document.querySelector('.future-forecast')
let date_container=document.querySelector('.date-container')
let search = document.getElementById('search');
let form = document.getElementById('form');


const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');


let currentWeatherItemEl = document.createElement('div')
currentWeatherItemEl.setAttribute('class','others')

let currentMapItemEl=document.createElement('div')
currentMapItemEl.setAttribute('class','maps')

let currentTempEl = document.createElement('div')
currentTempEl.setAttribute('class', 'today')

let weatherForecastEl = document.createElement('div')
weatherForecastEl.setAttribute('class', 'weather-forecast')

let API_KEY = '5bdc9bb5e105da7714d3b4fda20a88c6';


setInterval(() => {
  const time = new Date();
  var exactTime = time.toLocaleString('en-Us', { hour12: true, timeStyle: 'medium', localeMatcher: 'lookup' })
  var exactDate = time.toLocaleString('en-Us', { hour12: true, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', localeMatcher: 'lookup' })
  
  timeEl.innerHTML = exactTime
  dateEl.innerHTML = exactDate
  date_container.append(timeEl,dateEl)

}, 1000);

getCurrentLocationData();
function getCurrentLocationData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=en`).then(response => response.json()).then(name => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=metric&lang=en`).then(response => response.json()).then(data => {

      showCurrentLocationData(data, name.city.name)
      
    })
    })
  })
}

function showCurrentLocationData(data, cityName) {
  let { humidity, pressure, wind_speed,temp ,sunset,sunrise} = data.current;

  currentWeatherItemEl.innerHTML = 
  `<div class="weather-item">
    <h2>${cityName}</h2>
    </div>
    <div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
    </div>
    <div class="weather-item">
    <div>Temperature</div>
    <div>${temp}&#176;C</div>
    </div>
    <div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
    <div>Sun Rise</div>
    <div>${convert(sunrise)}</div>
    </div>
    <div class="weather-item">
    <div>Sun Set</div>
    <div>${convert(sunset)}</div>
    </div>
    `;
  showWeather_info(data)
  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" + cityName + "')";
  
    let p = document.createElement('p');
    p.setAttribute('class', 'map_para');
    p.innerHTML = `Geo-Location of ${cityName}`;
    let iframe = document.createElement('iframe');
    iframe.src = `https://maps.google.com/maps?q=${cityName}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    iframe.width = 400;
    iframe.height = 220;
  currentMapItemEl.append(p, iframe);
  
  current_info.append(currentWeatherItemEl, currentMapItemEl)
  current_info.style.marginTop="10px"
}
function convert(data) {
  const unixTimestamp = data
  const milliseconds = unixTimestamp * 1000
  const dateObject = new Date(milliseconds)
    var time = dateObject.toLocaleString("en-US", { hour12 :true,timeStyle:'short'}) 
   return time
}

form.addEventListener('submit', e => {
  e.preventDefault();

  
  let searchItem = search.value;
  let search_url = `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${API_KEY}&units=metric&lang=en`;
  getWeather(search_url);
  search.value = '';
  
});



async function getWeather(search_url) {
  try {
    let res = await fetch(search_url);
    let data = await res.json();
    if (data.message === 'city not found') {
      errorMsg();
    } else {
      showWeather(data);
    }
  } catch (err) {
    console.log(err);
  }
}

function errorMsg() {
  document.body.style.backgroundImage ="none";
  document.body.innerHTML = `<div id="container">
          <div class="content">
            <h2>404</h2>
            <h4>City Not Found</h4><br/>
            <p>
              The current city you were looking for doesn't exist.
            </p>
            <a href="index.html">Back To Home</a>
          </div>
</div>`;
  var container = document.getElementById('container');
  window.onmousemove = function (e) {
    var x = -e.clientX / 5,
      y = -e.clientY / 5;
    container.style.backgroundPositionX = x + 'px';
    container.style.backgroundPositionY = y + 'px';
  };
}

function showWeather(data) {
  currentMapItemEl.innerHTML = '';
  let {
    name,
    main: { humidity, pressure, feels_like, temp_min },
    wind: { speed },
    coord: { lon, lat },
    sys:{sunrise,sunset},
  } = data;

  let weather_info_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=metric&lang=en`;
  getWeather_info(weather_info_url);

  currentWeatherItemEl.innerHTML = `
          <div class="weather-item">
          <h2>${name}</h2>
          </div>
          <div class="weather-item">
          <div>Humidity</div>
          <div>${humidity}%</div>
          </div>
          <div class="weather-item">
          <div>Pressure</div>
          <div>${pressure}</div>
          </div>
          <div class="weather-item">
          <div>Feels-Like</div>
          <div>${feels_like}°C</div>
          </div>
          <div class="weather-item">
          <div>Min-Temp</div>
          <div>${temp_min}°C</div>
          </div>
          <div class="weather-item">
          <div>Wind Speed</div>
          <div>${speed} km/h</div>
          </div>
          <div class="weather-item">
          <div>Sun Rise</div>
          <div>${convert(sunrise)}</div>
          </div>
          <div class="weather-item">
          <div>Sun Set</div>
          <div>${convert(sunset)}</div>
          </div>`;

  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" + name + "')";
  let p = document.createElement('p');
  p.setAttribute('class', 'map_para');
  p.innerHTML = `Geo-Location of ${name}`;
  let iframe = document.createElement('iframe');
  iframe.src = `https://maps.google.com/maps?q=${name}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  iframe.width = 400;
  iframe.height = 220;
  currentMapItemEl.append(p, iframe);

  current_info.append(currentWeatherItemEl,currentMapItemEl)
}

async function getWeather_info(weather_info_url) {
  try {
    let res = await fetch(weather_info_url);
    let data = await res.json();
    if (data.message === 'city not found') {
      errorMsg();
    } else {
      showWeather_info(data);
    }
  } catch (err) {
    console.log(err);
  }
}

function showWeather_info(data) {
  let otherDayForecast = '';
  currentTempEl.innerHTML = '';
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `   <img
      src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png "
      alt="weather icon"
      class="w-icon"
    />
    <div class="other">
    <div class="day">${convertDate(day.dt)}</div>
    <div class="temp">Morn:  ${day.temp.morn}&#176;C</div>
    <div class="temp">Night:  ${day.temp.night}&#176;C</div>
    <div class="temp">
    <div>Sun Rise: ${convert(day.sunrise)}</div>
    </div>
    <div class="temp">
    <div>Sun Set: ${convert(day.sunset)}</div>
    </div></div>`;
    } else if (idx < 7) {
      otherDayForecast += `
      <div class="weather-forecast-item">
      <div class="day">${convertDate(day.dt)}</div>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
          <div class="temp">Morn:&nbsp;  ${day.temp.morn}&#176;C</div>
          <div class="temp">Night:&nbsp;  ${day.temp.night}&#176;C</div>
          <div class="temp">
          <div>Sun Rise: ${convert(day.sunrise)}</div>
          </div>
          <div class="temp">
          <div>Sun Set: ${convert(day.sunset)}</div>
          </div>
      </div>
      
      `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;
  // future_forecast.style.background="rgba(24, 24, 27, 0.5)"
  future_forecast.append(currentTempEl, weatherForecastEl)
}

function convertDate(date) {
  const unixTimestamp = date
  const milliseconds = unixTimestamp * 1000
  const dateObject = new Date(milliseconds)
    var day = dateObject.toLocaleString("en-US", { weekday:'long'}) 
   return day
  
}