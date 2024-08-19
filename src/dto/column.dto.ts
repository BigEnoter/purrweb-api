import { ApiProperty } from "@nestjs/swagger";

export class ColumnDto {
    @ApiProperty({ description: 'ID колонки', example: 1 })
    id: number;

    @ApiProperty({ description: 'Название колонки', example: 'Колонка' })
    columnTitle: string;

    @ApiProperty({ description: 'ID владельца колонки', example: 1 })
    ownerId: number;
};