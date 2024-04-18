import { Entity, File, IStorableEntity } from '@project/core';

export class FileEntity extends Entity implements IStorableEntity<File> {
  public format: string;
  public path: string;
  public name: string;
  public createdBy: string;
  public createdAt?: Date;
  constructor(file: File) {
    super();
    const { id, format, path, createdBy, createdAt, name } = file;
    this.id = id;
    this.format = format;
    this.path = path;
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? new Date();
  }

  toPlainData(): File {
    return {
      id: this.id,
      format: this.format,
      path: this.path,
      name: this.name,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}
