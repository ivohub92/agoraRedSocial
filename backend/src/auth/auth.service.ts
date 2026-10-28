import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { saveImage } from '../common/image-upload.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto, imagen?: Express.Multer.File) {
    if (dto.password !== dto.repetirPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const existente = await this.usersService.existsByCorreoOrNombreUsuario(
      dto.correo,
      dto.nombreUsuario,
    );
    if (existente) {
      throw new ConflictException(
        existente.correo === dto.correo.toLowerCase()
          ? 'El correo ya está registrado'
          : 'El nombre de usuario ya está en uso',
      );
    }

    const { repetirPassword: _, password, ...datos } = dto;
    try {
      const user = await this.usersService.create({
        ...datos,
        fechaNacimiento: new Date(dto.fechaNacimiento),
        password: await bcrypt.hash(password, SALT_ROUNDS),
        imagenPerfil: imagen ? await saveImage(imagen) : null,
      });
      return user.toJSON();
    } catch (err) {
      // Dos registros simultáneos con el mismo dato pasan la verificación de arriba,
      // pero el índice único de MongoDB rechaza el segundo (error 11000): es un 409, no un 500.
      if ((err as { code?: number }).code === 11000) {
        const campo = Object.keys((err as { keyPattern?: object }).keyPattern ?? {})[0];
        throw new ConflictException(
          campo === 'nombreUsuario'
            ? 'El nombre de usuario ya está en uso'
            : 'El correo ya está registrado',
        );
      }
      throw err;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByIdentificador(dto.identificador);
    // bcrypt.compare encripta la contraseña recibida con el salt guardado y compara los hashes.
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    return user.toJSON();
  }
}
