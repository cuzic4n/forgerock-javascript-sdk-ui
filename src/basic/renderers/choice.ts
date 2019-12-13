import { ChoiceCallback } from '@forgerock/javascript-sdk';
import { el } from '../../util/dom';
import {
  CallbackRenderer,
  DestroyableCallbackRenderer,
  FocusableCallbackRenderer,
} from '../interfaces';

/**
 * Renders a dropdown of choices.
 */
class ChoiceCallbackRenderer implements DestroyableCallbackRenderer, FocusableCallbackRenderer {
  private input!: HTMLSelectElement;

  /**
   * @param callback The callback to render
   * @param index The index position in the step's callback array
   * @param onChange A function to call when the callback value is changed
   */
  constructor(
    private callback: ChoiceCallback,
    private index: number,
    private onChange: (renderer: CallbackRenderer) => void,
  ) {}

  /**
   * Removes event listeners.
   */
  public destroy = () => this.input.removeEventListener('change', this.onInput);

  /**
   * Sets the focus on the dropdown.
   */
  public focus = () => this.input.focus();

  /**
   * Returns true if the dropdown has a value selected.
   */
  public isValid = () => this.input && this.input.value.length > 0;

  /**
   * Creates all required DOM elements and returns the containing element.
   */
  public render = () => {
    const defaultIndex = this.callback.getInputValue() as number;
    const formGroup = el<HTMLDivElement>('div', `fr-callback-${this.index} form-group`);
    const id = `fr-callback-${this.index}`;

    // Add the prompt
    const prompt = this.callback.getPrompt();
    if (prompt) {
      const label = el<HTMLLabelElement>('label');
      label.innerHTML = prompt;
      label.htmlFor = id;
      formGroup.appendChild(label);
    }

    // Add the dropdown
    this.input = el<HTMLSelectElement>('select', 'form-control');
    this.input.id = id;
    this.input.addEventListener('change', this.onInput);
    this.callback.getChoices().forEach((x, i) => {
      const option = el<HTMLOptionElement>('option');
      option.value = i.toString();
      option.text = x;
      option.selected = i === defaultIndex;
      this.input.appendChild(option);
    });
    formGroup.appendChild(this.input);

    return formGroup;
  };

  private onInput = () => {
    this.callback.setChoiceIndex(Number(this.input.value));
    this.onChange(this);
  };
}

export default ChoiceCallbackRenderer;
