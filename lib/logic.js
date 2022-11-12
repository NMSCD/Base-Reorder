//Array.prototype.move = function (from, to) {
//	this.splice(to, 0, this.splice(from, 1)[0]);
//};
let bases, newBases;

function getBases(JSONInput) {
	const JSONString = JSONInput.value;
	if (!JSONString) return;
	bases = JSON.parse(JSONString)

	const elements = new Array;
	for (let i = 0; i < bases.length; i++) {
		const base = bases[i];
		const id = i;
		const name = base.Name ? base.Name : '';
		const element = buildElement(id, name);
		elements.push(element);
	}
	document.getElementById("bases").innerHTML = elements.join('');
	eventListeners();
	outputJSON();
}

function buildElement(id, name) {
	const output = `<div id="${id}" class="draggable" draggable="true">${name}</div>`
	return output;
}

function eventListeners() {
	const draggables = document.getElementsByClassName('draggable');
	const container = document.querySelector('.bases');

	for (const draggable of draggables) {
		draggable.addEventListener('dragstart', () => {
			draggable.classList.add('dragging');
		})

		draggable.addEventListener('dragend', () => {
			draggable.classList.remove('dragging');
		})
	}
	container.addEventListener('dragover', e => {
		e.preventDefault();
		const afterElement = getDragAfterElement(container, e.clientY);
		const draggable = document.querySelector('.dragging');
		if (!afterElement) {
			container.appendChild(draggable);
		} else {
			container.insertBefore(draggable, afterElement)
		}
		outputJSON();
	})
}

function getDragAfterElement(container, y) {
	const draggableElements = Array.from(container.querySelectorAll('.draggable:not(.dragging)'));

	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect();
		const offset = y - box.top - box.height / 2;
		if (offset < 0 && offset > closest.offset) {
			return { offset: offset, element: child }
		} else {
			return closest;
		}
	}, { offset: Number.NEGATIVE_INFINITY }).element;
}

function getDivOrder() {
	const divIds = new Array;
	const divs = Array.from(document.getElementById('bases').children);
	for (const div of divs) {
		divIds.push(parseInt(div.id))
	}
	return divIds;
}


function outputJSON() {
	const newArray = new Array;
	const divOrder = getDivOrder();
	for (let i = 0; i < bases.length; i++) {
		newArray[i] = bases[divOrder[i]]
		const name = newArray[i].Name ? newArray[i].Name : newArray[i].BaseType.PersistentBaseTypes;
		console.log(name)
	}
	newBases = newArray;
}

function copyButton(input) {
	const copyTextContent = JSON.stringify(newBases);
	const buttonText = input.innerHTML;
	navigator.clipboard.writeText(copyTextContent)

	input.innerHTML = 'Copied!'
	setTimeout(() => {
		input.innerHTML = buttonText
	}, 1500)
}