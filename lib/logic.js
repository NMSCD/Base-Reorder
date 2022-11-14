let bases, newBases, buttonPress;

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
		const name = base.Name;
		if (base.BaseType.PersistentBaseTypes == 'FreighterBase') elements.unshift(buildImmovable('Freighterbase'));
		const element = buildElement(id, name);
		elements.push(element);
	}
	document.getElementById('bases').innerHTML = elements.join('');
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
	const tagName = name ? 'div' : 'span';

	const element = document.createElement(tagName);
	element.id = id;
	element.innerText = name;
	
	const output = element.outerHTML;
	return output;
}

function extraItem(inputElement) {
	const type = inputElement.value;
	if (inputElement.checked) {
		if (document.getElementById(type)) return;
		const element = buildImmovable(type);
		document.getElementById('bases').insertAdjacentHTML('afterbegin', element);
	} else {
		const element = document.querySelector(`#bases > #${type}`);
		if (!element) return;
		document.getElementById('bases').removeChild(element);
	}
}

function getDivOrder() {
	const divIds = new Array;
	const divs = Array.from(document.getElementById('bases').children);
	for (const div of divs) {
		if (parseInt(div.id).toString() == 'NaN') continue;
		divIds.push(parseInt(div.id));
	}
	return divIds;
}

function outputJSON() {
	const newArray = new Array;
	const divOrder = getDivOrder();
	for (let i = 0; i < bases.length; i++) {
		newArray[i] = bases[divOrder[i]];
	}
	newBases = newArray;
}

function copyButton(input) {
	if (buttonPress) return;
	const buttonText = input.innerHTML;
	buttonPress = true;
	try { outputJSON(); } catch (error) {
		input.classList.remove('is-primary');
		input.classList.add('is-danger');
		input.innerHTML = 'Failed!';
		setTimeout(() => {
			input.classList.remove('is-danger');	
			input.classList.add('is-primary');
			input.innerHTML = buttonText;
			buttonPress = false;
		}, 1500);
		console.error(error);
		return;
	}
	const copyTextContent = JSON.stringify(newBases);
	navigator.clipboard.writeText(copyTextContent);

	input.innerHTML = 'Copied!';
	setTimeout(() => {
		input.innerHTML = buttonText;
		buttonPress = false;
	}, 1500)
}