import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly id!: string;

  @ApiProperty({
    description: 'File format',
    example: 'png',
  })
  @Expose()
  readonly format!: string;

  @ApiProperty({
    description: 'File name',
    example: 'file.png',
  })
  @Expose()
  readonly name!: string;

  @ApiProperty({
    description: 'File path',
    example: 'http://localhost:3000/assets/file.png',
  })
  @Expose()
  readonly path!: string;

  @ApiProperty({
    description: 'Unique user identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly createdBy!: string;

  @ApiProperty({
    description: 'File uploading date',
    example: '2012-12-02',
  })
  @Expose()
  readonly createdAt!: string;
}
