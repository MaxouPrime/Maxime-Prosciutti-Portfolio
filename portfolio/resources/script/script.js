


const header = document.querySelector("header");
const main = document.querySelector("main");

// Pour le Carrouseul
const track = document.querySelector('.carousel-track');
const viewport = document.querySelector('.carousel-viewport');
const items = document.querySelectorAll('.carousel-item');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');


let lastScroll = main.scrollTop;


main.addEventListener("scroll", () => {
    let currentScroll = main.scrollTop;

    if (currentScroll > lastScroll) {
        // Scroll vers le bas → cacher
        header.classList.add("hide");
    } else {
        // Scroll vers le haut → montrer
        header.classList.remove("hide");
    }

    lastScroll = currentScroll;
});

/*
document.getElementsByTagName("nav").addEventListener("click", function(){
    setTimeout(function(){
        header.classList.remove("hide")
    }, 1000);
});
*/

window.addEventListener("resize", () => {
    // Remettre le header visible
    header.classList.remove("hide");

    // Recalcule lastScroll pour éviter un saut au prochain scroll
    lastScroll = main.scrollTop;

});


let index = 0;


function updateCarousel() {
    const width = viewport.getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * width}px)`;
}

nextBtn.addEventListener('click', () => {
    index = (index + 1) % items.length;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    updateCarousel();
});



