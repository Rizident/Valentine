// Счётчики масштаба кнопок
let yesScale = 1;
let noScale = 1;

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const resetBtn = document.getElementById("reset");
const victorySound = document.getElementById("victorySound");

// Функция случайного перемещения кнопки NO
function moveNoButton() {
  const padding = 10; // минимальный отступ от краёв
  const scale = noScale || 1; // текущий масштаб кнопки

  // размеры кнопки с учётом масштаба
  const btnWidth = noBtn.offsetWidth * scale;
  const btnHeight = noBtn.offsetHeight * scale;

  // максимально допустимые координаты, чтобы кнопка не выходила за экран
  const maxX = window.innerWidth - btnWidth - padding;
  const maxY = window.innerHeight - btnHeight - padding;

  // случайная позиция в пределах экрана
  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + padding;

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}


// Desktop — при наведении мыши
noBtn.addEventListener("mouseenter", moveNoButton);

// Mobile — при касании
noBtn.addEventListener("touchstart", moveNoButton);

// Обработчик клика по кнопке NO
noBtn.onclick = async () => {
  try {
    const res = await fetch("/click/no", { method: "POST" });
    const data = await res.json();

    // масштабируем кнопки
    yesScale += 0.15;
    noScale -= 0.15;
    noScale = Math.max(noScale, 0.1);

    yesBtn.style.transform = `scale(${yesScale})`;
    noBtn.style.transform = `scale(${noScale})`;

    console.log("Counters:", data.data);
  } catch (err) {
    console.error("Error NO:", err);
  }
};

// Обработчик клика по кнопке YES
yesBtn.onclick = () => {
  fetch("/click/yes", { method: "POST" })
    .then(res => res.json())
    .then(data => console.log("Yes clicked:", data.data))
    .catch(err => console.error("Error YES:", err));

  victorySound.play();
  window.location.href = "victory.html"; // переход на Victory Page
};

// Reset счётчиков
resetBtn.onclick = async () => {
  try {
    await fetch("/reset", { method: "POST" });
    yesScale = 1;
    noScale = 1;
    yesBtn.style.transform = `scale(${yesScale})`;
    noBtn.style.transform = `scale(${noScale})`;
    console.log("Counters reset!");
  } catch (err) {
    console.error("Error reset:", err);
  }
};
