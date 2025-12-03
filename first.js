const flipCard = document.getElementById("flipCard");
const flipBtn = document.getElementById("flipBtn");
const flipBack = document.getElementById("flipBack");


flipBtn.addEventListener("click", () => {
flipCard.classList.add("flipped");
});


flipBack.addEventListener("click", () => {
flipCard.classList.remove("flipped");
});


/* ====== TYPING EFFECT ====== */
const typingText = "Hi, I'm Shai Rishi";
let index = 0;
function typeEffect() {
if (index < typingText.length) {
document.getElementById("typing").innerText += typingText.charAt(index);
index++;
setTimeout(typeEffect, 90);
}
}
typeEffect();


/* ====== SKILL BAR ANIMATION ====== */
const skillBars = document.querySelectorAll('.bar span');
function animateSkills() {
skillBars.forEach(bar => {
const percent = bar.getAttribute('data-percent');
bar.style.width = percent + '%';
});
}


window.addEventListener('scroll', () => {
const skillsSection = document.getElementById('skills');
const rect = skillsSection.getBoundingClientRect();
if (rect.top < window.innerHeight - 100) animateSkills();
});


/* ====== SCROLL SMOOTH NAVIGATION ====== */
document.querySelectorAll('nav a').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
});
});


/* ====== AUTO YEAR IN FOOTER ====== */
document.getElementById("year").innerText = new Date().getFullYear();



