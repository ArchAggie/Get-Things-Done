/** @format */

// GLOBAL VARIABLES
// --Element Selectors
const newTaskBtn = document.querySelector('button[name="new-task');
const popupOverlay = document.querySelector(".popup-overlay");
const editPopupOverlay = document.querySelector(".edit-popup-overlay");
const addForm = document.querySelector(".add-task-form");
const editForm = document.querySelector(".edit-task-form");
const editCloseBox = document.querySelector(".edit-close-box");
const addCloseBox = document.querySelector(".add-close-box");
const taskItemContainer = document.querySelector(".task-item-container");

// ID for the task CURRENTLY being edited
let taskUpdateId = 9999999;

// Local Host URL for JSON Server
const URL = "http://localhost:3000/tasks";

// Once DOM is fully loaded, event listeners are added for all buttons
document.addEventListener("DOMContentLoaded", () => {
	// Handles logic for opening/closing task overlay
	editCloseBox.addEventListener("click", () => {
		editPopupOverlay.classList.toggle("show");
	});
	addCloseBox.addEventListener("click", () => {
		popupOverlay.classList.toggle("show");
	});
	newTaskBtn.addEventListener("click", () => {
		popupOverlay.classList.toggle("show");
	});
	// Once you submit form, it grabs data from the input, creates task from values, and calls the <addNewTask()> function
	addForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const title = document.getElementById("task-title");
		const description = document.getElementById("task-description");
		const selectedPriority = addForm.querySelector(
			'input[name="option"]:checked'
		);
		const task = {
			title: title.value,
			description: description.value,
			currentPriority: selectedPriority.value,
			previousPriority: "low",
		};
		addNewTask(task);
		popupOverlay.classList.toggle("show");
	});
	// Same as <addForm>, but it grabs data from the input while also taking in the CURRENT task ID to know which task to edit
	editForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const title = document.getElementById("edit-task-title");
		const description = document.getElementById("edit-task-description");
		const selectedPriority = editForm.querySelector(
			'input[name="task-option"]:checked'
		);

		const task = {
			title: title.value,
			description: description.value,
			currentPriority: selectedPriority.value,
		};

		editTask(task, taskUpdateId);
		editPopupOverlay.classList.toggle("show");
	});
});

// Colors each task card depending on the task's priority, creates the HTML Markup for each "task card", and inserts the values for each task (titles, descriptions, priorities)
function renderTask(task) {
	const taskContainer = document.querySelector(".task-item-container");
	const taskCard = document.createElement("li");
	taskCard.className = "task-card";
	switch (task.currentPriority) {
		case "low":
			taskCard.classList.add("blue");
			break;
		case "medium":
			taskCard.classList.add("yellow");
			break;
		case "high":
			taskCard.classList.add("red");
			break;
		case "complete":
			taskCard.classList.add("complete");
			break;
		default:
			taskCard.classList.add("purple");
	}

	const taskWrapper = document.createElement("div");
	taskWrapper.className = "task-wrapper";

	const taskInformation = document.createElement("div");
	taskInformation.className = "task-information";

	const taskHeader = document.createElement("div");
	taskHeader.className = "task-header";

	const checkboxButton = document.createElement("button");
	checkboxButton.className = "icon-button";
	checkboxButton.id = "checkbox-button";
	checkboxButton.addEventListener("click", (e) => {
		completeTask(task.id, task.previousPriority, task.currentPriority);
	});

	const checkboxImage = document.createElement("img");
	checkboxImage.className = "checkbox-image";
	if (task.currentPriority == "complete") {
		checkboxImage.src = "content/completed.png";
	} else {
		checkboxImage.src = "content/uncheckedBox.png";
	}

	const title = document.createElement("span");
	title.className = "title";
	title.innerText = task.title;

	const editContainer = document.createElement("div");
	editContainer.className = "edit-container";

	const editButton = document.createElement("button");
	editButton.className = "icon-button";
	editButton.id = "edit-button";
	const editTitleInput = document.getElementById("edit-task-title");
	const editDescriptionInput = document.getElementById(
		"edit-task-description"
	);
	const lowPriorityButton = document.querySelector(
		'input[name="task-option"][value="low"]'
	);
	const mediumPriorityButton = document.querySelector(
		'input[name="task-option"][value="medium"]'
	);
	const highPriorityButton = document.querySelector(
		'input[name="task-option"][value="high"]'
	);
	const completePriorityButton = document.querySelector(
		'input[name="task-option"][value="complete"]'
	);
	editButton.addEventListener("click", () => {
		editPopupOverlay.classList.toggle("show");
		taskUpdateId = task.id;
		editTitleInput.value = task.title;
		editDescriptionInput.value = task.description;
		switch (task.currentPriority) {
			case "low":
				lowPriorityButton.checked = true;
				break;
			case "medium":
				mediumPriorityButton.checked = true;
				break;
			case "high":
				highPriorityButton.checked = true;
				break;
			case "complete":
				completePriorityButton.checked = true;
				break;
			default:
				lowPriorityButton.checked = true;
		}
	});

	// Confirmation before deleting the selected task
	const deleteButton = document.createElement("button");
	deleteButton.className = "icon-button";
	deleteButton.id = "delete-button";
	deleteButton.onclick = () => {
		const result = confirm(
			"Are you sure you wish to delete this task from the list?"
		);
		if (result) {
			deleteTask(task.id);
		}
	};

	const editButtonImage = document.createElement("img");
	editButtonImage.src = "content/editBtn.png";
	editButtonImage.alt = "Edit";
	editButtonImage.id = "edit-button-img";

	const deleteButtonImage = document.createElement("img");
	deleteButtonImage.src = "content/deleteBtn.png";
	deleteButtonImage.alt = "Delete";
	deleteButtonImage.id = "delete-button-img";

	const taskDescription = document.createElement("div");
	taskDescription.className = "task-description";

	const description = document.createElement("span");
	description.className = "description";
	description.innerText = task.description;

	taskContainer.append(taskCard);
	taskCard.append(taskWrapper);
	taskWrapper.append(taskInformation);
	taskInformation.append(taskHeader, taskDescription);
	taskHeader.append(checkboxButton, title, editContainer);
	checkboxButton.append(checkboxImage);
	// removed priorityButton for now -->
	editContainer.append(editButton, deleteButton);
	//   priorityButton.append(priorityButtonImage);
	editButton.append(editButtonImage);
	deleteButton.append(deleteButtonImage);
	taskDescription.append(description);
}

// Performs the GET request to retrieve all tasks and then renders each one
// --Tasks are sorted by priority before rendering
function getTasks() {
	fetch(URL)
		.then((response) => response.json())
		.then((tasks) => {
			tasks.sort((a, b) => {
				const priorities = ["high", "medium", "low", "complete"];
				return (
					priorities.indexOf(a.currentPriority) -
					priorities.indexOf(b.currentPriority)
				);
			});
			tasks.forEach((task) => renderTask(task));
		});
}

// Performs the POST request to create a new task and add it to the list
function addNewTask(task) {
	let postOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(task),
	};
	fetch(URL, postOptions).then((response) => {
		refreshTasks();
	});
}

// Performs the PATCH request to retrieve task entry and update it
function editTask(task, taskId) {
	let patchOptions = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(task),
	};
	fetch(URL + "/" + taskId, patchOptions).then((response) => {
		refreshTasks();
	});
}

// Performs the DELETE request to remove the selected task from the list
function deleteTask(taskId) {
	let deleteOptions = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	};
	fetch(URL + "/" + taskId, deleteOptions).then((response) => {
		refreshTasks();
	});
}

// Logic for setting a task as "complete"
function completeTask(taskId, previous, current) {
	if (current !== "complete") {
		let patchOptions = {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify({
				currentPriority: "complete",
				previousPriority: current,
			}),
		};
		fetch(URL + "/" + taskId, patchOptions).then((response) => {
			refreshTasks();
		});
	} else {
		let patchOptions = {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify({
				currentPriority: previous,
				previousPriority: "complete",
			}),
		};
		fetch(URL + "/" + taskId, patchOptions).then((response) => {
			refreshTasks();
		});
	}
}
function refreshTasks() {
	while (taskItemContainer.firstChild) {
		taskItemContainer.removeChild(taskItemContainer.firstChild);
	}
	getTasks();
}

// Render all tasks
getTasks();
