const apiKey = "f457f13b4e89bbf0c3a607f3e9ab6693"; // 🔑 Replace with your real OpenWeather key

 /* Open & Close Overlay */
  function openNav() {
    document.getElementById("myNav").style.width = "50%"; // Left half
  }
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }

  // Close overlay if clicked outside slideshow
  function closeOnOutside(event) {
    if (event.target.id === "myNav") {
      closeNav();
    }
  }

  /* Slideshow */
  let slideIndex = 0;
  function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 4000); // change every 4 sec
  }
  showSlides();
// ---- Current Weather Function ----
function getWeather() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("weatherResult");

  if (city === "") {
    result.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found!");
      }
      return response.json();
    })
    .then(data => {
      result.innerHTML = `
        <div class="card">
          <h3>Weather in ${data.name}, ${data.sys.country}</h3>
          <p>🌡 Temperature: ${data.main.temp}°C</p>
          <p>☁ Condition: ${data.weather[0].description}</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>💨 Wind: ${data.wind.speed} m/s</p>
          <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">
        </div>
      `;
    })
    .catch(error => {
      result.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

// ---- 5 Day Forecast Function ----
function getForecast() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("forecastResult");

  if (city === "") {
    result.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found!");
      }
      return response.json();
    })
    .then(data => {
      let forecastHTML = "<h3>📅 5-Day Forecast</h3><div style='display:flex;gap:15px;overflow-x:auto;'>";

      // OpenWeather returns forecast every 3 hours → pick 1 forecast per day (12:00)
      const dailyData = data.list.filter(f => f.dt_txt.includes("12:00:00"));

      dailyData.forEach(day => {
        const date = new Date(day.dt_txt).toDateString();
        forecastHTML += `
          <div class="card">
            <h4>${date}</h4>
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
          </div>
        `;
      });

      forecastHTML += "</div>";
      result.innerHTML = forecastHTML;
    })
    .catch(error => {
      result.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}


