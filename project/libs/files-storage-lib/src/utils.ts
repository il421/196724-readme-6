import { Request } from 'express';
import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';

const getFileName = (file: Express.Multer.File) =>
  `${randomUUID()}.${extension(file.mimetype)}`;
export const filename = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  callback(null, getFileName(file));
};

export const path = (fileName: string, host?: string, port?: number): string =>
  `http://${host}:${port}/${fileName}`;
