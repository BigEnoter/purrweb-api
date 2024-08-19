import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty({ description: 'ID комментария', example: 1 })
    id: number;

    @ApiProperty({ description: 'Текст комментария', example: 'О, этого мы берем' })
    text: string;

    @ApiProperty({ description: 'ID отправившего комментарий', example: 1 })
    authorId: number;

    @ApiProperty({ description: 'ID карточки, к которой написан комментарий', example: 1 })
    cardId: number;
};