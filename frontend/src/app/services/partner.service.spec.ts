import { TestBed } from '@angular/core/testing';
import {HttpTestingController } from '@angular/common/http/testing';
import { PartnerService } from './partner.service';
import { Partner } from './partner.service';

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
    const mockPartners: Partner[] = [
      { id: '1', name: 'Test Partner', email: 'test@example.com', createdAt: new Date() }
    ];

    service.getAllPartners().subscribe(partners => {
      expect(partners).toEqual(mockPartners);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners');
    expect(req.request.method).toBe('GET');
    req.flush(mockPartners);
  });

  it('should get partner by id', () => {
    const mockPartner: Partner = {
      id: '1',
      name: 'Test Partner',
      email: 'test@example.com',
      createdAt: new Date()
    };

    service.getPartnerById('1').subscribe(partner => {
      expect(partner).toEqual(mockPartner);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/partners/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPartner);
  });

  it('should create a partner', () => {
    const newPartner = {
      name: 'New Partner',
      email: 'new@example.com'
    };

    const mockPartner: Partner = {
      id: '1',
      ...newPartner,
      createdAt: new Date()
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