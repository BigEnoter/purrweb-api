import { Controller, UseGuards, Get, Param, Delete, Patch, Body, Post, Headers } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";

import { Card, Comment, User } from "db/db";
import { ValidCardId, ValidCardTitle, ValidCardText, ValidCommentText } from "./validators";

@Controller("/api/cards")
@ApiTags("Cards")
@UseGuards(RolesGuard)
export class CardsApiController {
    @Get("/")
    @Roles(["admin"])
    @ApiOperation({ summary: 'Получение всех карточек', description: 'Возвращает список всех карточек в системе' })
    @ApiResponse({ status: 200, description: 'Список карточек успешно получен' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права администратора' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getAllCards(): object | string {
        return Card.findAll();
    };

    @Get(":cardId")
    @ApiOperation({ summary: 'Получение карточки по ID', description: 'Возвращает карточку с указанным ID' })
    @ApiResponse({ status: 200, description: 'Карточка успешно найдена' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getCardById(@Param() { cardId }: ValidCardId): object | string {
        return Card.findOne({ where: { id: cardId } });
    };

    @Delete(":cardId")
    @Roles(["owner"])
    @ApiOperation({ summary: 'Удаление карточки по ID', description: 'Удаляет карточку с указанным ID' })
    @ApiResponse({ status: 200, description: 'Карточка успешно удалена', schema: { example: { cardDeleted: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права владельца карточки' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    deleteCardById(@Param() { cardId }: ValidCardId): object | string {
        return Card.destroy({ where: { id: cardId } }).then((deletedCards) => {
            if (deletedCards > 0) {
                return { cardDeleted: true };
            } else {
                return { cardDeleted: false };
            };
        });
    };

    @Patch(":cardId/title")
    @Roles(["owner"])
    @ApiOperation({ summary: 'Редактирование названия карточки', description: 'Обновляет название карточки с указанным ID' })
    @ApiResponse({ status: 200, description: 'Название карточки успешно обновлено', schema: { example: { cardUpdated: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права владельца карточки' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    editCardTitle(@Param() { cardId }: ValidCardId, @Body() { newCardTitle }: ValidCardTitle): object | string {
        return Card.update({ cardTitle: newCardTitle }, { where: { id: cardId } }).then((updatedCards) => {
            if (updatedCards) {
                return { cardUpdated: true };
            } else {
                return { cardUpdated: false };
            };
        });
    };

    @Patch(":cardId/text")
    @Roles(["owner"])
    @ApiOperation({ summary: 'Редактирование текста карточки', description: 'Обновляет текст карточки с указанным ID' })
    @ApiResponse({ status: 200, description: 'Текст карточки успешно обновлен', schema: { example: { cardUpdated: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права владельца карточки' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    editCardText(@Param() { cardId }: ValidCardId, @Body() { newCardText }: ValidCardText): object | string {
        return Card.update({ cardText: newCardText }, { where: { id: cardId } }).then((updatedCards) => {
            if (updatedCards) {
                return { cardUpdated: true };
            } else {
                return { cardUpdated: false };
            };
        });
    };

    @Post(":cardId/comments")
    @ApiOperation({ summary: 'Добавление комментария к карточке', description: 'Создает новый комментарий для карточки с указанным ID' })
    @ApiResponse({ status: 201, description: 'Комментарий успешно добавлен', schema: { example: { message: 'Successfully posted comment with id 1' } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    postComment(@Param() { cardId }: ValidCardId, @Body() { text }: ValidCommentText, @Headers('Authorization') token: string): object | string {
        token = token?.replace(/bearer\s/gmi, "");

        return verify(token, "purrweb", (err: Error, userObject: any) => {
            if (err) {
                return { message: "Something went wrong verifying your JWT, try to login again" };
            };

            if (userObject) {
                return User.findOne({ where: { id: userObject.id } }).then((foundUser) => {
                    if (userObject.id === foundUser.dataValues.id) {
                        return Comment.create({ text, authorId: foundUser.dataValues.id, cardId }).then((createdComment) => {
                            return { message: `Successfully posted comment with id ${createdComment.dataValues.id}` };
                        });
                    } else {
                        return { message: "Why would you even try to do that" };
                    };
                });
            };
        });
    };
};