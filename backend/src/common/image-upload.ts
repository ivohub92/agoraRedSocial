import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { memoryStorage } from 'multer';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');

/**
 * La imagen se mantiene en memoria y solo se escribe a disco cuando el resto
 * de los datos ya fueron validados (así no quedan archivos huérfanos).
 */
export const imageUploadOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(
        new BadRequestException('La imagen debe ser JPG, PNG, WEBP o GIF'),
        false,
      );
    }
    cb(null, true);
  },
};

/**
 * URL pública del backend: PUBLIC_URL si está definida; en Render se usa la que
 * provee automáticamente (RENDER_EXTERNAL_URL); en local, localhost.
 */
function urlPublica(): string {
  return (
    process.env.PUBLIC_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`
  );
}

/** Guarda la imagen en /uploads y devuelve su URL pública. */
export async function saveImage(file: Express.Multer.File): Promise<string> {
  await mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
  await writeFile(join(UPLOADS_DIR, filename), file.buffer);
  return `${urlPublica()}/uploads/${filename}`;
}
