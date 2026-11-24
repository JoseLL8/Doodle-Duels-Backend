import { IntersectionType } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserEmailDto, UserNicknameDto, UserPasswordDto } from '../user/dto/components.dto.js';

export class SignUpDto extends IntersectionType(
  UserEmailDto,
  UserNicknameDto,
  UserPasswordDto
) { }

export class SignInDto extends IntersectionType(
  UserEmailDto,
  UserPasswordDto
) { }
