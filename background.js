const body = document.querySelector("body");

const images = ["01.jpg", "02.jpg", "03.webp"];

const todaysImage = images[Math.floor(Math.random() * images.length)];

function changeMainBackgroundImg() {
	body.style.background = `center/cover no-repeat url(/wetube-reloaded-2024/img/${todaysImage})`;
}

changeMainBackgroundImg();
