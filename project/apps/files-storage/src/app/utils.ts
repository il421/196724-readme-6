import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';

export const getFileName = (file: Express.Multer.File) =>
  `${randomUUID()}.${extension(file.mimetype)}`;

export const getServeFilePath = (args: {
  name: string;
  serveRoot: string;
  host?: string;
  port?: number;
}): string => `http://${args.host}:${args.port}${args.serveRoot}/${args.name}`;
