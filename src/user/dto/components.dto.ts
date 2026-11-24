import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user.interface.js';
import { APPConstants } from '../../common/constants.js';

export class UserEmailDto {
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID',
        },
    )
    email!: string;
}

export class UserNicknameDto {
    @ApiProperty({ example: 'Nickname de Usuario', required: true })
    @IsString()
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @MinLength(APPConstants.USER_NAME_MIN_LENGTH, {
        message: 'NAME MIN LENGTH'
    })
    @MaxLength(APPConstants.USER_NAME_MAX_LENGTH, {
        message: 'NAME MAX LENGTH'
    })
    nickname!: string;
}

/**
 * La contraseña debe cumplir las siguientes reglas:
 *  - Al menos una letra mayúscula
 *  - Al menos una letra minúscula
 *  - Al menos un número
 *  - Al menos un carácter especial (de los de la lista)
 *  - Entre APPConstants.USER_PASSWORD_MIN_LENGTH y APPConstants.USER_PASSWORD_MAX_LENGTH caracteres (El límite de caracteres para hashear de Bcrypt es de 72Bytes)
*/
export class UserPasswordDto {
    @ApiProperty({ example: 'UnaPasswordMasFuerte1234_', required: true })
    @IsString()
    @MinLength(APPConstants.USER_PASSWORD_MIN_LENGTH, {
        message: 'PASSWORD MIN LENGTH'
    })
    @MaxLength(APPConstants.USER_PASSWORD_MAX_LENGTH, {
        message: 'PASSWORD MAX LENGTH'
    })
    @Matches(/^\S*$/, {
        message: 'PASSWORD NO SPACES'
    })
    @Matches(/.*[a-záéíóúüñ].*/, {
        message: 'PASSWORD ONE LOWERCASE'
    })
    @Matches(/.*[A-ZÁÉÍÓÚÜÑ].*/, {
        message: 'PASSWORD ONE UPPERCASE'
    })
    @Matches(/.*[0-9].*/, {
        message: 'PASSWORD ONE NUMBER'
    })
    @Matches(/.*[!@#$%^&*()_+{}[\]:;<>,.?\/~_\+\-=|].*/, {
        message: 'PASSWORD ONE SPECIAL CHAR'
    })
    password!: string;
}

export class UserRoleDto {
    @IsEnum(Role)
    role!: Role;
}

//todo i18n?
/*export class UserLanguageDto {
    @IsEnum(Language)
    language!: Language;
}*/