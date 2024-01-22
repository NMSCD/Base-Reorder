import { stateObj } from './main';

export function copyData(input: HTMLButtonElement) {
  const buttonText = input.innerHTML;
  input.style.pointerEvents = 'none';
  try {
    outputJSON();
  } catch (error) {
    input.classList.remove('is-primary');
    input.classList.add('is-danger');
    input.innerHTML = 'Failed!';
    setTimeout(() => {
      input.classList.remove('is-danger');
      input.classList.add('is-primary');
      input.innerHTML = buttonText;
      input.style.pointerEvents = '';
    }, 1500); // NoSonar wait 1.5s before switching the button back to normal
    console.error(error);
    return;
  }
  navigator.clipboard.writeText(stateObj.outputJson);

  input.innerHTML = 'Copied!';
  setTimeout(() => {
    input.innerHTML = buttonText;
    input.style.pointerEvents = '';
  }, 1500); // NoSonar wait 1.5s before switching the button back to normal
}

function getDivOrder() {
  const divIds = [];
  const divs = Array.from((document.getElementById('bases') as HTMLDivElement).children);
  for (const div of divs) {
    const idNr = parseInt(div.id);
    if (isNaN(idNr)) continue;
    divIds.push(idNr);
  }
  return divIds;
}

function outputJSON() {
  const newArray = [];
  const divOrder = getDivOrder();
  const bases = JSON.parse(stateObj.inputJson);
  for (let i = 0; i < bases.length; i++) {
    newArray[i] = bases[divOrder[i]];
  }
  stateObj.outputJson = JSON.stringify(newArray, null, '\t'); // NoSonar this applies formatting and uses one tab as indent character
}
