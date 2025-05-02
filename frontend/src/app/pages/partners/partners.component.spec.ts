import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnersComponent } from './partners.component';
import { PartnerService } from '../../services/partner.service';
import { IPartner } from '@shared/interfaces/partner.interface';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PartnersComponent', () => {
  let component: PartnersComponent;
  let fixture: ComponentFixture<PartnersComponent>;
  let partnerService: PartnerService;

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
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PartnersComponent
      ],
      providers: [
        PartnerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartnersComponent);
    component = fixture.componentInstance;
    partnerService = TestBed.inject(PartnerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load partners on init', () => {
    jest.spyOn(partnerService, 'getAllPartners').mockReturnValue(of(mockPartners));
    
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.partners).toEqual(mockPartners);
    expect(component.totalPartners).toBe(2);
  });


  it('should open and close modal', () => {
    expect(component.isModalOpen).toBe(false);
    
    component.openModal();
    expect(component.isModalOpen).toBe(true);
    
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

  it('should create a new partner', () => {
    const newPartner: Omit<IPartner, 'id'> = {
      alias: 'New Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'New App',
      processed_flow_type: 'MESSAGE',
      description: 'New Description'
    };

    const createdPartner: IPartner = {
      id: '3',
      ...newPartner
    };

    jest.spyOn(partnerService, 'createPartner').mockReturnValue(of(createdPartner));
    component.partners = [...mockPartners];
    component.totalPartners = 2;
    component.isModalOpen = true;

    component.onCreatePartner(newPartner);

    expect(component.partners).toContain(createdPartner);
    expect(component.totalPartners).toBe(3);
    expect(component.isModalOpen).toBe(false);
  });
});
