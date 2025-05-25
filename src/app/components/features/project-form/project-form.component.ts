import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-project-form',
  imports: [],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent {
  @Input() name: string = '';
  @Output() submitted = new EventEmitter<string>();

  submit() {
    this.submitted.emit(this.name);
  }
}
