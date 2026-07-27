document.addEventListener("DOMContentLoaded", () => {

    const lightTheme = document.getElementById("light-theme");
    const darkTheme = document.getElementById("dark-theme");

    // Desktop + Mobile toggles
    const themeSwitches = document.querySelectorAll(".ui-switch input");

    // Load saved theme
    let currentTheme = localStorage.getItem("theme") || "light";

    function setTheme(theme) {

    document.body.style.opacity = "0.98";

    setTimeout(() => {

        if (theme === "dark") {
            lightTheme.media = "not all";
            darkTheme.media = "all";
        } else {
            lightTheme.media = "all";
            darkTheme.media = "not all";
        }

        themeSwitches.forEach(toggle => {
            toggle.checked = theme === "dark";
        });

        localStorage.setItem("theme", theme);

        document.body.style.opacity = "1";

    }, 100);

}

    // Initial theme
    setTheme(currentTheme);

    // Listen to all switches
    themeSwitches.forEach(toggle => {

        toggle.addEventListener("change", () => {

            const theme = toggle.checked ? "dark" : "light";

            setTheme(theme);

        });

    });

});