import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageListComponent } from './message-list.component';
import { FormsModule } from '@angular/forms';
import { IMessage } from '@shared/interfaces/message.interface';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;

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
    },
    {
      id: '3',
      content: 'Another Message',
      partnerId: '1',
      timestamp: new Date(),
      status: 'ERROR'
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
        MessageListComponent,
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    component.messages = [...mockMessages];
    component.partners = [...mockPartners];
    component.filterMessages();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.searchTerm).toBe('');
    expect(component.selectedPartnerId).toBe('');
    expect(component.filteredMessages).toEqual(mockMessages);
  });

  it('should filter messages by search term', () => {
    component.searchTerm = 'Test Message';
    component.filterMessages();
    
    expect(component.filteredMessages.length).toBe(2);
    expect(component.filteredMessages.every(m => m.content.includes('Test Message'))).toBe(true);
  });

  it('should filter messages by partner', () => {
    component.selectedPartnerId = '1';
    component.filterMessages();
    
    expect(component.filteredMessages.length).toBe(2);
    expect(component.filteredMessages.every(m => m.partnerId === '1')).toBe(true);
  });

  it('should filter messages by multiple criteria', () => {
    component.searchTerm = 'Test';
    component.selectedPartnerId = '1';
    component.filterMessages();
    
    expect(component.filteredMessages.length).toBe(1);
    expect(component.filteredMessages[0].id).toBe('1');
  });

  it('should get partner name', () => {
    expect(component.getPartnerName('1')).toBe('Test Partner 1');
    expect(component.getPartnerName('2')).toBe('Test Partner 2');
    expect(component.getPartnerName('999')).toBe('Unknown Partner');
  });

  it('should format date', () => {
    const date = new Date('2023-01-01T12:00:00');
    const formattedDate = component.formatDate(date);
    
    expect(formattedDate).toBe(date.toLocaleString());
  });

  it('should update filtered messages when messages input changes', () => {
    const newMessages: IMessage[] = [
      {
        id: '4',
        content: 'New Message',
        partnerId: '1',
        timestamp: new Date(),
        status: 'PENDING'
      }
    ];

    component.messages = newMessages;
    component.ngOnChanges({
      messages: {
        currentValue: newMessages,
        previousValue: mockMessages,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.filteredMessages).toEqual(newMessages);
  });

  it('should update filtered messages when partners input changes', () => {
    const newPartners: IPartner[] = [
      {
        id: '3',
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

    expect(component.filteredMessages).toEqual(mockMessages);
  });
});
