import { Body, Controller, Delete, Get, Param, Patch, UseGuards, Headers, Post } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";

import { ValidColumnUpdate, ValidColumnId, ValidCardData } from "./validators";
import { Column, Card, User } from "db/db";

@Controller("/api/columns")
@ApiTags("Columns")
@UseGuards(RolesGuard)
export class ColumnsAPiController {
    @Get("/")
    @Roles(['admin'])
    @ApiOperation({ summary: 'Получение всех колонок', description: 'Возвращает список всех колонок' })
    @ApiResponse({ status: 200, description: 'Список колонок успешно получен' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права администратора' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getAllColumns(): object | string {
        return Column.findAll();
    };

    @Get(":columnId")
    @ApiOperation({ summary: 'Получение колонки по ID', description: 'Возвращает колонку с указанным идентификатором' })
    @ApiResponse({ status: 200, description: 'Колонка успешно найдена' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getColumnById(@Param() { columnId }: ValidColumnId): object | string {
        return Column.findOne({ where: { id: columnId } });
    };

    @Patch(":columnId")
    @Roles(["owner"])
    @ApiOperation({ summary: 'Редактирование названия колонки', description: 'Обновляет название колонки с указанным идентификатором' })
    @ApiResponse({ status: 200, description: 'Название колонки успешно обновлено', schema: { example: { columnUpdated: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права владельца колонки' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    editColumnTitle(@Param() { columnId }: ValidColumnId, @Body() { newColumnTitle }: ValidColumnUpdate): object | string {
        return Column.update({ columnTitle: newColumnTitle }, { where: { id: columnId } }).then((updatedColumn) => {
            if (updatedColumn) {
                return { columnUpdated: true };
            } else {
                return { columnUpdated: false };
            };
        });
    };

    @Delete(":columnId")
    @Roles(["owner"])
    @ApiOperation({ summary: 'Удаление колонки по ID', description: 'Удаляет колонку с указанным идентификатором' })
    @ApiResponse({ status: 200, description: 'Колонка успешно удалена', schema: { example: { columnDeleted: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права владельца колонки' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    deleteColumnById(@Param() { columnId }: ValidColumnId): object | string {
        return Column.destroy({ where: { id: columnId } }).then((deletedAmount) => {
            if (deletedAmount > 0) {
                return { columnDeleted: true };
            } else {
                return { columnDeleted: false };
            };
        });
    };

    @Get(":columnId/cards")
    @ApiOperation({ summary: 'Получение всех карточек колонки', description: 'Возвращает все карточки колонки с указанным ID' })
    @ApiResponse({ status: 200, description: 'Сервер вернул все карточки колонки с указанным ID' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getCardsOfColumn(@Param() { columnId }: ValidColumnId): object | string {
        return Card.findAll({ where: { columnId } }) || [];
    };

    @Post(":columnId/cards")
    @ApiOperation({ summary: 'Создание карточки в колонке', description: 'Создает новую карточку в указанной колонке' })
    @ApiResponse({ status: 201, description: 'Успешно создана карточка', schema: { example: { message: 'Successfully created card with id 1' } } }) // Описание успешного ответа
    @ApiResponse({ status: 403, description: 'У вас нет прав для создания карточки' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    createCard(@Param() { columnId }: ValidColumnId, @Body() { cardTitle, cardText }: ValidCardData, @Headers('Authorization') token: string): object | string {
        token = token?.replace(/bearer\s/gmi, "");

        return verify(token, "purrweb", (err: Error, userObject: any) => {
            if (err) {
                return { message: "Something went wrong verifying your JWT, try to login again" };
            };

            if (userObject) {
                return User.findOne({ where: { id: userObject.id } }).then((foundUser) => {
                    if (userObject.id === foundUser.dataValues.id) {
                        return Card.create({ cardTitle, ownerId: foundUser.dataValues.id, cardText, columnId }).then((createdCard) => {
                            return { message: `Successfully created card with id ${createdCard.dataValues.id}` };
                        });
                    } else {
                        return { message: "Why would you even try to do that" };
                    };
                });
            };
        });
    };
};