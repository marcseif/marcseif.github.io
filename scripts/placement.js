document.addEventListener("DOMContentLoaded", function () {
  const finalPrice = document.getElementById("final-price");
  const extraOptions = document.querySelectorAll('input[name="extra-options"]');
  const tierIcons = document.querySelectorAll(".tier-selection img");
  const divisionBoxes = document.querySelectorAll(".division-box");
  const currentRankIcon = document.getElementById("current-rank-icon");
  const currentRankName = document.getElementById("current-rank-name");
  const currentDivisionText = document.getElementById("current-division");
  const currentLPDropdown = document.getElementById(
    "current-lp-dropdown-container"
  );
  const currentLPGain = document.getElementById("current-lp-gain-container");
  const currentDivisionContainer = document.getElementById(
    "current-division-selection"
  );
  const currentLPContainer = document.getElementById("current-lp-container");
  const currentLPRange = document.getElementById("current-lp-range");
  const currentLPNumber = document.getElementById("current-lp-number");
  const winsSlider = document.getElementById("wins-slider");
  const winsCountDisplay = document.getElementById("wins-count");
  const winsSummary = document.getElementById("wins-summary");

  let currentTier = "bronze";
  let currentDivision = "II";

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

  // Highlight default tier icon
  const defaultTierIcon = document.querySelector(
    `.tier-selection[data-type="current"] img[data-tier="${currentTier}"]`
  );
  if (defaultTierIcon) {
    defaultTierIcon.classList.add("selected");
  }

  const defaultDivisionBox = document.querySelector(
    `#current-division-selection .division-box[data-division="${currentDivision}"]`
  );
  if (defaultDivisionBox) {
    defaultDivisionBox.classList.add("selected");
  }

  const divisionValues = { I: 1, II: 2, III: 3, IV: 4 };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function calculateBasePrice() {
    let price = tierValues[currentTier] || 0;

    if (tierValues[currentTier] < tierValues["master"]) {
      const divisionAdjustment = (4 - divisionValues[currentDivision]) * 10;
      price += divisionAdjustment;
    } else {
      price += parseInt(currentLPNumber.value || 0, 10);
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
    finalPrice.textContent = `$${price.toFixed(2)}`;
  }

  function updateSummary() {
    const winText = `${winsSlider.value} Game${
      winsSlider.value === "1" ? "" : "s"
    } in`;
    currentRankIcon.src = `images/icons/${currentTier}.png`;
    currentRankName.textContent = winText;
    currentDivisionText.textContent = `${capitalize(currentTier)} ${
      currentTier === "master" ? `${currentLPNumber.value} LP` : currentDivision
    }`;

    if (winsSummary) {
      winsSummary.textContent = winText;
    }
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

  tierIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const tier = this.getAttribute("data-tier");
      const isCurrent =
        this.closest(".tier-selection").getAttribute("data-type") === "current";
      const container = this.closest(".tier-selection");

      container
        .querySelectorAll("img")
        .forEach((img) => img.classList.remove("selected"));
      this.classList.add("selected");

      if (isCurrent) {
        currentTier = tier;

        if (tier === "master") {
          currentDivisionContainer.style.display = "none";
          currentLPContainer.style.display = "block";
        } else {
          currentDivisionContainer.style.display = "block";
          currentLPContainer.style.display = "none";
        }
      }

      updatePriceDisplay();
      updateSummary();
    });
  });

  divisionBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      const div = this.getAttribute("data-division");
      const isCurrent = this.parentElement.id === "current-division-selection";

      if (isCurrent) {
        currentDivision = div;
        this.parentElement
          .querySelectorAll(".division-box")
          .forEach((b) => b.classList.remove("selected"));
        this.classList.add("selected");
      }

      updatePriceDisplay();
      updateSummary();
    });
  });

  extraOptions.forEach((option) => {
    option.addEventListener("change", updatePriceDisplay);
  });

  winsSlider.addEventListener("input", () => {
    const wins = parseInt(winsSlider.value);
    winsCountDisplay.textContent = `${wins} Game${wins === 1 ? "" : "s"}`;
    updateSummary();
  });

  // Subnav highlight
  const page = window.location.pathname.split("/").pop();
  document.querySelectorAll(".subnav-link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href.includes(page));
  });

  updatePriceDisplay();
  updateSummary();
});
