const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteIcon = document.querySelectorAll(".delete__icon");

const addComment = (text, id, userName) => {
	const videoComments = document.querySelector(".video__comments ul");
	const newComment = document.createElement("li");

	newComment.dataset.id = id;

	const username = document.createElement("span");
	const comment = document.createElement("span");
	const deleteIcon = document.createElement("span");

	username.className = "comment__owner";
	newComment.appendChild(username);
	username.innerText = `${userName}`;

	newComment.className = "video__comment";
	newComment.appendChild(comment);
	comment.innerText = `${text}`;

	deleteIcon.className = "delete__icon";
	newComment.appendChild(deleteIcon);
	deleteIcon.innerText = "❌";

	videoComments.prepend(newComment);

	console.log(newComment);

	deleteIcon.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
	event.preventDefault();
	const textarea = form.querySelector("textarea");
	const videoId = videoContainer.dataset.id;
	const userName = form.dataset.name;
	const text = textarea.value;
	if (text === "") {
		return;
	}
	const response = await fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});
	if (response.status === 201) {
		textarea.value = "";
		const { newCommentId } = await response.json();
		addComment(text, newCommentId, userName);
	}
};

const handleDelete = async (event) => {
	const deleteComment = event.target.parentElement;

	const {
		dataset: { id },
	} = event.target.parentElement;
	const videoId = videoContainer.dataset.id;
	const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ commentId: id }),
	});

	if (response.status === 200) {
		deleteComment.remove();
	}
};

if (form) {
	form.addEventListener("submit", handleSubmit);
}

if (deleteIcon) {
	deleteIcon.forEach((icon) => icon.addEventListener("click", handleDelete));
}
