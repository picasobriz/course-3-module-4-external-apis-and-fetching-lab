// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// 1. Select the correct DOM elements as expected by the tests
const stateInput = document.querySelector('input'); // Or document.getElementById('state-input') depending on your HTML
const searchButton = document.querySelector('button'); // Selects the action button triggering the event
const alertsContainer = document.getElementById('alerts-display'); // Test looks specifically for #alerts-display
const errorMessageDiv = document.getElementById('error-message');

// Event Listener for the Search Button
searchButton.addEventListener('click', () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();
  handleSearch(stateAbbr);
});

// Main orchestrator function
async function handleSearch(state) {
  // Clear alerts-display container and hide previous errors
  alertsContainer.innerHTML = '';
  hideError();

  try {
    const data = await fetchWeatherAlerts(state);
    
    // Display the alerts in the DOM
    displayAlerts(data);
    
    // Clear input field *after* a successful fetch operation
    stateInput.value = '';
  } catch (error) {
    showError(error.message);
  }
}

// Fetch weather alerts from API
async function fetchWeatherAlerts(state) {
  const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);
  
  if (!response.ok) {
    throw new Error('Network failure');
  }
  
  return await response.json();
}

// Display alerts inside #alerts-display
function displayAlerts(data) {
  const features = data.features || [];
  const alertCount = features.length;

  // Header/summary formatted exactly as the test expects: "Weather Alerts: X"
  const summaryElement = document.createElement('h3');
  summaryElement.textContent = `Weather Alerts: ${alertCount}`;
  alertsContainer.appendChild(summaryElement);

  // List each alert headline
  features.forEach(alert => {
    const headlineText = alert.properties?.headline || "No headline available";
    const alertItem = document.createElement('p');
    alertItem.textContent = headlineText;
    alertsContainer.appendChild(alertItem);
  });
}

// Handle error styling using the "hidden" class expected by Jest
function showError(message) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove('hidden'); // The test checks: expect(errorDiv).not.toHaveClass('hidden')
}

function hideError() {
  errorMessageDiv.textContent = '';
  errorMessageDiv.classList.add('hidden'); // Hide by default using the 'hidden' class
}