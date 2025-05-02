import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { IMessage } from '@shared/interfaces/message.interface';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all messages', () => {
    const mockMessages: IMessage[] = [
      { id: '1', content: 'Test message', partnerId: '1', timestamp: new Date(), status: 'PENDING' }
    ];

    service.getAllMessages().subscribe(messages => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages');
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('should handle error when getting all messages', () => {
    const errorMessage = 'Error fetching messages';
    
    service.getAllMessages().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should get message by id', () => {
    const mockMessage: IMessage = {
      id: '1',
      content: 'Test message',
      partnerId: '1',
      timestamp: new Date(),
      status: 'PENDING'
    };

    service.getMessageById('1').subscribe(message => {
      expect(message).toEqual(mockMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMessage);
  });

  it('should handle error when getting message by id', () => {
    const errorMessage = 'Message not found';
    
    service.getMessageById('999').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/999');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should send a message', () => {
    const mockMessage: IMessage = {
      id: '1',
      content: 'Test message',
      partnerId: '1',
      timestamp: new Date(),
      status: 'PENDING'
    };

    service.sendMessage('Test message', '1').subscribe(message => {
      expect(message).toEqual(mockMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/send');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'Test message', partnerId: '1' });
    req.flush(mockMessage);
  });

  it('should handle error when sending message', () => {
    const errorMessage = 'Failed to send message';
    
    service.sendMessage('Test message', '1').subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/send');
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });

  it('should receive a message', () => {
    const mockMessage: IMessage = {
      id: '1',
      content: 'Test message',
      partnerId: '1',
      timestamp: new Date(),
      status: 'PENDING'
    };

    service.receiveMessage().subscribe(message => {
      expect(message).toEqual(mockMessage);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/receive');
    expect(req.request.method).toBe('GET');
    req.flush(mockMessage);
  });

  it('should handle null response when receiving message', () => {
    service.receiveMessage().subscribe(message => {
      expect(message).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/receive');
    req.flush(null);
  });

  it('should get messages by partner', () => {
    const mockMessages: IMessage[] = [
      { id: '1', content: 'Test message', partnerId: '1', timestamp: new Date(), status: 'PENDING' }
    ];

    service.getMessagesByPartner('1').subscribe(messages => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/partner/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('should handle error when getting messages by partner', () => {
    const errorMessage = 'Partner not found';
    
    service.getMessagesByPartner('999').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/messages/partner/999');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
}); 