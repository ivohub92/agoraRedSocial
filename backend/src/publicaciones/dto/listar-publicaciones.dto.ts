import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export const ORDENES = ['fecha', 'meGusta'] as const;
export type Orden = (typeof ORDENES)[number];

/** Parámetros de GET /publicaciones (llegan como query string). */
export class ListarPublicacionesDto {
  @IsOptional()
  @IsIn(ORDENES, { message: 'orden debe ser "fecha" o "meGusta"' })
  orden: Orden = 'fecha';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset debe ser un número entero' })
  @Min(0, { message: 'offset no puede ser negativo' })
  offset = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit debe ser un número entero' })
  @Min(1, { message: 'limit debe ser al menos 1' })
  @Max(50, { message: 'limit no puede superar 50' })
  limit = 10;

  /** Filtra las publicaciones de un usuario en particular. */
  @IsOptional()
  @IsMongoId({ message: 'usuario no es un id válido' })
  usuario?: string;
}
