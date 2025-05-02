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

      const isAboveMaster = ["master", "grandmaster", "challenger"].includes(
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

      // Trigger reflow after the display change to ensure proper centering
      setTimeout(() => {
        divisionContainer.offsetHeight; // Accessing this forces a reflow
      }, 50);

      // Update hidden input for current tier
      document.getElementById("currentTier").value = selectedTier;
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

      // Update hidden input for current division
      document.getElementById("currentDivision").value = box.dataset.division;
    });
  });
});
