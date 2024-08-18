import { IsEmail, IsNumberString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

class ValidId {
    @ApiProperty({ description: "ID пользователя", example: "1" })
    @IsNumberString()
    id: string;
};

class ValidColumnId {
    @ApiProperty({ description: "ID колонки", example: "1" })
    @IsNumberString()
    columnId: string;
};

class ValidCardId {
    @ApiProperty({ description: "ID карточки", example: "1" })
    @IsNumberString()
    cardId: string;
}

class ValidCommentId {
    @ApiProperty({ description: "ID комментария", example: "1" })
    @IsNumberString()
    commentId: string;
}

class ValidUserCredentials {
    @ApiProperty({ description: "email пользователя", example: "example_email@gmail.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Пароль пользователя", example: "example_password" })
    @MinLength(6)
    @MaxLength(255)
    password: string;
};

class ValidColumnData {
    @ApiProperty({ description: "Название колонки", example: "Задачи" })
    @MinLength(1)
    @MaxLength(255)
    columnTitle: string;
};

class ValidColumnUpdate {
    @ApiProperty({ description: "Новое название колонки", example: "Новые задачи" })
    @MinLength(1)
    @MaxLength(255)
    newColumnTitle: string;
};

class ValidCardData {
    @ApiProperty({ description: "Название карточки", example: "Сделать что-то" })
    @MinLength(1)
    @MaxLength(255)
    cardTitle: string;

    @ApiProperty({ description: "Описание карточки", example: "Чтобы сделать что-то, нужно..." })
    @MinLength(1)
    @MaxLength(255)
    cardText: string;
}

class ValidCardTitle {
    @ApiProperty({ description: "Новое название карточки", example: "Сделать что-то 2" })
    @MinLength(1)
    @MaxLength(255)
    newCardTitle: string;
}

class ValidCardText {
    @ApiProperty({ description: "Новое описание карточки", example: "Оказалось, чтобы сделать что-то, нужно ..., а не ..." })
    @MinLength(1)
    @MaxLength(255)
    newCardText: string;
}

class ValidCommentText {
    @ApiProperty({ description: "Текст комментария", example: "Супер, делаем" })
    @MinLength(1)
    @MaxLength(255)
    text: string;
};

export {
    ValidId,
    ValidUserCredentials,
    ValidColumnData,
    ValidColumnUpdate,
    ValidColumnId,
    ValidCardData,
    ValidCardId,
    ValidCardText,
    ValidCardTitle,
    ValidCommentText,
    ValidCommentId
};