import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnersListComponent } from './partners-list.component';
import { FormsModule } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('PartnersListComponent', () => {
  let component: PartnersListComponent;
  let fixture: ComponentFixture<PartnersListComponent>;

  const mockPartners: IPartner[] = [
    {
      id: '1',
      alias: 'Test Partner 1',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'Test App 1',
      processed_flow_type: 'MESSAGE',
      description: 'Test Description 1'
    },
    {
      id: '2',
      alias: 'Test Partner 2',
      type: 'OUTBOUND',
      direction: 'OUTBOUND',
      application: 'Test App 2',
      processed_flow_type: 'ALERTING',
      description: 'Test Description 2'
    },
    {
      id: '3',
      alias: 'Test Partner 3',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'Test App 3',
      processed_flow_type: 'NOTIFICATION',
      description: 'Test Description 3'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PartnersListComponent,
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartnersListComponent);
    component = fixture.componentInstance;
    component.partners = [...mockPartners];
    component.filterPartners();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.searchTerm).toBe('');
    expect(component.selectedDirection).toBe('');
    expect(component.selectedFlowType).toBe('');
    expect(component.filteredPartners).toEqual(mockPartners);
  });

  it('should filter partners by search term', () => {
    component.searchTerm = 'Test Partner 1';
    component.filterPartners();
    
    expect(component.filteredPartners.length).toBe(1);
    expect(component.filteredPartners[0].id).toBe('1');
  });

  it('should filter partners by direction', () => {
    component.selectedDirection = 'INBOUND';
    component.filterPartners();
    
    expect(component.filteredPartners.length).toBe(2);
    expect(component.filteredPartners.every(p => p.direction === 'INBOUND')).toBe(true);
  });

  it('should filter partners by flow type', () => {
    component.selectedFlowType = 'MESSAGE';
    component.filterPartners();
    
    expect(component.filteredPartners.length).toBe(1);
    expect(component.filteredPartners[0].processed_flow_type).toBe('MESSAGE');
  });

  it('should filter partners by multiple criteria', () => {
    component.searchTerm = 'Test';
    component.selectedDirection = 'INBOUND';
    component.selectedFlowType = 'NOTIFICATION';
    component.filterPartners();
    
    expect(component.filteredPartners.length).toBe(1);
    expect(component.filteredPartners[0].id).toBe('3');
  });

  it('should return correct direction badge class', () => {
    expect(component.getDirectionBadgeClass('INBOUND')).toBe('bg-green-100 text-green-800');
    expect(component.getDirectionBadgeClass('OUTBOUND')).toBe('bg-blue-100 text-blue-800');
  });

  it('should return correct flow type badge class', () => {
    expect(component.getFlowTypeBadgeClass('MESSAGE')).toBe('bg-purple-100 text-purple-800');
    expect(component.getFlowTypeBadgeClass('ALERTING')).toBe('bg-red-100 text-red-800');
    expect(component.getFlowTypeBadgeClass('NOTIFICATION')).toBe('bg-yellow-100 text-yellow-800');
    expect(component.getFlowTypeBadgeClass('UNKNOWN')).toBe('bg-gray-100 text-gray-800');
  });

  it('should have correct direction options', () => {
    expect(component.directions).toEqual([
      { value: '', label: 'Tous' },
      { value: 'INBOUND', label: 'Entrant' },
      { value: 'OUTBOUND', label: 'Sortant' }
    ]);
  });

  it('should have correct flow type options', () => {
    expect(component.flowTypes).toEqual([
      { value: '', label: 'Tous' },
      { value: 'MESSAGE', label: 'Message' },
      { value: 'ALERTING', label: 'Alerte' },
      { value: 'NOTIFICATION', label: 'Notification' }
    ]);
  });

  it('should update filtered partners when input changes', () => {
    const newPartners: IPartner[] = [
      {
        id: '4',
        alias: 'New Partner',
        type: 'INBOUND',
        direction: 'INBOUND',
        application: 'New App',
        processed_flow_type: 'MESSAGE',
        description: 'New Description'
      }
    ];

    component.partners = newPartners;
    component.ngOnChanges({
      partners: {
        currentValue: newPartners,
        previousValue: mockPartners,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.filteredPartners).toEqual(newPartners);
  });
});
