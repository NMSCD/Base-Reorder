let bases, newBases;

function getBases(JSONInput) {
	const JSONString = JSONInput.value;
	if (JSONString.includes('\\u')) {
		document.getElementById('unicodeWarn').style.display = 'block';
	} else {
		document.getElementById('unicodeWarn').style.display = '';
	}
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
	document.querySelectorAll('#checkboxes input').forEach(e => {
		extraItem(e);
	})
	const sortable = new Sortable(document.getElementById('bases'), {
		animation: 250,
		filter: '.immovable',
	});
}

function buildImmovable(name) {
	const immovable = `<div id="${name}" class="immovable">${name}</div>`;
	return immovable;
}

function buildElement(id, name) {
	function escapeHtml(unsafe) {
		return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
	}
	const tagName = name ? 'div' : 'span';
	const output = `<${tagName} id="${id}">${escapeHtml(name)}</${tagName}>`
	return output;
}

function extraItem(inputElement) {
	const type = inputElement.value;
	if (inputElement.checked) {
		const element = buildImmovable(type);
		document.getElementById('bases').insertAdjacentHTML('afterbegin', element);
	} else {
		const element = document.querySelector(`#bases > #${type}`);
		document.getElementById('bases').removeChild(element);
	}
}

function getDivOrder() {
	const divIds = new Array;
	const divs = Array.from(document.getElementById('bases').children);
	for (const div of divs) {
		if (div.id == 'Settlement' || div.id == 'Freighterbase') continue;
		divIds.push(parseInt(div.id));
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
	const buttonText = input.innerHTML;
	try { outputJSON(); } catch (error) {
		input.disabled = true;
		input.style.backgroundColor = 'red';
		input.style.color = 'white';
		input.innerHTML = 'Failed!';
		setTimeout(() => {
			input.style.backgroundColor = '';
			input.style.color = '';
			input.innerHTML = buttonText;
			input.disabled = false;
		}, 1500);
		console.error(error);
		return;
	}
	const copyTextContent = JSON.stringify(newBases);
	navigator.clipboard.writeText(copyTextContent)

	input.innerHTML = 'Copied!'
	setTimeout(() => {
		input.innerHTML = buttonText
	}, 1500)
}