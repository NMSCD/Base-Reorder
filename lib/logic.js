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
	//	eventListeners();
	new Sortable(document.getElementById('bases'), {
		animation: 250,
	});
}

function buildElement(id, name) {
	const output = `<div id="${id}" class="draggable">${name}</div>`
	return output;
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
	}
	newBases = newArray;
}

function copyButton(input) {
	outputJSON();
	const copyTextContent = JSON.stringify(newBases);
	const buttonText = input.innerHTML;
	navigator.clipboard.writeText(copyTextContent)

	input.innerHTML = 'Copied!'
	setTimeout(() => {
		input.innerHTML = buttonText
	}, 1500)
}