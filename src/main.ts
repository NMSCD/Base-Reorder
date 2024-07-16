import 'bulma';
import './scss/style.scss';
import './evtListeners';
import { generateData } from './input';
import './output';

export const stateObj = {
  inputJson: '',
  outputJson: '',
};

generateData(document.getElementById('JSONinput') as HTMLTextAreaElement);
