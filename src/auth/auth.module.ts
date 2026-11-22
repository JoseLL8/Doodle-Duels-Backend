import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { SessionAuth } from './session-auth-provider.js';
import { AuthController } from './auth.controller.js';
import { CredentialsService } from './credentials.service.js';
import { TypeOrmAuthenticationStore } from './typeorm-auth.store.js';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [SessionAuth, CredentialsService, TypeOrmAuthenticationStore]
})
export class AuthModule {}
