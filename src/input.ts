import Sortable from 'sortablejs';
import { hideCopyBtn, stateObj } from './main';

export function generateData(element: HTMLTextAreaElement): void {
	const jsonData = getJSON(element);
	hideCopyBtn();
	if (!jsonData) return;
	buildBaseTiles(jsonData);
}

function getJSON(element: HTMLTextAreaElement) {
	const JSONString = element.value;
	const returnValue = JSONString ? JSONString : ''
	stateObj.inputJson = returnValue;
	return returnValue;
}

function buildBaseTiles(jsonData: string): void {
	const bases = JSON.parse(jsonData);
	const outputElement = document.getElementById('bases') as HTMLDivElement;
	outputElement.style.willChange = 'contents';

	const elements = [];
	for (let i = 0; i < bases.length; i++) {
		const base = bases[i];
		const name = base.Name;
		if (base.BaseType.PersistentBaseTypes == 'FreighterBase') elements.unshift(buildImmovable('Freighterbase'));
		const element = buildElement(i.toString(), name);
		elements.push(element);
	}
	outputElement.innerHTML = elements.join('');
	document.querySelectorAll('#checkboxes input').forEach(e => buildExtraItem(e as HTMLInputElement))
	outputElement.style.willChange = '';
	new Sortable(outputElement, {		// NoSonar this is ok
		animation: 250,
		filter: '.immovable',
		onChoose: function (evt) { evt.item.style.willChange = 'transform' },
		onEnd: function (evt) { evt.item.style.willChange = '' },
	});
}

function buildImmovable(name: string): string {
	const immovable = document.createElement('div');
	immovable.id = name;
	immovable.innerText = name;
	immovable.classList.add('immovable');
	return immovable.outerHTML;
}

function buildElement(id: string, name: string): string {
	const tagName = name ? 'div' : 'span';

	const element = document.createElement(tagName);
	element.id = id;
	element.innerText = name;

	const output = element.outerHTML;
	return output;
}

export function buildExtraItem(inputElement: HTMLInputElement) {
	const type = inputElement.value;
	if (inputElement.checked) {
		if (document.getElementById(type)) return;
		const element = buildImmovable(type);
		(document.getElementById('bases') as HTMLDivElement).insertAdjacentHTML('afterbegin', element);
	} else {
		const element = document.querySelector(`#bases > #${type}`);
		if (!element) return;
		(document.getElementById('bases') as HTMLDivElement).removeChild(element);
	}
}
