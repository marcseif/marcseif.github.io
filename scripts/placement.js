document.addEventListener("DOMContentLoaded", function () {
  const finalPrice = document.getElementById("final-price");
  const extraOptions = document.querySelectorAll('input[name="extra-options"]');
  const tierIcons = document.querySelectorAll(".tier-selection img");
  const divisionBoxes = document.querySelectorAll(".division-box");
  const currentRankIcon = document.getElementById("current-rank-icon");
  const currentRankName = document.getElementById("current-rank-name");
  const currentDivisionText = document.getElementById("current-division");
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

  let discountApplied = false;

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

  function getPricePerWin() {
    switch (currentTier) {
      case "iron":
        return 2;
      case "bronze":
        return 3;
      case "silver":
        return 5;
      case "gold":
        return 9;
      case "platinum":
        return 13;
      case "emerald":
        return 15;
      case "diamond":
        switch (currentDivision) {
          case "IV":
            return 16;
          case "III":
            return 20;
          case "II":
            return 30;
          case "I":
            return 40;
        }
        return 16; // default fallback
      case "master":
        return parseInt(currentLPNumber.value, 10) > 200 ? 70 : 50;
      default:
        return 0;
    }
  }

  function calculatePrice() {
    const perWinPrice = getPricePerWin();
    const wins = parseInt(winsSlider.value, 10);
    let price = perWinPrice * wins;

    extraOptions.forEach((option) => {
      if (!option.checked) return;
      switch (option.value) {
        case "duo-boosting":
          price += price * 0.5;
          break;
        case "plus-1-win":
          price += price * 0.3;
          break;
        case "livestream":
        case "solo-only":
          price += price * 0.25;
          break;
        case "priority-order":
          price += price * 0.2;
          break;
      }
    });

    return Math.max(price, 0);
  }

  function updatePriceDisplay() {
    const fullPrice = calculatePrice(); // total including options
    const discounted = fullPrice * 0.9; // discounted total if coupon applied

    const originalPriceEl = document.querySelector(
      "#final-price .original-price"
    );
    const discountedPriceEl = document.querySelector(
      "#final-price .discounted-price"
    );
    const proceedButton = document.getElementById("proceed-button");

    if (fullPrice > 0) {
      if (discountApplied) {
        originalPriceEl.textContent = `$${fullPrice.toFixed(2)} AUD`;
        originalPriceEl.style.display = "inline";

        discountedPriceEl.textContent = `$${discounted.toFixed(2)} AUD`;
      } else {
        originalPriceEl.style.display = "none";
        discountedPriceEl.textContent = `$${fullPrice.toFixed(2)} AUD`;
      }

      proceedButton.disabled = false;
    } else {
      originalPriceEl.style.display = "none";
      discountedPriceEl.textContent = "";

      proceedButton.disabled = true;
    }
  }

  function updateSummary() {
    const winText = `${winsSlider.value} Win${
      winsSlider.value === "1" ? "" : "s"
    }`;
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
      updatePriceDisplay();
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

      updateSummary(); // Ensure summary is updated when tier is selected
      updatePriceDisplay();
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

      updateSummary(); // Ensure summary is updated when division is selected
      updatePriceDisplay();
    });
  });

  extraOptions.forEach((option) => {
    option.addEventListener("change", updatePriceDisplay);
  });

  winsSlider.addEventListener("input", () => {
    const wins = parseInt(winsSlider.value);
    winsCountDisplay.textContent = `${wins} Win${wins === 1 ? "" : "s"}`;
    updateSummary();
    updatePriceDisplay();
  });

  // Subnav highlight
  const page = window.location.pathname.split("/").pop();
  document.querySelectorAll(".subnav-link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href.includes(page));
  });

  updatePriceDisplay();
  updateSummary();

  document
    .getElementById("apply-coupon")
    .addEventListener("click", function () {
      const couponInput = document.getElementById("coupon-code").value.trim();
      const messageEl = document.getElementById("coupon-message");

      if (couponInput.toUpperCase() === "SITELAUNCH10") {
        discountApplied = true;
        updatePriceDisplay();
        updateSummary(); // if used

        // Show success message
        messageEl.textContent = "Coupon applied successfully!";
        messageEl.style.display = "block";
        messageEl.style.color = "#d8a92b";
      } else {
        // Show error message
        messageEl.textContent = "Invalid coupon code.";
        messageEl.style.display = "block";
        messageEl.style.color = "red";
      }
    });
});

document
  .getElementById("proceed-button")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    // Get only the discounted price text
    const discountedText = document
      .querySelector("#final-price .discounted-price")
      .innerText.replace("$", "");
    const amount = parseFloat(discountedText);

    if (amount <= 0 || isNaN(amount)) {
      alert("Please select a valid boost to proceed.");
      return;
    }

    try {
      const response = await fetch(
        "https://meowmeow-1-90gn.onrender.com/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create Stripe session.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Something went wrong while connecting to Stripe.");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const proceedButton = document.getElementById("proceed-button");
  const buttonText = proceedButton.querySelector(".button-text");
  const spinner = proceedButton.querySelector(".spinner");

  proceedButton.addEventListener("click", (e) => {
    // Prevent multiple clicks
    proceedButton.disabled = true;

    // Apply greyed-out appearance
    proceedButton.classList.add("disabled");

    // Show spinner, hide text
    buttonText.style.display = "none";
    spinner.style.display = "inline-flex";

    // Optional: Simulate redirect delay
    // setTimeout(() => {
    //   window.location.href = 'checkout.html';
    // }, 2000);
  });
});
