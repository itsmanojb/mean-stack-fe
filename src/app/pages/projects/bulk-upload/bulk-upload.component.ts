import { Component } from '@angular/core';
import { InvalidFile } from '@shared/interfaces/file.interface';
import { DropzoneComponent } from '@components/common/dropzone/dropzone.component';

@Component({
  selector: 'app-bulk-upload',
  imports: [DropzoneComponent],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss',
})
export class BulkUploadComponent {
  onValidFiles(files: File[]) {
    console.log('✅ Valid files:', files);
  }

  onInvalidFiles(invalid: InvalidFile[]) {
    for (const entry of invalid) {
      console.warn(`❌ Invalid file: ${entry.file.name}, reason: ${entry.reason}`);
    }
  }
}
