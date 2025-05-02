import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersListComponent } from '../../components/partners-list/partners-list.component';
import { PartnerService } from '../../services/partner.service';
import { IPartner } from '@shared/interfaces/partner.interface';
import { PartnerModalComponent } from '../../components/partner-modal/partner-modal.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, PartnersListComponent, PartnerModalComponent, ButtonComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit {
  partners: IPartner[] = [];
  totalPartners: number = 0;
  isModalOpen: boolean = false;

  constructor(private partnerService: PartnerService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  private loadPartners(): void {
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

  onCreatePartner(partnerData: Omit<IPartner, 'id' | 'createdAt'>): void {
    this.partnerService.createPartner(partnerData).subscribe({
      next: (newPartner) => {
        this.partners = [...this.partners, newPartner];
        this.totalPartners++;
        this.closeModal();
      },
      error: (error) => {
        console.error('Erreur lors de la création du partenaire:', error);
      }
    });
  }
}
