document.addEventListener("DOMContentLoaded", () => {
  // Highlight active subnav link
  document.querySelectorAll(".subnav-link").forEach((link) => {
    if (window.location.href.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });

  // Form submission alert
  document.getElementById("orderForm").addEventListener("submit", function (e) {
    alert("Your order has been submitted!");
  });

  // Tier selection logic
  document.querySelectorAll(".tier-selection img").forEach((img) => {
    img.addEventListener("click", () => {
      const type = img.closest(".tier-selection").dataset.type;

      // Clear previous selections
      document
        .querySelectorAll(`.tier-selection[data-type="${type}"] img`)
        .forEach((icon) => icon.classList.remove("selected"));

      img.classList.add("selected");

      const selectedTier = img.dataset.tier;

      const divisionContainer = document.getElementById(
        `${type}-division-container`
      );
      const lpContainer = document.getElementById(`${type}-lp-container`);
      const lpDropdownContainer = document.getElementById(
        `${type}-lp-dropdown-container`
      );
      const lpGainContainer = document.getElementById(
        `${type}-lp-gain-container`
      );
      const divisionInput = document.getElementById(`${type}Division`);

      const isAboveMaster = ["Master", "Grandmaster", "Challenger"].includes(
        selectedTier
      );

      // Use visibility instead of display to avoid layout breaking
      if (divisionContainer)
        divisionContainer.style.visibility = isAboveMaster
          ? "hidden"
          : "visible";
      if (lpContainer)
        lpContainer.style.visibility = isAboveMaster ? "hidden" : "visible";
      if (lpDropdownContainer)
        lpDropdownContainer.style.visibility = isAboveMaster
          ? "hidden"
          : "visible";
      if (lpGainContainer) lpGainContainer.style.visibility = "visible";

      // Set division value appropriately
      if (divisionInput) {
        divisionInput.value = isAboveMaster ? "N/A" : "";
      }

      // Trigger reflow after the display change to ensure proper centering
      setTimeout(() => {
        if (divisionContainer) divisionContainer.offsetHeight; // Accessing this forces a reflow
      }, 50);

      // Update hidden input for tier
      document.getElementById(`${type}Tier`).value = selectedTier;
    });
  });

  // Division selection logic
  document.querySelectorAll(".division-box").forEach((box) => {
    box.addEventListener("click", () => {
      const container = box.closest(".division-selection");

      container
        .querySelectorAll(".division-box")
        .forEach((b) => b.classList.remove("selected"));

      box.classList.add("selected");

      // Determine if it's current or desired division
      const type = container.id.includes("current") ? "current" : "desired";

      // Update hidden input for division
      document.getElementById(`${type}Division`).value = box.dataset.division;
    });
  });
});
