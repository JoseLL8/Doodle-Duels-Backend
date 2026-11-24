import { IntersectionType } from '@nestjs/swagger';
import { UserNicknameDto } from './components.dto.js';

export default class UpdateUserDto extends IntersectionType(UserNicknameDto) {}
