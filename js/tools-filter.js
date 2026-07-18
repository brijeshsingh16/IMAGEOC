const buttons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".tool-card");

buttons.forEach(btn => {

    btn.addEventListener("click", () => {

        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        cards.forEach(card => {

            if(filter === "all") {
                card.style.display = "block";
            }
            else {
                card.style.display =
                    card.dataset.category === filter
                    ? "block"
                    : "none";
            }

        });

    });

});