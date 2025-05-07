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

  let discountApplied = false;

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

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function calculateBasePrice() {
    const tiers = [
      "iron",
      "bronze",
      "silver",
      "gold",
      "platinum",
      "emerald",
      "diamond",
    ];
    const divisionOrder = ["IV", "III", "II", "I"];
    const divisionPrices = {
      iron: 9,
      bronze: 10,
      silver: 11,
      gold: 24,
      platinum: 45,
      emerald: 60,
      diamond: {
        "4-3": 90,
        "3-2": 100,
        "2-1": 140,
        "1-master": 200,
      },
    };

    // Ladder to Diamond I
    let ladder = [];
    for (let tier of tiers) {
      for (let i = 0; i < divisionOrder.length; i++) {
        ladder.push({
          tier,
          division: divisionOrder[i],
        });
      }
    }
    ladder.push({ tier: "diamond", division: "I" }); // Ensure Diamond I is included

    const currentIndex = ladder.findIndex(
      (r) => r.tier === currentTier && r.division === currentDivision
    );
    const desiredIndex = ladder.findIndex(
      (r) => r.tier === desiredTier && r.division === desiredDivision
    );

    // Case 1: If Desired is Master Tier
    if (desiredTier === "master") {
      let price = 0;

      // If current is already Master
      if (currentTier === "master") {
        const lpDiff =
          parseInt(desiredLPNumber.value || 0) -
          parseInt(currentLPNumber.value || 0);
        return lpDiff > 0 ? lpDiff * 2 : 0;
      }

      // Else, go from current → Diamond I → Master (200)
      for (let i = currentIndex; i < ladder.length - 1; i++) {
        const from = ladder[i];
        const to = ladder[i + 1];

        if (from.tier === "diamond" && from.division === "I") {
          price += divisionPrices.diamond["1-master"];
        } else if (from.tier === "diamond") {
          const key = `${getDivisionNumber(from.division)}-${getDivisionNumber(
            to.division
          )}`;
          price += divisionPrices.diamond[key] || 0;
        } else {
          price += divisionPrices[from.tier] || 0;
        }
      }

      // Then add LP pricing from 0 to desired LP
      const desiredLP = parseInt(desiredLPNumber.value || 0);
      price += desiredLP * 2;

      const proceedButton = document.getElementById("proceed-button");
      const priceWarning = document.getElementById("price-warning");

      return price;
    }

    // Case 2: Neither current nor desired is Master
    if (
      currentIndex === -1 ||
      desiredIndex === -1 ||
      desiredIndex <= currentIndex
    ) {
      return 0;
    }

    let price = 0;
    for (let i = currentIndex; i < desiredIndex; i++) {
      const from = ladder[i];
      const to = ladder[i + 1];

      if (from.tier === "diamond") {
        const key = `${getDivisionNumber(from.division)}-${getDivisionNumber(
          to.division
        )}`;
        price += divisionPrices.diamond[key] || 0;
      } else {
        price += divisionPrices[from.tier] || 0;
      }
    }

    return price;
  }

  function getDivisionNumber(division) {
    switch (division) {
      case "IV":
        return 4;
      case "III":
        return 3;
      case "II":
        return 2;
      case "I":
        return 1;
      default:
        return 0;
    }
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
    const base = calculateBasePrice(); // base from rank selections
    const fullPrice = calculatePrice(base); // total including options
    const discounted = fullPrice * 0.9; // discounted total if coupon applied

    const originalPriceEl = document.querySelector(
      "#final-price .original-price"
    );
    const discountedPriceEl = document.querySelector(
      "#final-price .discounted-price"
    );
    const proceedButton = document.getElementById("proceed-button");
    const priceWarning = document.getElementById("price-warning");

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
      priceWarning.style.display = "none";
    } else {
      originalPriceEl.style.display = "none";
      discountedPriceEl.textContent = "";

      proceedButton.disabled = true;
      priceWarning.style.display = "block";
    }
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
      updatePriceDisplay(); // 💡 This ensures the price updates
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

      container
        .querySelectorAll("img")
        .forEach((img) => img.classList.remove("selected"));
      this.classList.add("selected");

      if (isCurrent) {
        currentTier = tier;

        if (tier === "master") {
          currentDivisionContainer.style.display = "none";
          currentLPDropdown.style.display = "none";
          currentLPGain.style.display = "block";
        } else {
          currentDivisionContainer.style.display = "block";
          currentLPDropdown.style.display = "block";
          currentLPGain.style.display = "block";
        }
        currentLPContainer.style.display = tier === "master" ? "block" : "none";
      } else {
        desiredTier = tier;

        if (tier === "master") {
          desiredDivisionContainer.style.display = "none";
        } else {
          desiredDivisionContainer.style.display = "flex";
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
