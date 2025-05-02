import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

@Component({
  selector: 'app-partners-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.scss'
})
export class PartnersListComponent implements OnChanges {
  @Input() partners: IPartner[] = [];

  filteredPartners: IPartner[] = [];
  searchTerm: string = '';
  selectedDirection: string = '';
  selectedFlowType: string = '';

  // Options pour les filtres
  directions = [
    { value: '', label: 'Tous' },
    { value: 'INBOUND', label: 'Entrant' },
    { value: 'OUTBOUND', label: 'Sortant' }
  ];

  flowTypes = [
    { value: '', label: 'Tous' },
    { value: 'MESSAGE', label: 'Message' },
    { value: 'ALERTING', label: 'Alerte' },
    { value: 'NOTIFICATION', label: 'Notification' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partners']) {
      this.filterPartners();
    }
  }

  filterPartners(): void {
    this.filteredPartners = this.partners.filter(partner => {
      const matchesSearch = partner.alias.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          partner.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDirection = !this.selectedDirection || partner.direction === this.selectedDirection;
      const matchesFlowType = !this.selectedFlowType || partner.processed_flow_type === this.selectedFlowType;
      
      return matchesSearch && matchesDirection && matchesFlowType;
    });
  }

  onSearchChange(): void {
    this.filterPartners();
  }

  onDirectionChange(): void {
    this.filterPartners();
  }

  onFlowTypeChange(): void {
    this.filterPartners();
  }

  getDirectionBadgeClass(direction: string): string {
    return direction === 'INBOUND' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  }

  getFlowTypeBadgeClass(flowType: string): string {
    switch (flowType) {
      case 'MESSAGE':
        return 'bg-purple-100 text-purple-800';
      case 'ALERTING':
        return 'bg-red-100 text-red-800';
      case 'NOTIFICATION':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
