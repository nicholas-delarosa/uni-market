const body = document.body;
const modeToggle = document.getElementById("modeToggle");

const savedMode = localStorage.getItem("mode");

if (savedMode === "dark"){
    body.classList.add("dark-mode");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});