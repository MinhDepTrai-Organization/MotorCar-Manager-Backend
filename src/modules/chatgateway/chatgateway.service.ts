import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Repository } from 'typeorm';
import { Message } from '../message/entities/message.entity';

@Injectable()
export class ChatgatewayService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageReposity: Repository<Message>,
  ) {}

  async getOrCreateConversation(
    adminId: string,
    customerId: string,
  ): Promise<Conversation> {
    let conversation = await this.conversationRepository.findOne({
      where: { admin: { id: adminId }, customer: { id: customerId } },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        admin: { id: adminId },
        customer: { id: customerId },
      });
      await this.conversationRepository.save(conversation);
    }

    return conversation;
  }

  async saveMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new Error('Conversation not found');

    const isAdmin = conversation.admin.id === senderId;
    // Create message with proper entity relationships
    const message = this.messageReposity.create({
      conversation: { id: conversationId }, // Matches ManyToOne relation
      content,
      admin: isAdmin ? { id: senderId } : null, // Changed to full object reference
      customer: !isAdmin ? { id: senderId } : null, // Changed to full object reference
    });
    return await this.messageReposity.save(message);
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<Message[]> {
    return this.messageReposity.find({
      where: { conversation: { id: conversationId } },
      relations: ['admin', 'customer'],
      order: { timestamp: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }
}
