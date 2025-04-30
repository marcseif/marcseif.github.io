document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");

      document.body.style.opacity = 0;

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
});
