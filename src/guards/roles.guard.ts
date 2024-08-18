import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/decorators/roles.decorator";
import { verify } from "jsonwebtoken";

import { Card, Column, Comment, User } from "db/db";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { };

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());

        if (!roles) {
            return true;
        };

        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace(/bearer\s/gmi, "");

        return verify(token, "purrweb", (err: Error, userFromToken: any) => {
            if (err) return false;

            if (userFromToken) {
                return User.findOne({ where: { id: userFromToken.id } }).then((foundUser) => {
                    if (foundUser.dataValues.isAdmin && roles.includes("admin")) {
                        return true;
                    } else if (request.params?.columnId && roles.includes("owner")) {
                        return Column.findOne({ where: { id: request.params?.columnId, ownerId: foundUser.dataValues.id } }).then((foundColumn) => {
                            if (foundColumn) {
                                return true;
                            } else {
                                return false;
                            };
                        })
                    } else if (request.params?.cardId && roles.includes("owner")) {
                        return Card.findOne({ where: { id: request.params?.cardId, ownerId: foundUser.dataValues.id } }).then((foundCard) => {
                            if (foundCard) {
                                return true;
                            } else {
                                return false;
                            };
                        });
                    } else if (request.params?.commentId && roles.includes("owner")) {
                        return Comment.findOne({ where: { id: request.params?.commentId, authorId: foundUser.dataValues.id } }).then((foundComment) => {
                            if (foundComment) {
                                return true;
                            } else {
                                return false;
                            };
                        });
                    };
                });
            };
        });
        // return true;
    }
};