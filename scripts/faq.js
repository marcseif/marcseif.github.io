document.querySelectorAll(".faq-item h3").forEach((header) => {
  header.style.cursor = "pointer";
  header.addEventListener("click", () => {
    const paragraph = header.nextElementSibling;
    const isHidden = window.getComputedStyle(paragraph).display === "none";
    paragraph.style.display = isHidden ? "block" : "none";
  });
});
