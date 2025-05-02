import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPartner } from '../../../../../shared/interfaces/partner.interface';
import { IMessage } from '../../../../../shared/interfaces/message.interface';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-list.component.html',
})
export class MessageListComponent implements OnChanges {
  @Input() messages: IMessage[] = [];
  @Input() partners: IPartner[] = [];
  
  filteredMessages: IMessage[] = [];
  searchTerm: string = '';
  selectedPartnerId: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] || changes['partners']) {
      this.filterMessages();
    }
  }

  filterMessages(): void {
    this.filteredMessages = this.messages.filter(message => {
      const matchesSearch = message.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPartner = !this.selectedPartnerId || message.partnerId === this.selectedPartnerId;
      return matchesSearch && matchesPartner;
    });
  }

  onSearchChange(): void {
    this.filterMessages();
  }

  onPartnerChange(): void {
    this.filterMessages();
  }

  getPartnerName(partnerId: string): string {
    const partner = this.partners.find(p => p.id === partnerId);
    return partner ? partner.alias : 'Unknown Partner';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
