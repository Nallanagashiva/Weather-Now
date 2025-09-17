const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const errorEl = document.getElementById('error');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  // Clear previous results/errors
  weatherResult.innerHTML = '';
  errorEl.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Loading...';

  try {
    // Get lat/lon from OpenStreetMap Nominatim
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
    );
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lon } = geoData[0];

    // Fetch current weather from Open-Meteo API
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      throw new Error('Weather data not found for this location');
    }

    // Display weather data
    const weather = weatherData.current_weather;
    weatherResult.innerHTML = `
      <p><strong>Temperature:</strong> ${weather.temperature} °C</p>
      <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
      <p><strong>Wind Direction:</strong> ${weather.winddirection}°</p>
      <p><strong>Time:</strong> ${new Date(weather.time).toLocaleString()}</p>
    `;
  } catch (err) {
    errorEl.textContent = err.message || 'Something went wrong';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Check Weather';
  }
});
