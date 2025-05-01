document.addEventListener("DOMContentLoaded", function () {
  const finalPrice = document.getElementById("final-price");
  const extraOptions = document.querySelectorAll('input[name="extra-options"]');
  const currentRankIcon = document.getElementById("current-rank-icon");
  const currentRankName = document.getElementById("current-rank-name");
  const currentDivision = document.getElementById("current-division");
  const desiredRankIcon = document.getElementById("desired-rank-icon");
  const desiredRankName = document.getElementById("desired-rank-name");
  const desiredDivision = document.getElementById("desired-division");

  const tierValues = {
    iron: 0,
    bronze: 50,
    silver: 100,
    gold: 150,
    platinum: 200,
    emerald: 250,
    diamond: 300,
    master: 350,
    grandmaster: 400,
  };

  const divisionValues = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
  };

  let selectedCurrentTier = "bronze";
  let selectedDesiredTier = "silver";
  let selectedCurrentDivision = "II";
  let selectedDesiredDivision = "II";

  // Helper function to capitalize the first letter
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Function to calculate the base price (difference between tiers and divisions)
  function calculateBasePrice() {
    let price = Math.abs(
      tierValues[selectedDesiredTier] - tierValues[selectedCurrentTier]
    );

    // Calculate price difference based on division selection
    const currentDivisionValue = divisionValues[selectedCurrentDivision];
    const desiredDivisionValue = divisionValues[selectedDesiredDivision];
    const divisionDifference = desiredDivisionValue - currentDivisionValue;

    // If desired division is higher than current, subtract $50; otherwise, add $50
    if (divisionDifference > 0) {
      price -= divisionDifference * 50; // Subtract 50 if desired division is higher
    } else {
      price += Math.abs(divisionDifference) * 50; // Add 50 if desired division is lower
    }

    return price;
  }

  // Function to calculate the max price (base price + all options selected)
  function calculateMaxPrice() {
    let basePrice = calculateBasePrice();
    let maxPrice = basePrice;

    // Add all options to the max price
    extraOptions.forEach((option) => {
      if (option.checked) {
        switch (option.value) {
          case "duo-boosting":
            maxPrice += basePrice * 0.5; // 50% increase
            break;
          case "plus-1-win":
            maxPrice += basePrice * 0.3; // 30% increase
            break;
          case "livestream":
            maxPrice += basePrice * 0.25; // 25% increase
            break;
          case "solo-only":
            maxPrice += basePrice * 0.25; // 25% increase
            break;
          case "priority-order":
            maxPrice += basePrice * 0.2; // 20% increase
            break;
          case "appear-offline":
            // No charge for Appear Offline
            break;
          default:
            break;
        }
      }
    });

    return maxPrice;
  }

  // Function to calculate the current price, considering selected options
  function calculateCurrentPrice() {
    let basePrice = calculateBasePrice();
    let currentPrice = basePrice;

    extraOptions.forEach((option) => {
      if (option.checked) {
        switch (option.value) {
          case "duo-boosting":
            currentPrice += basePrice * 0.5; // 50% increase
            break;
          case "plus-1-win":
            currentPrice += basePrice * 0.3; // 30% increase
            break;
          case "livestream":
            currentPrice += basePrice * 0.25; // 25% increase
            break;
          case "solo-only":
            currentPrice += basePrice * 0.25; // 25% increase
            break;
          case "priority-order":
            currentPrice += basePrice * 0.2; // 20% increase
            break;
          case "appear-offline":
            // No charge for Appear Offline
            break;
          default:
            break;
        }
      }
    });

    // Ensure the price does not go below 0
    return Math.max(currentPrice, 0);
  }

  // Function to update the final price display
  function updatePriceDisplay() {
    const currentPrice = calculateCurrentPrice();
    const maxPrice = calculateMaxPrice();

    // If the current price exceeds max price, display only the max price
    if (currentPrice >= maxPrice) {
      finalPrice.textContent = `$${maxPrice.toFixed(2)}`;
    } else {
      finalPrice.textContent = `$${currentPrice.toFixed(
        2
      )} - $${maxPrice.toFixed(2)}`;
    }
  }

  // Function to update the rank summary
  function updateRankSummary() {
    // Update current rank
    currentRankIcon.src = `images/icons/${selectedCurrentTier}.png`;
    currentRankName.textContent = capitalizeFirstLetter(selectedCurrentTier);
    currentDivision.textContent = selectedCurrentDivision;

    // Update desired rank
    desiredRankIcon.src = `images/icons/${selectedDesiredTier}.png`;
    desiredRankName.textContent = capitalizeFirstLetter(selectedDesiredTier);
    desiredDivision.textContent = selectedDesiredDivision;
  }

  // Function to highlight the current subnav link
  function highlightCurrentSubnavLink() {
    const currentPage = window.location.pathname.split("/").pop();
    const subnavLinks = document.querySelectorAll(".subnav-link");

    subnavLinks.forEach((link) => {
      const href = link.getAttribute("href");

      // Special handling for the "Order" page - highlight "Rank Boost" by default
      if (href.includes(currentPage)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Setup tier selection
  function setupTierSelection(containerSelector, isCurrent) {
    const container = document.querySelector(containerSelector);
    const images = container.querySelectorAll("img");

    images.forEach((img) => {
      img.addEventListener("click", () => {
        images.forEach((el) => el.classList.remove("selected"));
        img.classList.add("selected");

        const selected = img.getAttribute("data-tier");
        if (isCurrent) {
          selectedCurrentTier = selected;
        } else {
          selectedDesiredTier = selected;
        }

        updatePriceDisplay();
        updateRankSummary(); // Update rank summary
      });
    });

    // Select default initially
    images[isCurrent ? 1 : 2].classList.add("selected"); // default to bronze & silver
  }

  // Setup division selection
  function setupDivisionSelection(containerSelector, isCurrent) {
    const container = document.querySelector(containerSelector);
    const boxes = container.querySelectorAll(".division-box");

    boxes.forEach((box) => {
      box.addEventListener("click", () => {
        boxes.forEach((el) => el.classList.remove("selected"));
        box.classList.add("selected");

        const selected = box.getAttribute("data-division");
        if (isCurrent) {
          selectedCurrentDivision = selected;
        } else {
          selectedDesiredDivision = selected;
        }

        updatePriceDisplay();
        updateRankSummary(); // Update rank summary
      });
    });

    // Select default division initially
    container
      .querySelector(`[data-division="${isCurrent ? "II" : "II"}"]`)
      .classList.add("selected");
  }

  // Setup extra options
  function setupExtraOptions() {
    extraOptions.forEach((option) => {
      option.addEventListener("change", () => {
        updatePriceDisplay();
      });
    });
  }

  // Initialize the page
  setupTierSelection("#current-tier-icons", true);
  setupTierSelection("#desired-tier-icons", false);
  setupDivisionSelection("#current-division-selection", true);
  setupDivisionSelection("#desired-division-selection", false);
  setupExtraOptions();

  highlightCurrentSubnavLink(); // Highlight the correct subnav link on page load

  updatePriceDisplay(); // Initial calculation
  updateRankSummary(); // Initial rank summary
});

document.addEventListener("DOMContentLoaded", function () {
  const tierIcons = document.querySelectorAll(".tier-selection img");
  const divisionBoxes = document.querySelectorAll(".division-box");
  const currentRankIcon = document.getElementById("current-rank-icon");
  const desiredRankIcon = document.getElementById("desired-rank-icon");
  const currentRankName = document.getElementById("current-rank-name");
  const desiredRankName = document.getElementById("desired-rank-name");
  const currentDivisionText = document.getElementById("current-division");
  const desiredDivisionText = document.getElementById("desired-division");

  const currentDivisionContainer = document.getElementById(
    "current-division-selection"
  );
  const desiredDivisionContainer = document.getElementById(
    "desired-division-selection"
  );

  const currentLPContainer = document.getElementById("current-lp-container");
  const desiredLPContainer = document.getElementById("desired-lp-container");

  const currentLPRange = document.getElementById("current-lp-range");
  const currentLPNumber = document.getElementById("current-lp-number");

  const desiredLPRange = document.getElementById("desired-lp-range");
  const desiredLPNumber = document.getElementById("desired-lp-number");

  let currentTier = "bronze";
  let desiredTier = "silver";
  let currentDivision = "II";
  let desiredDivision = "II";

  // Highlight active subnav link
  const currentPage = window.location.pathname.split("/").pop();
  const activeLink = document.querySelector(
    `.subnav-link[href="${currentPage}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }

  // Sync LP slider and input
  function syncLPInputs(rangeInput, numberInput) {
    rangeInput.addEventListener("input", () => {
      numberInput.value = rangeInput.value;
      updateSummary(); // Update summary immediately after changing LP slider
    });
    numberInput.addEventListener("input", () => {
      const value = Math.max(0, Math.min(1000, numberInput.value));
      numberInput.value = value;
      rangeInput.value = value;
      updateSummary(); // Update summary immediately after changing LP number
    });
  }

  syncLPInputs(currentLPRange, currentLPNumber);
  syncLPInputs(desiredLPRange, desiredLPNumber);

  function updateSummary() {
    currentRankIcon.src = `images/icons/${currentTier}.png`;
    currentRankName.textContent = capitalize(currentTier);
    currentDivisionText.textContent =
      currentTier === "master"
        ? `${currentLPNumber.value} LP`
        : currentDivision;

    desiredRankIcon.src = `images/icons/${desiredTier}.png`;
    desiredRankName.textContent = capitalize(desiredTier);
    desiredDivisionText.textContent =
      desiredTier === "master"
        ? `${desiredLPNumber.value} LP`
        : desiredDivision;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  tierIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const selectedTier = this.getAttribute("data-tier");
      const tierType =
        this.closest(".tier-selection").getAttribute("data-type");

      // Highlight only selected icon
      const allIcons = this.closest(".tier-selection").querySelectorAll("img");
      allIcons.forEach((img) => img.classList.remove("selected"));
      this.classList.add("selected");

      if (tierType === "current") {
        currentTier = selectedTier;

        if (currentTier === "master") {
          currentDivisionContainer.style.display = "none";
          currentLPContainer.style.display = "block";
        } else {
          currentDivisionContainer.style.display = "flex";
          currentLPContainer.style.display = "none";
        }
      } else {
        desiredTier = selectedTier;

        if (desiredTier === "master") {
          desiredDivisionContainer.style.display = "none";
          desiredLPContainer.style.display = "block";
        } else {
          desiredDivisionContainer.style.display = "flex";
          desiredLPContainer.style.display = "none";
        }
      }

      updateSummary();
    });
  });

  divisionBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      const division = this.getAttribute("data-division");
      const parentId = this.parentElement.id;

      // Highlight only selected division
      const allDivs = this.parentElement.querySelectorAll(".division-box");
      allDivs.forEach((div) => div.classList.remove("selected"));
      this.classList.add("selected");

      if (parentId === "current-division-selection") {
        currentDivision = division;
      } else {
        desiredDivision = division;
      }

      updateSummary();
    });
  });

  updateSummary(); // Initial render
});

// When the slider changes, update the number input and vice versa
document
  .getElementById("current-lp-slider")
  .addEventListener("input", function () {
    currentLPNumber.value = this.value;
    updateSummary(); // Update summary with new value
  });

document
  .getElementById("desired-lp-slider")
  .addEventListener("input", function () {
    desiredLPNumber.value = this.value;
    updateSummary(); // Update summary with new value
  });

currentLPNumber.addEventListener("input", function () {
  document.getElementById("current-lp-slider").value = this.value;
  updateSummary(); // Update summary with new value
});

desiredLPNumber.addEventListener("input", function () {
  document.getElementById("desired-lp-slider").value = this.value;
  updateSummary(); // Update summary with new value
});

// Get references to the current rank elements
const currentTierIcons = document.querySelectorAll("#current-tier-icons img");
const currentDivisionLabel = document.getElementById("current-division-label");
const currentDivisionSelection = document.getElementById(
  "current-division-selection"
);

// Function to hide the division fields for Masters+ ranks
function updateDivisionVisibility() {
  // Get the selected tier
  const selectedTier = document.querySelector(
    "#current-tier-icons img.selected"
  );

  // Check if the selected tier is Master or higher
  if (
    selectedTier &&
    (selectedTier.dataset.tier === "master" ||
      selectedTier.dataset.tier === "grandmaster")
  ) {
    // Hide the division label and selection for Masters+
    currentDivisionLabel.style.display = "none";
    currentDivisionSelection.style.display = "none";
  } else {
    // Show the division label and selection for lower ranks
    currentDivisionLabel.style.display = "block";
    currentDivisionSelection.style.display = "block";
  }
}

// Add event listeners to tier icons
currentTierIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // Remove selected class from all icons
    currentTierIcons.forEach((el) => el.classList.remove("selected"));

    // Add selected class to the clicked icon
    icon.classList.add("selected");

    // Update division visibility based on the selected tier
    updateDivisionVisibility();
  });
});
