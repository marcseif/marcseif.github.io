document.addEventListener("DOMContentLoaded", function () {
  const finalPrice = document.getElementById("final-price");
  const extraOptions = document.querySelectorAll('input[name="extra-options"]');
  const tierIcons = document.querySelectorAll(".tier-selection img");
  const divisionBoxes = document.querySelectorAll(".division-box");
  const currentRankIcon = document.getElementById("current-rank-icon");
  const desiredRankIcon = document.getElementById("desired-rank-icon");
  const currentRankName = document.getElementById("current-rank-name");
  const desiredRankName = document.getElementById("desired-rank-name");
  const currentDivisionText = document.getElementById("current-division");
  const desiredDivisionText = document.getElementById("desired-division");
  const currentLPDropdown = document.getElementById(
    "current-lp-dropdown-container"
  );
  const currentLPGain = document.getElementById("current-lp-gain-container");
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

  // Highlight the current rank on page load
  const currentRankImg = document.querySelector(
    `.tier-selection[data-type="current"] img[data-tier="${currentTier}"]`
  );
  if (currentRankImg) {
    currentRankImg.classList.add("selected");
  }

  // Highlight the desired rank on page load
  const desiredRankImg = document.querySelector(
    `.tier-selection[data-type="desired"] img[data-tier="${desiredTier}"]`
  );
  if (desiredRankImg) {
    desiredRankImg.classList.add("selected");
  }

  // For divisions, select the default division
  const currentDivisionBox = currentDivisionContainer.querySelector(
    `.division-box[data-division="${currentDivision}"]`
  );
  if (currentDivisionBox) {
    currentDivisionBox.classList.add("selected");
  }

  const desiredDivisionBox = desiredDivisionContainer.querySelector(
    `.division-box[data-division="${desiredDivision}"]`
  );
  if (desiredDivisionBox) {
    desiredDivisionBox.classList.add("selected");
  }

  const tierValues = {
    iron: 0,
    bronze: 50,
    silver: 100,
    gold: 150,
    platinum: 200,
    emerald: 250,
    diamond: 300,
    master: 350,
  };

  const divisionValues = { I: 1, II: 2, III: 3, IV: 4 };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function calculateBasePrice() {
    let price = 0;

    // Check if the current tier is less than Master
    if (tierValues[currentTier] < tierValues["master"]) {
      // Set current LP to 0 if the current tier is less than Master
      currentLPNumber.value = 0;
    }

    // Check if the final rank is Master or higher
    if (tierValues[desiredTier] >= tierValues["master"]) {
      // If the current rank is not Master, include $50 per rank difference
      if (tierValues[currentTier] < tierValues["master"]) {
        const tierDiff = Math.abs(
          tierValues[desiredTier] - tierValues[currentTier]
        );
        price += tierDiff * 50; // $50 per rank difference
      }

      // Add the LP difference ($1 per LP difference)
      const currentLP = parseInt(currentLPNumber.value, 10); // Current LP input
      const desiredLP = parseInt(desiredLPNumber.value, 10); // Desired LP input
      price += Math.abs(desiredLP - currentLP); // $1 per LP difference
    } else {
      // Non-Master ranks: Price is based on tier difference and division difference
      price = tierValues[desiredTier] - tierValues[currentTier];

      // Only calculate division difference if both tiers are below Master
      if (
        tierValues[currentTier] < tierValues["master"] &&
        tierValues[desiredTier] < tierValues["master"]
      ) {
        const divisionDiff =
          divisionValues[currentDivision] - divisionValues[desiredDivision];
        price += divisionDiff * 50;
        price = divisionDiff;
      }
    }

    return Math.max(price, 0);
  }

  function calculatePrice(base) {
    let price = base;
    extraOptions.forEach((option) => {
      if (!option.checked) return;
      switch (option.value) {
        case "duo-boosting":
          price += base * 0.5;
          break;
        case "plus-1-win":
          price += base * 0.3;
          break;
        case "livestream":
        case "solo-only":
          price += base * 0.25;
          break;
        case "priority-order":
          price += base * 0.2;
          break;
      }
    });
    return Math.max(price, 0);
  }

  function updatePriceDisplay() {
    const base = calculateBasePrice();
    const price = calculatePrice(base);
    const max = calculatePrice(base); // Identical calculation — can simplify if max logic varies later

    finalPrice.textContent =
      price >= max
        ? `$${max.toFixed(2)}`
        : `$${price.toFixed(2)} - $${max.toFixed(2)}`;
  }

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

  function setupLPInputs(rangeInput, numberInput) {
    const sync = (val) => {
      const value = Math.max(0, Math.min(1000, val));
      rangeInput.value = value;
      numberInput.value = value;
      updateSummary();
    };
    rangeInput.addEventListener("input", () => sync(rangeInput.value));
    numberInput.addEventListener("input", () => sync(numberInput.value));
  }

  setupLPInputs(currentLPRange, currentLPNumber);
  setupLPInputs(desiredLPRange, desiredLPNumber);

  tierIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const tier = this.getAttribute("data-tier");
      const isCurrent =
        this.closest(".tier-selection").getAttribute("data-type") === "current";
      const container = this.closest(".tier-selection");

      // Reset all icons
      container
        .querySelectorAll("img")
        .forEach((img) => img.classList.remove("selected"));
      this.classList.add("selected");

      if (isCurrent) {
        currentTier = tier;

        // Adjust current division container visibility based on the tier selected
        if (tier === "master") {
          currentDivisionContainer.style.display = "none"; // Hide division for master
          currentLPDropdown.style.display = "none";
          currentLPGain.style.display = "block";
        } else {
          currentDivisionContainer.style.display = "block"; // Show division for all other tiers
          currentLPDropdown.style.display = "block";
          currentLPGain.style.display = "block";
        }
        currentLPContainer.style.display = tier === "master" ? "block" : "none";
      } else {
        desiredTier = tier;

        // Adjust desired division container visibility based on the tier selected
        if (tier === "master") {
          desiredDivisionContainer.style.display = "none"; // Hide division for master
        } else {
          desiredDivisionContainer.style.display = "flex"; // Show division for all other tiers
        }
        desiredLPContainer.style.display = tier === "master" ? "block" : "none";
      }

      // Update price and summary
      updatePriceDisplay();
      updateSummary();
    });
  });

  divisionBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      const div = this.getAttribute("data-division");
      const isCurrent = this.parentElement.id === "current-division-selection";

      this.parentElement
        .querySelectorAll(".division-box")
        .forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");

      if (isCurrent) currentDivision = div;
      else desiredDivision = div;

      updatePriceDisplay();
      updateSummary();
    });
  });

  extraOptions.forEach((option) => {
    option.addEventListener("change", updatePriceDisplay);
  });

  const page = window.location.pathname.split("/").pop();
  document.querySelectorAll(".subnav-link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href.includes(page));
  });

  updatePriceDisplay();
  updateSummary();
});
