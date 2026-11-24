import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../user/user.repository.js';
import { ConfigService } from '@nestjs/config';
import { Role } from '../user/user.interface.js';

@Injectable()
export class SeederService {
  /**
   * Objeto para realizar logs en la consola cuando el seeder realiza operaciones
   */
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserRepository,
  ) {}

  async seed() {
    await this.seedUsers();
  }

  /**
   * Método para añadir usuarios a la base de datos. Se crea un usuario por cada permiso
   * que se encuentre en el ENUM de Role. El dominio viene establecido en el .env y la
   * contraseña se monta usando el nombre del rol y unos valores del .env
   *
   * @returns     El return se usa para romper la lógica en caso de estar en producción
   */
  async seedUsers() {
    try {
      this.logger.debug('Seeding users');
      const email = this.configService.getOrThrow('ADMIN_EMAIL');
      const password = this.configService.getOrThrow('ADMIN_PASS');
      const nickname = this.configService.getOrThrow('ADMIN_NAME');
      //const seededUsersPass = this.getEnvVar('SEEDED_USERS_PASS');

      // Si estamos en producción, solo se creará el usuario administrador del sistema
      //if (process.env.NODE_ENV === 'production') {
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        this.logger.debug('User table already seeded, exiting...');
        return;
      }
      await this.userService.rawCreate({
        email,
        password,
        nickname,
        role: Role.SUPERADMIN,
      });
      return;
      //}

      // Crear usuarios para cada rol (para entorno de desarrollo)
      /*const roleKeys = Object.keys(Role) as Array<keyof typeof Role>;
            for (const roleKey of roleKeys) {
                const password = seededUsersPass;
                this.checkUser(roleKey, password);
                const hashedPassword = await hash(password, APPConstants.PASSWORDS_SALT_ROUNDS);
                await this.createSqlUser(roleKey, hashedPassword, Role[roleKey]);
            }

            this.checkUser(adminAccount, adminPass);
            const hashedAdminPass = await hash(adminPass, APPConstants.PASSWORDS_SALT_ROUNDS);
            await this.createSqlUser(adminAccount, hashedAdminPass, Role.SUPER_ADMIN);*/
    } catch (error: unknown) {
      this.logger.error(error);
    }
  }

  /**
   * Comrpueba que el nombre de usuario y contraseña sean correctos.
   * Lanza un error si son incorrectos
   * @param accountName
   * @param pass
   */
  /*checkUser(accountName: string, pass: string) {
        if (accountName.length < APPConstants.USER_NAME_MIN_LENGTH) {
            throw new Error('Error seeding user, name length is too small');
        }
        if (accountName.length > APPConstants.USER_NAME_MAX_LENGTH) {
            throw new Error('Error seeding user, name length is too large');
        }

        if (pass.length < APPConstants.USER_PASSWORD_MIN_LENGTH) {
            throw new Error('Error seeding user, password length is too small');
        }
        if (pass.length > APPConstants.USER_PASSWORD_MAX_LENGTH) {
            throw new Error('Error seeding user, password length is too large');
        }
    }*/
}
