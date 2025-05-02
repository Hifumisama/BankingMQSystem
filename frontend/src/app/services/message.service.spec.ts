import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { IMessage } from '@shared/interfaces/message.interface';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MessageService]
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
}); 