export interface InvalidFile {
  file: File;
  reason: 'type' | 'size';
}
