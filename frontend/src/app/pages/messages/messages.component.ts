import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from '../../components/message-list/message-list.component';
import { MessageModalComponent } from '../../components/message-modal/message-modal.component';
import { MessageService} from '../../services/message.service';
import { PartnerService} from '../../services/partner.service';
import { IMessage } from '../../../../../shared/interfaces/message.interface';
import { IPartner } from '../../../../../shared/interfaces/partner.interface';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, MessageListComponent, MessageModalComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  messages: IMessage[] = [];
  partners: IPartner[] = [];
  totalMessages: number = 0;
  totalPartners: number = 0;
  isModalOpen: boolean = false;

  constructor(
    private messageService: MessageService,
    private partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.messageService.getAllMessages().subscribe(messages => {
      this.messages = messages;
      this.totalMessages = messages.length;
    });

    this.partnerService.getAllPartners().subscribe(partners => {
      this.partners = partners;
      this.totalPartners = partners.length;
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onMessageSent(data: { content: string; partnerId: string }): void {
    this.messageService.sendMessage(data.content, data.partnerId).subscribe(newMessage => {
      this.messages = [newMessage, ...this.messages];
      this.totalMessages = this.messages.length;
    });
  }
}
