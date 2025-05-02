import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersListComponent } from '../../components/partners-list/partners-list.component';
import { PartnerService } from '../../services/partner.service';
import { IPartner } from '@shared/interfaces/partner.interface';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, PartnersListComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit {
  partners: IPartner[] = [];
  totalPartners: number = 0;

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
}
