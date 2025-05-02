import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { MessageService } from '../../services/message.service';
import { PartnerService } from '../../services/partner.service';
import { IMessage } from '@shared/interfaces/message.interface';
import { IPartner } from '@shared/interfaces/partner.interface';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageService: MessageService;
  let partnerService: PartnerService;

  const mockMessages: IMessage[] = [
    {
      id: '1',
      content: 'Test Message 1',
      partnerId: '1',
      timestamp: new Date(),
      status: 'PENDING'
    },
    {
      id: '2',
      content: 'Test Message 2',
      partnerId: '2',
      timestamp: new Date(),
      status: 'PROCESSED'
    }
  ];

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
        MessagesComponent
      ],
      providers: [
        MessageService,
        PartnerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    partnerService = TestBed.inject(PartnerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load messages and partners on init', () => {
    jest.spyOn(messageService, 'getAllMessages').mockReturnValue(of(mockMessages));
    jest.spyOn(partnerService, 'getAllPartners').mockReturnValue(of(mockPartners));
    
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.messages).toEqual(mockMessages);
    expect(component.partners).toEqual(mockPartners);
    expect(component.totalMessages).toBe(2);
  });

  it('should open and close modal', () => {
    expect(component.isModalOpen).toBe(false);
    
    component.openModal();
    expect(component.isModalOpen).toBe(true);
    
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

  it('should send a message', () => {
    const newMessage: Omit<IMessage, 'id' | 'timestamp' | 'status'> = {
      content: 'New Message',
      partnerId: '1'
    };

    const createdMessage: IMessage = {
      id: '3',
      content: newMessage.content,
      partnerId: newMessage.partnerId,
      timestamp: new Date(),
      status: 'PENDING'
    };

    jest.spyOn(messageService, 'sendMessage').mockReturnValue(of(createdMessage));
    component.messages = [...mockMessages];
    component.totalMessages = 2;
    component.isModalOpen = true;

    component.onMessageSent(newMessage);

    expect(component.messages).toContain(createdMessage);
    expect(component.totalMessages).toBe(3);
  });
});
