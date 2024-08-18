import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserApiController } from './api/user-api.controller';
import { ColumnsAPiController } from './api/columns-api.controller';
import { CardsApiController } from './api/cards-api.controller';
import { CommentsApiController } from './api/comments-api.controller';

@Module({
  imports: [],
  controllers: [UserApiController, ColumnsAPiController, CardsApiController, CommentsApiController],
  providers: [AppService],
})
export class AppModule { }
