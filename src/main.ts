import 'bulma';
import './scss/style.scss';
import './evtListeners';
import { generateData } from './input';
import './output';

export const stateObj = {
	inputJson: '',
	outputJson: ''
}

generateData(document.getElementById('JSONinput') as HTMLTextAreaElement);

// remove this when :has() works in Firefox
export function hideCopyBtn() {
	const copyBtn = document.getElementById('copy');
	const baseInput = document.getElementById('JSONinput') as HTMLTextAreaElement;

	copyBtn!.style.display = baseInput?.value ? '' : 'none';
}