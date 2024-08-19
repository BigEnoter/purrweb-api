import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ description: 'Email пользователя', example: 'example@gmail.com' })
    email: string;

    @ApiProperty({ description: "ID пользователя", example: 1 })
    id: number;
};