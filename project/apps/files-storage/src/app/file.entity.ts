import { Entity, File, IStorableEntity } from '@project/core';

export class FileEntity extends Entity implements IStorableEntity<File> {
  public format: string;
  public path: string;
  public uploadDirectoryPath: string;
  public name: string;
  public originalName: string;
  public size: number;
  public createdBy: string;
  public createdAt?: Date;
  constructor(file: File) {
    super();
    const {
      id,
      format,
      path,
      createdBy,
      createdAt,
      name,
      originalName,
      size,
      uploadDirectoryPath,
    } = file;
    this.id = id;
    this.format = format;
    this.path = path;
    this.uploadDirectoryPath = uploadDirectoryPath;
    this.name = name;
    this.originalName = originalName;
    this.size = size;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? new Date();
  }

  toPlainData(): File {
    return {
      id: this.id,
      format: this.format,
      path: this.path,
      uploadDirectoryPath: this.uploadDirectoryPath,
      name: this.name,
      originalName: this.originalName,
      size: this.size,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}
