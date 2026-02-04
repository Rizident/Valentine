let yesScale = 1;
let noScale = 1;

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const resetBtn = document.getElementById("reset");
const victorySound = document.getElementById("victorySound");

// функция случайного перемещения кнопки NO
function moveNoButton() {
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// Desktop
noBtn.addEventListener("mouseenter", moveNoButton);
// Mobile
noBtn.addEventListener("touchstart", moveNoButton);

// NO button logic
noBtn.onclick = async () => {
  try {
    const res = await fetch("/click/no", { method: "POST" });
    const data = await res.json();

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

// YES button logic
yesBtn.onclick = () => {
  window.location.href = "victory.html";
  fetch("/click/yes", { method: "POST" })
    .then(res => res.json())
    .then(data => console.log("Yes clicked:", data.data))
    .catch(err => console.error("Error YES:", err));
  victorySound.play();
};

// Reset button logic
resetBtn.onclick = async () => {
  await fetch("/reset", { method: "POST" });
  yesScale = 1;
  noScale = 1;
  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;
};
