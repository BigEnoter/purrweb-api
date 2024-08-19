import { ApiProperty } from "@nestjs/swagger";

export class CardDto {
    @ApiProperty({ description: 'ID карточки', example: 1 })
    id: number;

    @ApiProperty({ description: 'Название карточки', example: 'Карточка' })
    cardTitle: string;

    @ApiProperty({ description: 'Текст карточки', example: 'Крутая карточка' })
    cardText: string;

    @ApiProperty({ description: 'ID колонки, к кототой принадлежит карточка', example: 1 })
    columnId: number;

    @ApiProperty({ description: 'ID владельца карточки', example: 1 })
    ownerId: number;
};