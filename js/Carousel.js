// === CAROUSEL ===
const carousel = document.getElementById('carousel');
let items = document.querySelectorAll('.item');

const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let interval = 3000;
let current = 2;

// Fonction qui repositionne les cartes
function updateCarousel() {
  items.forEach((item, index) => {
    const offset = index - current;
    const abs = Math.abs(offset);

    item.style.transform = `
      translateX(${offset * 380}px)
      scale(${1 - abs * 0.1})
      rotateY(${offset * -10}deg)
    `;
    item.style.zIndex = `${20 - abs}`;
    item.style.opacity = abs > 3 ? 0 : 1;
  });
}

function shiftRight() {
  const first = items[0];
  carousel.appendChild(first);
  items = document.querySelectorAll('.item');
}

function shiftLeft() {
  const last = items[items.length - 1];
  carousel.insertBefore(last, carousel.firstChild);
  items = document.querySelectorAll('.item');
}

// Boutons
nextBtn.addEventListener('click', () => {
  current++;
  if (current > items.length - 3) { shiftRight(); current--; }
  updateCarousel();
  resetAutoScroll();
});

prevBtn.addEventListener('click', () => {
  current--;
  if (current < 2) { shiftLeft(); current++; }
  updateCarousel();
  resetAutoScroll();
});

// Auto-scroll
function nextSlide() {
  current++;
  if (current > items.length - 3) { shiftRight(); current--; }
  updateCarousel();
}

let auto = setInterval(nextSlide, interval);

function resetAutoScroll() {
  clearInterval(auto);
  auto = setInterval(nextSlide, interval);
}

carousel.addEventListener('mouseenter', () => clearInterval(auto));
carousel.addEventListener('mouseleave', () => auto = setInterval(nextSlide, interval));

updateCarousel();

// === POPUP ===
const popup = document.getElementById('popup');
const popupImg = popup.querySelector('.popup-img');
const popupClose = popup.querySelector('.popup-close');

// Ouvrir popup au clic sur une image du carousel
items.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if(img){
      popupImg.src = img.src;
      popup.classList.add('active'); // ✅ active le popup via CSS
    }
  });
});

// Fermer popup
popupClose.addEventListener('click', () => popup.classList.remove('active'));

// Fermer popup en cliquant en dehors de l'image
popup.addEventListener('click', e => {
  if(e.target === popup) popup.classList.remove('active');
});
