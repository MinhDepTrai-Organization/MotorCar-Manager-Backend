import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ChatgatewayService } from './chatgateway.service';
import { Voucher } from '../vourchers/entities/vourcher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVourcher } from '../user_vourcher/entities/user_vourcher.entity';
import { VourchersService } from '../vourchers/vourchers.service';

interface AuthenticatedSocket extends Socket {
  user?: any; // Thêm thuộc tính user (có thể chỉnh lại kiểu nếu muốn)
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatgatewayService,
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
    private voucherService: VourchersService,

    @InjectRepository(UserVourcher)
    private readonly user_voucherRepo: Repository<UserVourcher>,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: AuthenticatedSocket) {
    try {
      const token =
        socket.handshake?.auth?.token ||
        // thêm bear
        socket.handshake?.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new WsException('Missing access token');
      }

      const payload = this.extractJwtPayload(token);

      socket.user = payload; // Gắn thông tin user vào client
      console.log(socket.use);
      // gửi danh sách voucher
      const vouchers = await this.voucherService.findAll();
      socket.emit('voucherList', vouchers); // Gửi danh sách ban đầu
    } catch (error) {
      console.error('JWT validation error:');
      socket.emit('error', { message: 'Invalid or expired token' });
      socket.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client id: ${client.id} disconnected`);
    client.disconnect();
  }
  private extractJwtPayload(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new WsException('Invalid JWT token');
    }
  }
  // trả về danh sách voucher
  @SubscribeMessage('selectedVoucher')
  async handlegetVoucher(socket: AuthenticatedSocket, voucherCode) {
    try {
      const updateVoucher = await this.voucherService.getVoucherById(
        socket.user.id,
        voucherCode,
      );
      this.server.emit('voucherListUpdated', updateVoucher);
    } catch (error) {
      // Ép kiểu error thành Error
      const err = error as Error;
      // Trả về lỗi chi tiết
      socket.emit('error', {
        message: err.message || 'Có lỗi xảy ra khi chọn voucher',
        code: (error as any).status || 500, // Ép kiểu cho status nếu cần
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: { adminId: string; customerId: string },
  ) {
    const conversation = await this.chatService.getOrCreateConversation(
      payload.adminId,
      payload.customerId,
    );
    client.join(conversation.id);
    client.emit('joinedRoom', conversation.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage1(
    client: Socket,
    payload: { conversationId: string; senderId: string; content: string },
  ) {
    const message = await this.chatService.saveMessage(
      payload.conversationId,
      payload.senderId,
      payload.content,
    );
    this.server.to(payload.conversationId).emit('newMessage', message);
  }
}
