import { buildExtraItem, generateData } from "./input";
import { copyData } from "./output";

document.getElementById('copy')?.addEventListener('click', function () { copyData(this as unknown as HTMLButtonElement) });
document.getElementById('JSONinput')?.addEventListener('input', function () { generateData(this as unknown as HTMLTextAreaElement) });
document.getElementById('settlementCheckbox')?.addEventListener('change', function () { buildExtraItem(this as unknown as HTMLInputElement) });