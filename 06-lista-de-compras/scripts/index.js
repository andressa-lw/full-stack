const STORAGE_KEY = "shopping-list-items";

const form = document.querySelector("#shopping-form");
const input = document.querySelector("#item-input");
const list = document.querySelector("#shopping-list");
const alertBox = document.querySelector(".alert");

let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let alertTimeoutId = null;

renderList();
showAlert(false);

form.addEventListener("submit", function (event) {
	event.preventDefault();

	const name = input.value.trim();

	if (name === "") {
		return;
	}

	items.unshift({
		id: Date.now(),
		name: name,
		completed: false,
	});

	input.value = "";
	saveItems();
	renderList();
});

list.addEventListener("click", function (event) {
	const removeButton = event.target.closest(".item-remove");

	if (!removeButton) {
		return;
	}

	const itemId = Number(removeButton.closest("li").dataset.id);
	items = items.filter(function (item) {
		return item.id !== itemId;
	});

	saveItems();
	renderList();
	showAlert("O item foi removido da lista");
});

list.addEventListener("change", function (event) {
	if (event.target.type !== "checkbox") {
		return;
	}

	const itemId = Number(event.target.closest("li").dataset.id);
	const item = items.find(function (currentItem) {
		return currentItem.id === itemId;
	});

	if (item) {
		item.completed = event.target.checked;
		saveItems();
	}
});

function renderList() {
	list.innerHTML = "";

	items.forEach(function (item) {
		const li = document.createElement("li");
		li.className = "shopping-item";
		li.dataset.id = item.id;

		const label = document.createElement("label");
		label.className = "item-content";

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = item.completed;

		const span = document.createElement("span");
		span.textContent = item.name;

		const removeButton = document.createElement("button");
		removeButton.className = "item-remove";
		removeButton.type = "button";
		removeButton.setAttribute("aria-label", `Remover item ${item.name}`);

		const icon = document.createElement("img");
		icon.src = "assets/icon-delete.svg";
		icon.alt = "";
		icon.setAttribute("aria-hidden", "true");

		label.append(checkbox, span);
		removeButton.appendChild(icon);
		li.append(label, removeButton);
		list.appendChild(li);
	});
}

function saveItems() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function showAlert(message) {
	if (!alertBox) {
		return;
	}

	if (alertTimeoutId) {
		clearTimeout(alertTimeoutId);
		alertTimeoutId = null;
	}

	if (!message) {
		alertBox.hidden = true;
		alertBox.textContent = "";
		return;
	}

	alertBox.textContent = message;
	alertBox.hidden = false;

	alertTimeoutId = setTimeout(function () {
		alertBox.hidden = true;
		alertBox.textContent = "";
		alertTimeoutId = null;
	}, 3000);
}
