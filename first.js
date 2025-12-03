// Typing effect
const text = "Hi, I'm Shai Rishi";
const typingEl = document.getElementById("typing");
let i = 0;
function type() {
  if (i < text.length) {
    typingEl.textContent += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}
window.onload = type;

// Flip card controls
const flipBtn = document.getElementById("flipBtn");
const flipBack = document.getElementById("flipBack");
const flipCard = document.getElementById("flipCard");

flipBtn.addEventListener("click", () => flipCard.classList.add("flipped"));
flipBack.addEventListener("click", () => flipCard.classList.remove("flipped"));

// Animate skill bars when in view
window.addEventListener("scroll", () => {
  const bars = document.querySelectorAll(".bar span");
  const skills = document.querySelector(".skills");
  if (!skills) return;
  const top = skills.getBoundingClientRect().top;
  if (top < window.innerHeight - 100) {
    bars.forEach((bar) => {
      const width = bar.getAttribute("data-percent");
      bar.style.width = width + "%";
    });
  }
});

// Navbar color change on scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});



// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
llYear();


