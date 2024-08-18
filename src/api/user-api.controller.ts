import { Body, Controller, Delete, Get, Headers, Param, Post } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";


import { User, Column } from "../../db/db";

import { ValidId, ValidUserCredentials, ValidColumnData } from "./validators";

@Controller('api/users')
@ApiTags("User")
export class UserApiController {
    @Get()
    @ApiResponse({ "status": 200, description: "Пользователи успешно получены" })
    @ApiResponse({ "status": 500, description: "Ошибка сервера" })
    @ApiOperation({ summary: "Получение списка всех пользователей", description: "Возвращает список всех пользователей с их ID и почтой" })
    findAll(): object | string {
        return User.findAll({ attributes: ['id', 'email'] });
    };

    @Post()
    @ApiOperation({ summary: 'Регистрация нового пользователя', description: 'Создает нового пользователя с указанными данными' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    registerUser(@Body() { email, password }: ValidUserCredentials): object | string {
        return User.findOne({ where: { email } }).then((emailCheck) => {
            if (emailCheck) {
                return { error: "This email is already busy, use another one", registered: false };
            } else {
                return User.create({ email, password }).then((createdUser) => {
                    if (createdUser) {
                        return { registered: true };
                    } else {
                        return { registered: false };
                    }
                })
            };
        });
    };

    @Get(":id")
    @ApiOperation({ summary: 'Получение пользователя по ID', description: 'Возвращает информацию о пользователе по указанному ID' })
    @ApiResponse({ status: 200, description: 'Пользователь найден (а может быть и нет)' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации ID' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getUserById(@Param() { id }: ValidId): object {
        if (id) {
            return User.findOne({ where: { id: id }, attributes: ['id', 'email'] }).then((user) => {
                if (user) {
                    return user;
                } else {
                    return { error: `Couldn't find user with id ${id}` };
                }
            });
        } else {
            return { error: "User id parameter is missing" };
        };
    };

    @Delete(":id")
    @ApiOperation({ summary: 'Удаление пользователя по ID', description: 'Удаляет пользователя с указанным идентификатором, если есть соответствующие права' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации ID' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    deleteUserById(@Param() { id }: ValidId, @Headers("Authorization") token: string): object {
        if (id && token) {
            token = token?.replace(/bearer\s/gmi, "");

            return verify(token, "purrweb", (err: Error, userObject: any) => {
                if (err) {
                    return { message: "Something went wrong verifying your JWT, try to login again" };
                };

                if (userObject) {
                    // check admin rights & then delete the user, if exists
                    return User.findOne({ where: { id: userObject.id } }).then((adminCheck) => {
                        if (!adminCheck?.dataValues.isAdmin) {
                            return { message: "You don't have permissions to do that" };
                        } else {
                            if (id == userObject.id) return { message: "Why would you want to delete yourself you kek" };
                            return User.destroy({ where: { id: id } }).then((amount) => {
                                if (amount > 0) {
                                    return { message: `Deleted user with id ${id}` };
                                } else {
                                    return { message: `Couldn't delete user with id ${id}` };
                                };
                            });
                        };
                    });
                };
            });
        } else {
            return { message: "You're definitely missing something" };
        };
    };

    @Post("/login")
    @ApiOperation({ summary: 'Вход пользователя', description: 'Аутентифицирует пользователя и возвращает токен доступа' })
    @ApiResponse({ status: 201, description: 'Успешный вход, возвращает токен доступа', schema: { example: { success: true, auth_token: 'your_jwt_token' } } })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    loginUser(@Body() { email, password }: ValidUserCredentials): object | string {
        return User.findOne({ where: { email, password } }).then((foundUser) => {
            if (foundUser) {
                return { success: true, auth_token: sign({ id: foundUser.dataValues.id, email: foundUser.dataValues.email, isAdmin: foundUser.dataValues.isAdmin }, "purrweb", { expiresIn: '1h' }) }
            } else {
                return { success: false };
            };
        });
    };

    @Get(":id/columns")
    @ApiOperation({ summary: 'Получение колонок пользователя', description: 'Возвращает все колонки, принадлежащие пользователю с указанным ID' })
    @ApiResponse({ status: 200, description: 'Список колонок пользователя' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    getUserColumns(@Param() { id }: ValidId): object {
        return Column.findAll({ where: { ownerId: id } }).then((columns) => {
            if (columns.length > 0) {
                return columns;
            } else {
                return { message: "Looks like this user has no columns" };
            };
        });
    };

    @Post(":id/columns")
    @ApiOperation({ summary: 'Создание колонки для пользователя', description: 'Создает новую колонку для пользователя с указанным ID' })
    @ApiResponse({ status: 201, description: 'Успешно создана колонка.', schema: { example: { message: 'Successfully created column with id 1' } } })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    createColumn(@Param() { id }: ValidId, @Body() { columnTitle }: ValidColumnData, @Headers('Authorization') token: string): object {
        token = token?.replace(/bearer\s/gmi, "");

        return verify(token, "purrweb", (err: Error, userObject: any) => {
            if (err) {
                return { message: "Something went wrong verifying your JWT, try to login again" };
            };

            if (userObject) {
                return User.findOne({ where: { id } }).then((foundUser) => {
                    if (userObject.id === foundUser.dataValues.id) {
                        return Column.create({ columnTitle, ownerId: id }).then((createdColumn) => {
                            return { message: `Successfully created column with id ${createdColumn.dataValues.id}` };
                        });
                    } else {
                        return { message: "Why would you even try to do that" };
                    };
                });
            };
        });
    };
};