document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get("service");

  if (serviceParam) {
    const serviceSelect = document.querySelector("#service");
    if (serviceSelect) {
      serviceSelect.value = serviceParam;
      updatePricing(); // If your form dynamically updates price based on selection
    }
  }
});
