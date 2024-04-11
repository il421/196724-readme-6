import { Entity, File, IStorableEntity } from '@project/core';

export class FileEntity extends Entity implements IStorableEntity<File> {
  public format: string;
  public path: string;
  public createdBy?: string;
  public createdAt?: string;
  constructor(file: File) {
    const { id, format, path, createdBy, createdAt } = file;
    super();
    this.id = id;
    this.format = format;
    this.path = path;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  toPlainData(): File {
    return {
      id: this.id,
      format: this.format,
      path: this.path,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}
