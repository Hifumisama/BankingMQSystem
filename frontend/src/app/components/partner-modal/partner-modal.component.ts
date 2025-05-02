import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

@Component({
  selector: 'app-partner-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-modal.component.html',
  styleUrl: './partner-modal.component.scss'
})
export class PartnerModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() createPartner = new EventEmitter<Omit<IPartner, 'id' | 'createdAt'>>();

  partnerForm: FormGroup;

  directions = [
    { value: 'INBOUND', label: 'Entrant' },
    { value: 'OUTBOUND', label: 'Sortant' }
  ];

  flowTypes = [
    { value: 'MESSAGE', label: 'Message' },
    { value: 'ALERTING', label: 'Alerte' },
    { value: 'NOTIFICATION', label: 'Notification' }
  ];

  constructor(private fb: FormBuilder) {
    this.partnerForm = this.fb.group({
      alias: ['', Validators.required],
      type: ['', Validators.required],
      direction: ['INBOUND', Validators.required],
      application: ['', Validators.required],
      processed_flow_type: ['MESSAGE', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.partnerForm.valid) {
      this.createPartner.emit(this.partnerForm.value);
      this.resetForm();
    }
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  private resetForm() {
    this.partnerForm.reset({
      direction: 'INBOUND',
      processed_flow_type: 'MESSAGE'
    });
  }
}
