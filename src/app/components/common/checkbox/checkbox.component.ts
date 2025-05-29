import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, Validator {
  @Input() required = false;
  @Input() disabled = false;
  @Input() label?: string;
  @Input() indeterminate = false;
  @Input() shape: 'square' | 'circle' = 'square';
  @Input() checkmarkOnly = false;
  @Output() changed = new EventEmitter<boolean>();

  checked: boolean = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.indeterminate = false;
    this.onChange(this.checked);
    this.onTouched();
    this.changed.emit(this.checked);
  }

  writeValue(value: boolean): void {
    this.checked = value;
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

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !this.checked) {
      return { required: true };
    }
    return null;
  }
}
