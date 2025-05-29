import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { RadioComponent } from './radio/radio.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-group',
  imports: [RadioComponent],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() selectedValue: any;
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() checkmarkOnly = false;
  @Input() checkmarkOnlyMode = false;
  @Input() disabled = false;
  @Input() valueKey: string = '';
  @Input() labelKey: string = '';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
  @Input() disabledKey: string = '';
  @Output() selectedValueChange = new EventEmitter<any>();

  onChange = (_: any) => {};
  onTouched = () => {};

  getValue(option: any): any {
    return this.valueKey ? option[this.valueKey] : option;
  }

  getLabel(option: any): string {
    return this.labelKey ? option[this.labelKey] : String(option);
  }

  onValueChange(value: any) {
    this.selectedValue = value;
    this.selectedValueChange.emit(value);
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  isOptionDisabled(opt: any): boolean {
    return this.disabledKey ? !!opt[this.disabledKey] : false;
  }
}
