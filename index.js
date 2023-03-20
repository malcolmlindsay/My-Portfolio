// Text effect in Header section

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cities = ["Washington, DC", "Vienna, VA", "Minneapolis, MN"];
let citiesIndex = 0;

document.getElementById('location').onmouseover = event => {

    let iterations = 0;

    if (citiesIndex == cities.length-1) {
        citiesIndex = -1;
    }
    citiesIndex +=1;

    const interval = setInterval(() => {
        event.target.innerText = cities[citiesIndex].split("")
        .map((letter, index) => {

            if (index <= iterations) {
                return event.target.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * 26)];
        })
        .join("")

    if (iterations > event.target.innerText.length) clearInterval(interval)

    iterations += 1 / 2;

    }, 30)

    event.target.dataset.value = cities[citiesIndex];
}

// Nav drop down menu

const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navLinks = document.getElementsByClassName('main-nav-links')[0]

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active')
})
