const countdownElement = document.getElementById("countdown");
const messageElement = document.getElementById("message");
const header2025Element = document.getElementById("header-2025");
const headerh2Element = document.getElementById("header-h2");
const audio = document.getElementById("newYearAudio");
const bgVideo = document.getElementById("bg-video");
const bgVideoSource = document.getElementById("bg-video-source");
const Year2025 = document.getElementById("Year");

let countdownFinished = false;
let fireworksEndTime;
let fireworksStartTime; // Declare fireworksStartTime

function updateCountdown() {
  const now = new Date();
  const newYear = new Date("December 31, 2025 08:56:59").getTime();
  const timeLeft = newYear - now.getTime();

  if (timeLeft <= 0 && !countdownFinished) {
    countdownFinished = true;
    fireworksStartTime = now.getTime(); // Initialize fireworksStartTime
    countdownElement.style.display = "none";
    header2025Element.style.display = "none";
    headerh2Element.style.display = "none";
    messageElement.innerHTML = "Happy New Year";
    Year2025.innerHTML = "Welcome 2025!";
    changeBackgroundVideo("backgroundVideo/bg2/bg-FireWorks.mp4");
    fireworksEndTime = now.getTime() + 60 * 60 * 1000; // Set end time to 1 hour from now

    audio.muted = false;
    audio
      .play()
      .catch((error) => console.error("Audio playback failed:", error));

    if (now.getHours() < 1) {
      launchConfetti();
    }
    setTimeout(switchToRegularBackground, 60 * 60 * 1000);
  } else if (countdownFinished) {
    const fireworksDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    const fireworksTimeElapsed = now.getTime() - fireworksStartTime;

    if (fireworksTimeElapsed >= fireworksDuration) {
      updateBackgroundVideo();
    }
  } else if (timeLeft > 0) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (fireworksEndTime && Date.now() >= fireworksEndTime) {
    switchToRegularBackground();
  }
}

function switchToRegularBackground() {
  fireworksEndTime = null; // Reset fireworks end time
  updateBackgroundVideo(); // This will set the correct background based on time of day
}

function changeBackgroundVideo(newSource) {
  bgVideoSource.src = newSource;
  bgVideo.load();

  bgVideo.oncanplay = function () {
    bgVideo
      .play()
      .catch((error) => console.error("Video playback failed:", error));
  };

  bgVideo.onended = function () {
    bgVideo.currentTime = 0;
    bgVideo.play().catch((error) => console.error("Video loop failed:", error));
  };

  bgVideo.onerror = function () {
    console.error("Error loading video:", bgVideo.error);
  };
}

function updateBackgroundVideo() {
  const now = new Date();
  const hours = now.getHours();

  if (fireworksEndTime && now.getTime() < fireworksEndTime) {
    // If we're still within the fireworks period, don't change the video
    return;
  }

  console.log("Current hour:", hours); // Keep this for debugging

  if (hours >= 6 && hours < 18) {
    changeBackgroundVideo("backgroundVideo/bg3/bg-morning.mp4");
  } else {
    changeBackgroundVideo("backgroundVideo/bg1/bg-noFireWorks.mp4");
  }
}

function launchConfetti() {
  const duration = 60 * 60 * 1000; // 1 hour
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

function clickConfetti(event) {
  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
  });
  const fireworksAudio = new Audio("BackgroundAudio/fireworks.mp3");
  fireworksAudio
    .play()
    .catch((error) => console.error("Fireworks audio playback failed:", error));
}

// Add event listener to launch confetti on click
document.body.addEventListener("click", clickConfetti);

// Attempt to play the audio in a muted state
audio.muted = true;
audio
  .play()
  .catch((error) =>
    console.error("Initial muted audio playback failed:", error)
  );

// Update the countdown every second
setInterval(updateCountdown, 1000);
// Update the background video every minute
setInterval(updateBackgroundVideo, 60000); // Check every minute
updateCountdown(); // Initial call to avoid delay
updateBackgroundVideo(); // Initial call to set the correct background video
