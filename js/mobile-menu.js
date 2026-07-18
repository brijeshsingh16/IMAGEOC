/* ================= MOBILE MENU ================= */
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => 
{
	navbar.classList.toggle("active");
	menuToggle.classList.toggle("active");

	const isOpen = navbar.classList.contains("active");
	menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-link").forEach(link => 
{
	link.addEventListener("click", () => 
	{
		navbar.classList.remove("active");
		menuToggle.classList.remove("active");
		menuToggle.setAttribute("aria-expanded", "false");
	});
});

document.addEventListener("click", (e) => 
{
	if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) 
	{
		navbar.classList.remove("active");
		menuToggle.classList.remove("active");
		menuToggle.setAttribute("aria-expanded", "false");
	}
});