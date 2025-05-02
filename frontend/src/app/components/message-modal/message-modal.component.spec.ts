import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageModalComponent } from './message-modal.component';
import { FormsModule, NgForm } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('MessageModalComponent', () => {
  let component: MessageModalComponent;
  let fixture: ComponentFixture<MessageModalComponent>;

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
        MessageModalComponent,
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageModalComponent);
    component = fixture.componentInstance;
    component.partners = [...mockPartners];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.selectedPartnerId).toBe('');
    expect(component.content).toBe('');
  });

  it('should emit close event', () => {
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onClose();
    
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit message sent event with form data when form is valid', () => {
    const mockForm = {
      valid: true,
      resetForm: jest.fn(),
      reset: jest.fn()
    } as NgForm;

    const expectedMessageData = {
      content: 'Test Message',
      partnerId: '1'
    };

    component.content = expectedMessageData.content;
    component.selectedPartnerId = expectedMessageData.partnerId;
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit(mockForm);
    
    expect(messageSentSpy).toHaveBeenCalledWith(expectedMessageData);
    expect(closeSpy).toHaveBeenCalled();
    expect(mockForm.resetForm).toHaveBeenCalled();
  });

  it('should not emit message sent event when form is invalid', () => {
    const mockForm = {
      valid: false,
      resetForm: jest.fn(),
      reset: jest.fn()
    } as NgForm;

    const expectedMessageData = {
      content: 'Test Message',
      partnerId: '1'
    };

    component.content = expectedMessageData.content;
    component.selectedPartnerId = expectedMessageData.partnerId;
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit(mockForm);
    
    expect(messageSentSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not emit message sent event when partner is not selected', () => {
    const mockForm = {
      valid: true,
      resetForm: jest.fn(),
      reset: jest.fn()
    } as NgForm;

    component.content = 'Test Message';
    component.selectedPartnerId = '';
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit(mockForm);
    
    expect(messageSentSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not emit message sent event when content is empty', () => {
    const mockForm = {
      valid: true,
      resetForm: jest.fn(),
      reset: jest.fn()
    } as NgForm;

    component.content = '';
    component.selectedPartnerId = '1';
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit(mockForm);
    
    expect(messageSentSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });
}); 