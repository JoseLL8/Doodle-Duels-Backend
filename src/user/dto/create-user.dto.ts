import { IntersectionType } from '@nestjs/swagger';
import {
  UserEmailDto,
  UserNicknameDto,
  UserPasswordDto,
  UserRoleDto,
} from './components.dto.js';

export default class CreateUserDto extends IntersectionType(
  UserEmailDto,
  UserNicknameDto,
  UserPasswordDto,
  UserRoleDto,
) {}
