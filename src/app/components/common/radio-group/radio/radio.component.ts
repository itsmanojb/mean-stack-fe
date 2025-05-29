import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

let uniqueId = 0;
@Component({
  selector: 'app-radio',
  imports: [NgIf],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
})
export class RadioComponent {
  @Input() value!: any;
  @Input() selectedValue: any;
  @Input() label: string = '';
  @Input() disabled = false;
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() checkmarkOnly = false;
  @Input() checkmarkOnlyMode = false;
  @Input() id: string = `radio-${++uniqueId}`;
  @Output() valueChange = new EventEmitter<any>();

  get isChecked(): boolean {
    return this.value === this.selectedValue;
  }

  onSelect() {
    if (!this.disabled && !this.isChecked) {
      this.valueChange.emit(this.value);
    }
  }
}
