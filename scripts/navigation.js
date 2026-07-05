const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
}
