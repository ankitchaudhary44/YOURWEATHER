const API_KEY = "d8618a0309d94c55ba2170706250303"; // WeatherAPI.com key
let currentUnit = "C";
let currentCity = "";

// On load: detect city via IP
window.onload = () => {
  document.getElementById("loader").style.display = "block";

  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      currentCity = data.city;
      getWeather(currentCity);
    })
    .catch(() => {
      currentCity = "Delhi";
      getWeather(currentCity);
    });
};

// Main fetch function
function getWeather(city) {
  document.getElementById("loader").style.display = "block";
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1`)
    .then(res => res.json())
    .then(data => {
      updateUI(data);
      currentCity = city;
    })
    .catch(() => {
      alert("City not found or API error!");
    });
}

// Update UI
function updateUI(data) {
  const location = data.location;
  const current = data.current;

  document.getElementById("weatherCard").style.display = "block";
  document.getElementById("loader").style.display = "none";

  document.getElementById("location").textContent = `${location.name}, ${location.country}`;
  document.getElementById("description").textContent = current.condition.text;
  document.getElementById("temperature").textContent = `${current.temp_c}°C`;
  document.getElementById("icon").src = current.condition.icon;
  document.getElementById("feelsLike").textContent = `Feels like: ${current.feelslike_c}°C`;
  document.getElementById("humidity").textContent = `Humidity: ${current.humidity}%`;
  document.getElementById("localTime").textContent = `Local Time: ${location.localtime}`;

  setTheme(current.condition.text.toLowerCase(), current.is_day);
  renderHourly(data.forecast.forecastday[0].hour);
}

// Theme background
function setTheme(condition, isDay) {
  const body = document.body;

  if (condition.includes("sunny") || condition.includes("clear")) {
    body.className = isDay ? "sunny" : "night";
  } else if (condition.includes("cloud")) {
    body.className = "cloudy";
  } else if (condition.includes("rain")) {
    body.className = "rainy";
  } else if (condition.includes("snow")) {
    body.className = "snowy";
  } else {
    body.className = isDay ? "sunny" : "night";
  }
}

// Search weather by input
function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  }
}

// Unit toggle °C/°F
function toggleUnit() {
  if (!currentCity) return;
  fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${currentCity}`)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      if (currentUnit === "C") {
        document.getElementById("temperature").textContent = `${current.temp_f}°F`;
        document.getElementById("feelsLike").textContent = `Feels like: ${current.feelslike_f}°F`;
        currentUnit = "F";
      } else {
        document.getElementById("temperature").textContent = `${current.temp_c}°C`;
        document.getElementById("feelsLike").textContent = `Feels like: ${current.feelslike_c}°C`;
        currentUnit = "C";
      }
    });
}

// Voice Search 🎧
function startVoiceSearch() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice recognition not supported");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("cityInput").value = transcript;
    getWeather(transcript);
  };
}

// Toggle Music 🎵
function toggleMusic() {
  const music = document.getElementById("backgroundMusic");
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// Hourly Forecast
function renderHourly(hourData) {
  const container = document.getElementById("hourlyForecast");
  container.innerHTML = "";

  const now = new Date();
  const currentHour = now.getHours();

  for (let i = currentHour; i < currentHour + 8; i++) {
    const hour = hourData[i % 24];
    const div = document.createElement("div");
    div.classList.add("hour");

    div.innerHTML = `
      <p>${hour.time.split(" ")[1]}</p>
      <img src="${hour.condition.icon}" width="40">
      <p>${hour.temp_c}°C</p>
    `;

    container.appendChild(div);
  }
}
