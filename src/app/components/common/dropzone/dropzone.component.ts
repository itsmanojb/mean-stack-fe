import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { InvalidFile } from '@shared/interfaces/file.interface';

@Component({
  selector: 'app-dropzone',
  imports: [],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropzoneComponent {
  @Input() placeholder = 'Upload Files';
  @Input() multiple = false;
  @Input() accept: string[] | null = null; // MIME types
  @Input() maxSizeMB: number | null = null;

  @Output() filesDropped = new EventEmitter<File[]>();
  @Output() invalidFiles = new EventEmitter<InvalidFile[]>();

  dragOverSignal = signal(false);
  invalidDropSignal = signal(false);
  private errorTimeout: any;

  get hasCustomContent(): boolean {
    // Check if <ng-content> has children (optional enhancement)
    return false;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOverSignal.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOverSignal.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOverSignal.set(false);
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
      input.value = '';
    }
  }

  private handleFiles(fileList: FileList) {
    const valid: File[] = [];
    const invalid: InvalidFile[] = [];

    for (const file of Array.from(fileList)) {
      const isValidType = !this.accept || this.accept.includes(file.type);
      const isValidSize = !this.maxSizeMB || file.size <= this.maxSizeMB * 1024 * 1024;

      if (isValidType && isValidSize) {
        valid.push(file);
      } else {
        invalid.push({ file, reason: !isValidType ? 'type' : 'size' });
      }
    }

    if (valid.length) this.filesDropped.emit(valid);
    if (invalid.length) {
      this.invalidFiles.emit(invalid);
      this.triggerInvalidHighlight();
    }
  }

  private triggerInvalidHighlight() {
    this.invalidDropSignal.set(true);
    clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.invalidDropSignal.set(false);
    }, 2000); // Reset after 2s
  }
}
