import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() maxLength: number = 10000;
  @Input() minLength: number = 0;
  @Input() required = false;
  @Input() disabled = false;
  @Input() showCounter = true;
  @Input() showErrors = true;

  @Output() inputChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string | null>();

  value = '';
  validationError: string | null = null;

  private formControl?: AbstractControl;
  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngAfterViewInit(): void {
    this.resize();
  }

  onInput(event: Event): void {
    const textarea = this.textareaRef.nativeElement;
    this.value = textarea.value;
    this.resize();
    this.onChange(this.value);
    this.inputChange.emit(this.value);
    this.validateAndEmitError();
  }

  resize(): void {
    const textarea = this.textareaRef.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  writeValue(value: any): void {
    this.value = value || '';
    if (this.textareaRef) {
      this.textareaRef.nativeElement.value = this.value;
      this.resize();
      this.validateAndEmitError();
    }
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
    // Store reference so we can use it for status checking
    this.formControl = control;

    const value = control.value ?? '';
    let error: string | null = null;

    if (this.required && !value.trim()) {
      error = 'This field is required.';
    } else if (this.minLength && value.length < this.minLength) {
      error = `Minimum ${this.minLength} characters required.`;
    } else if (this.maxLength && value.length > this.maxLength) {
      error = `Maximum ${this.maxLength} characters allowed.`;
    }

    const shouldShowError = control.touched || control.dirty;
    this.validationError = shouldShowError ? error : null;

    this.errorChange.emit(this.validationError);
    return error ? { validationError: error } : null;
  }

  private validateAndEmitError(): void {
    if (this.formControl) {
      this.validate(this.formControl);
    }
  }
}
