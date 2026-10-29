import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/** Valida que un parámetro de ruta sea un ObjectId de MongoDB; si no, responde 400. */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(valor: string): string {
    if (!isValidObjectId(valor)) {
      throw new BadRequestException('El id no es válido');
    }
    return valor;
  }
}
