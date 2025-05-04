document.querySelectorAll(".faq-item h3").forEach((header) => {
  header.style.cursor = "pointer";
  header.addEventListener("click", () => {
    const paragraph = header.nextElementSibling;
    paragraph.style.display =
      paragraph.style.display === "none" ? "block" : "none";
  });
});
