import { TestBed } from '@angular/core/testing';
import {HttpTestingController } from '@angular/common/http/testing';
import { PartnerService } from './partner.service';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('PartnerService', () => {
  let service: PartnerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PartnerService]
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
      { id: '1', alias: 'Test Partner', type: 'INBOUND', direction: 'INBOUND', application: 'Test Partner', processed_flow_type: 'MESSAGE', description: 'Test Partner' }
    ];

    service.getAllPartners().subscribe(partners => {
      expect(partners).toEqual(mockPartners);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    expect(req.request.method).toBe('GET');
    req.flush(mockPartners);
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

  it('should create a partner', () => {
    const newPartner: IPartner = {
      id: '1',
      alias: 'New Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'New Partner',
      processed_flow_type: 'MESSAGE',
      description: 'New Partner'
    };

    const mockPartner: IPartner = {
      id: '1',
      alias: 'New Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'New Partner',
      processed_flow_type: 'MESSAGE',
      description: 'New Partner'
    };

    service.createPartner(newPartner).subscribe(partner => {
      expect(partner).toEqual(mockPartner);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPartner);
    req.flush(mockPartner);
  });

  it('should delete a partner', () => {
    service.deletePartner('1').subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 