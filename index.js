const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDiv = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');

async function fetchWeatherAlerts(state) {
  try {
    if (!state || state.length !== 2) {
      throw new Error('Please enter a valid 2-letter state code.');
    }

    const response = await fetch(`https://api.weather.gov/alerts/active?area=${state.toUpperCase()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather alerts. Please try again.');
    }

    const data = await response.json();
    displayAlerts(data);

  } catch (error) {
    showError(error.message);
  }
}

function displayAlerts(data) {
  alertsDiv.innerHTML = '';
  hideError();

  const alertCount = data?.features?.length || 0;

  const summary = document.createElement('h2');
  summary.textContent = `Weather Alerts: ${alertCount}`;
  alertsDiv.appendChild(summary);

  if (alertCount > 0) {
    const list = document.createElement('ul');
    data.features.forEach(alert => {
      const item = document.createElement('li');
      item.textContent = alert.properties.headline;
      list.appendChild(item);
    });
    alertsDiv.appendChild(list);
  }

  stateInput.value = '';
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function hideError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}

fetchButton.addEventListener('click', () => {
  const state = stateInput.value.trim();
  fetchWeatherAlerts(state);
});

if (typeof module !== 'undefined') {
  module.exports = { fetchWeatherAlerts, displayAlerts, showError, hideError };
}
