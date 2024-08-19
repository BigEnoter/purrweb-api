import { Controller, Get, Delete, Patch, UseGuards, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";

import { Comment } from "db/db";
import { ValidCommentId, ValidCommentText } from "./validators";

import { CommentDto } from "src/dto/comment.dto";

@Controller("/api/comments")
@ApiTags("Comments")
@UseGuards(RolesGuard)
export class CommentsApiController {
    @Get()
    @Roles(["admin"])
    @ApiOperation({ summary: 'Получение всех комментариев', description: 'Возвращает список всех комментариев' })
    @ApiResponse({ status: 200, description: 'Список комментариев успешно получен', type: [CommentDto] })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права администратора' })
    getAllComments(): object | string {
        return Comment.findAll();
    };

    @Get(":commentId")
    @ApiOperation({ summary: 'Получение комментария по ID', description: 'Возвращает комментарий с указанным ID' })
    @ApiResponse({ status: 200, description: 'Комментарий успешно найден', type: CommentDto })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getCommentById(@Param() { commentId }: ValidCommentId): object | string {
        return Comment.findOne({ where: { id: commentId } });
    };

    @Patch(":commentId")
    @Roles(["owner"])
    @ApiOperation({ summary: 'Редактирование текста комментария', description: 'Обновляет текст комментария с указанным ID' })
    @ApiResponse({ status: 200, description: 'Текст комментария успешно обновлен', schema: { example: { commentUpdated: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права владельца комментария' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    editCommentText(@Param() { commentId }: ValidCommentId, @Body() { text }: ValidCommentText): object | string {
        return Comment.update({ text }, { where: { id: commentId } }).then((updatedComments) => {
            if (updatedComments) {
                return { commentUpdated: true };
            } else {
                return { commentUpdated: false };
            };
        });
    };

    @Delete(":commentId")
    @Roles(["admin", "owner"])
    @ApiOperation({ summary: 'Удаление комментария по ID', description: 'Удаляет комментарий с указанным ID' })
    @ApiResponse({ status: 200, description: 'Комментарий успешно удален.', schema: { example: { commentDeleted: true } } })
    @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуются права администратора или владельца комментария' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    deleteCommentById(@Param() { commentId }: ValidCommentId): object | string {
        return Comment.destroy({ where: { id: commentId } }).then((deletedComment) => {
            if (deletedComment) {
                return { commentDeleted: true };
            } else {
                return { commentDeleted: false };
            };
        });
    };
};