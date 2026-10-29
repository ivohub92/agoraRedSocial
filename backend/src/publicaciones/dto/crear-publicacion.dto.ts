import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @MaxLength(1000, { message: 'El mensaje no puede superar los 1000 caracteres' })
  mensaje: string;

  /**
   * Puntaje opcional de 1 a 5 estrellas para el anime o manga reseñado.
   * Una publicación de debate simplemente no lo manda. Llega como texto en el
   * multipart, por eso se convierte a número antes de validar.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El puntaje debe ser un número entero de 1 a 5' })
  @Min(1, { message: 'El puntaje mínimo es 1 estrella' })
  @Max(5, { message: 'El puntaje máximo es 5 estrellas' })
  puntaje?: number;
}
