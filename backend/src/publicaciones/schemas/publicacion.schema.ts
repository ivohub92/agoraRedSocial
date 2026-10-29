import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  usuario: Types.ObjectId;

  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, trim: true })
  mensaje: string;

  @Prop({ type: String, default: null })
  imagen: string | null;

  /** Puntaje de 1 a 5 estrellas (null cuando la publicación es un debate sin puntuar). */
  @Prop({ type: Number, min: 1, max: 5, default: null })
  puntaje: number | null;

  /** Usuarios que dieron me gusta (cada uno a lo sumo una vez). */
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  meGusta: Types.ObjectId[];

  /** Contador de me gusta, para poder ordenar por popularidad con un índice. */
  @Prop({ default: 0 })
  cantidadMeGusta: number;

  /** Baja lógica: una publicación eliminada queda en la base con activa = false. */
  @Prop({ default: true })
  activa: boolean;

  createdAt: Date;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
PublicacionSchema.index({ activa: 1, createdAt: -1 });
PublicacionSchema.index({ activa: 1, cantidadMeGusta: -1, createdAt: -1 });
