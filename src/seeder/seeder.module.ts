import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { SeederService } from './seeder.service.js';

@Module({
  imports: [UserModule],
  providers: [SeederService],
  exports: [SeederService],
})
export default class SeederModule {}
