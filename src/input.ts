import Sortable from 'sortablejs';
import { stateObj } from './main';

export function generateData(element: HTMLTextAreaElement): void {
  const jsonData = element.value;
  const isValid = validateJSON(jsonData);
  warn();
  if (!jsonData) return;

  if (!isValid) {
    warn('Invalid JSON, make sure you copied the whole PersistentPlayerBases section!');
    return;
  }

  buildBaseTiles(jsonData);
}

function buildBaseTiles(jsonData: string): void {
  const bases = JSON.parse(jsonData);
  const outputElement = document.getElementById('bases') as HTMLDivElement;
  outputElement.style.willChange = 'contents';

  const elements = [];
  for (let i = 0; i < bases.length; i++) {
    const base = bases[i];
    if (base.BaseType.PersistentBaseTypes === 'ExternalPlanetBase') continue;
    const name = base.Name;
    if (base.BaseType.PersistentBaseTypes === 'FreighterBase') elements.unshift(buildImmovable('Freighterbase'));
    const element = buildElement(i.toString(), name);
    elements.push(element);
  }
  outputElement.innerHTML = elements.join('');
  document.querySelectorAll('#checkboxes input').forEach((e) => buildExtraItem(e as HTMLInputElement));
  outputElement.style.willChange = '';
  new Sortable(outputElement, {
    animation: 250,
    filter: '.immovable',
    onChoose: function (evt) {
      evt.item.style.willChange = 'transform';
    },
    onEnd: function (evt) {
      evt.item.style.willChange = '';
    },
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
function validateJSON(jsonData: string): boolean {
  let result: boolean;
  try {
    JSON.parse(jsonData);
    result = true;
  } catch (error) {
    result = false;
  }

  stateObj.inputJson = result ? jsonData : '';
  return result;
}

function warn(message: string = ''): void {
  const warnElement = document.getElementById('warn');
  warnElement!.innerText = message;
}
