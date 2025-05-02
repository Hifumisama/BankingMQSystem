import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPartner } from '../../../../../shared/interfaces/partner.interface';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message-modal.component.html',
})
export class MessageModalComponent {
  @Input() isOpen: boolean = false;
  @Input() partners: IPartner[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() messageSent = new EventEmitter<{ content: string; partnerId: string }>();

  messageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      partnerId: [null, Validators.required],
      content: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      const { content, partnerId } = this.messageForm.value;
      this.messageSent.emit({ content, partnerId });
      this.messageForm.reset();
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.messageForm.reset();
    this.closeModal.emit();
  }
} 