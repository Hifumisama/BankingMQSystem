import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IPartner } from '../../../../../shared/interfaces/partner.interface';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-modal.component.html',
})
export class MessageModalComponent {
  @Input() isOpen: boolean = false;
  @Input() partners: IPartner[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() messageSent = new EventEmitter<{ content: string; partnerId: string }>();

  selectedPartnerId: string = '';
  content: string = '';

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.messageSent.emit({
        content: this.content,
        partnerId: this.selectedPartnerId
      });
      form.resetForm();
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
} 