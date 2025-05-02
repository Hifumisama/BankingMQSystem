import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PartnerService } from './partner.service';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('PartnerService', () => {
  let service: PartnerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PartnerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PartnerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all partners', () => {
    const mockPartners: IPartner[] = [
      { 
        id: '1', 
        alias: 'Test Partner', 
        type: 'INBOUND', 
        direction: 'INBOUND', 
        application: 'Test Partner', 
        processed_flow_type: 'MESSAGE', 
        description: 'Test Partner'
      }
    ];

    service.getAllPartners().subscribe(partners => {
      expect(partners).toEqual(mockPartners);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    expect(req.request.method).toBe('GET');
    req.flush(mockPartners);
  });

  it('should handle error when getting all partners', () => {
    const errorMessage = 'Error fetching partners';
    
    service.getAllPartners().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should get partner by id', () => {
    const mockPartner: IPartner = {
      id: '1',
      alias: 'Test Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'Test Partner',
      processed_flow_type: 'MESSAGE',
      description: 'Test Partner'
    };

    service.getPartnerById('1').subscribe(partner => {
      expect(partner).toEqual(mockPartner);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPartner);
  });

  it('should handle error when getting partner by id', () => {
    const errorMessage = 'Partner not found';
    
    service.getPartnerById('999').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners/999');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should create a partner', () => {
    const newPartner: Omit<IPartner, 'id'> = {
      alias: 'New Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'New Partner',
      processed_flow_type: 'MESSAGE',
      description: 'New Partner'
    };

    const mockPartner: IPartner = {
      id: '1',
      ...newPartner
    };

    service.createPartner(newPartner).subscribe(partner => {
      expect(partner).toEqual(mockPartner);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPartner);
    req.flush(mockPartner);
  });

  it('should handle error when creating partner', () => {
    const newPartner: Omit<IPartner, 'id'> = {
      alias: 'New Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'New Partner',
      processed_flow_type: 'MESSAGE',
      description: 'New Partner'
    };

    const errorMessage = 'Invalid partner data';
    
    service.createPartner(newPartner).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
}); 