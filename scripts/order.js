function updatePricing() {
  const service = document.getElementById("service").value;
  const priceElement = document.getElementById("servicePrice");

  let price = 0;
  switch (service) {
    case "rankBoost":
      price = 150;
      break;
    case "winBoost":
      price = 100;
      break;
    case "duoQueue":
      price = 180;
      break;
    case "placement":
      price = 120;
      break;
    case "coaching":
      price = 250;
      break;
    case "custom":
      price = 300;
      break;
  }

  priceElement.textContent = `$${price} - $${price + 50}`;
}

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Your order has been submitted!");
});

// Function to get query parameters
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to preselect the service based on URL parameter
function preselectService() {
  const service = getQueryParameter("service");
  if (service) {
    const serviceSelect = document.getElementById("service");
    for (let option of serviceSelect.options) {
      if (option.value === service) {
        option.selected = true;
        break;
      }
    }
    // After preselecting, update the price
    updatePricing();
  }
}

window.onload = preselectService;
