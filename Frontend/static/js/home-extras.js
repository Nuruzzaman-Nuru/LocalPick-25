document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("shop-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dotsWrap = slider.querySelector(".slider-dots");
  const prevBtn = slider.querySelector(".slider-control.prev");
  const nextBtn = slider.querySelector(".slider-control.next");

  let active = 0;
  let timer = null;

  function renderDots() {
    dotsWrap.innerHTML = "";
    slides.forEach((_, idx) => {
      const btn = document.createElement("button");
      if (idx === active) btn.classList.add("active");
      btn.addEventListener("click", () => goTo(idx));
      dotsWrap.appendChild(btn);
    });
  }

  function goTo(index) {
    slides[active].classList.remove("active");
    active = (index + slides.length) % slides.length;
    slides[active].classList.add("active");
    renderDots();
    restart();
  }

  function next() {
    goTo(active + 1);
  }

  function prev() {
    goTo(active - 1);
  }

  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  renderDots();
  restart();
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("product-slider");
  if (!slider) return;

  const track = slider.querySelector(".product-track");
  const slides = Array.from(slider.querySelectorAll(".product-slide"));
  const dotsWrap = slider.querySelector(".product-dots");
  const prevBtn = slider.querySelector(".prod-control.prev");
  const nextBtn = slider.querySelector(".prod-control.next");

  let perView = 4;
  let position = 0;

  function calcPerView() {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 900) return 2;
    if (width <= 1100) return 3;
    return 4;
  }

  function pageCount() {
    return Math.max(1, Math.ceil(slides.length / perView));
  }

  function renderDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pageCount(); i++) {
      const btn = document.createElement("button");
      if (i === Math.floor(position / perView)) btn.classList.add("active");
      btn.addEventListener("click", () => {
        position = i * perView;
        clampPosition();
        move();
      });
      dotsWrap.appendChild(btn);
    }
  }

  function clampPosition() {
    const max = Math.max(0, slides.length - perView);
    position = Math.min(Math.max(position, 0), max);
  }

  function move() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = position * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    dotsWrap.querySelectorAll("button").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === Math.floor(position / perView));
    });
  }

  function next() {
    position += perView;
    clampPosition();
    move();
  }

  function prev() {
    position -= perView;
    clampPosition();
    move();
  }

  function onResize() {
    const newPerView = calcPerView();
    if (newPerView !== perView) {
      perView = newPerView;
      clampPosition();
      renderDots();
      move();
    } else {
      move();
    }
  }

  perView = calcPerView();
  renderDots();
  move();

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);
  window.addEventListener("resize", onResize);
});
