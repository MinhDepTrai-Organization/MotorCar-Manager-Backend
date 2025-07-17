import { Module } from '@nestjs/common';
import { ChatgatewayService } from './chatgateway.service';
import { ChatGateway } from './chatgateway.gateway';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Message } from '../message/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../vourchers/entities/vourcher.entity';
import { UserVourcher } from '../user_vourcher/entities/user_vourcher.entity';
import { VourchersService } from '../vourchers/vourchers.service';
import { VourchersModule } from '../vourchers/vourchers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, Voucher, UserVourcher]),
    VourchersModule,
  ],
  providers: [ChatGateway, ChatgatewayService],
})
export class ChatgatewayModule {}
