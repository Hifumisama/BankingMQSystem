import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

@Component({
  selector: 'app-partner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partner-modal.component.html',
  styleUrl: './partner-modal.component.scss'
})
export class PartnerModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() createPartner = new EventEmitter<Omit<IPartner, 'id' | 'createdAt'>>();

  formData: Omit<IPartner, 'id' | 'createdAt'> = {
    alias: '',
    type: '',
    direction: 'INBOUND',
    application: '',
    processed_flow_type: 'MESSAGE',
    description: ''
  };

  directions = [
    { value: 'INBOUND', label: 'Entrant' },
    { value: 'OUTBOUND', label: 'Sortant' }
  ];

  flowTypes = [
    { value: 'MESSAGE', label: 'Message' },
    { value: 'ALERTING', label: 'Alerte' },
    { value: 'NOTIFICATION', label: 'Notification' }
  ];

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.createPartner.emit(this.formData);
      this.resetForm();
    }
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  private resetForm() {
    this.formData = {
      alias: '',
      type: '',
      direction: 'INBOUND',
      application: '',
      processed_flow_type: 'MESSAGE',
      description: ''
    };
  }
}
