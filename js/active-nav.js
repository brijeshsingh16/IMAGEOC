/* ================= ACTIVE NAV ================= */

const sections = document.querySelectorAll(
    "section[id]:not(#workspace):not(#multiWorkspace)"
);

const navLinks = document.querySelectorAll(".nav-link");
const footer = document.querySelector("footer");

function setActiveNav() {
    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (window.scrollY >= top - height / 3) {
            current = section.id;
        }

    });

    if (footer) {
        const footerTop = footer.offsetTop;

        if (window.scrollY >= footerTop - 100) {
            current = "";
        }
    }

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            current !== "" &&
            link.getAttribute("href") === "#" + current
        );
    });
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);