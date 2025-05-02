import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageModalComponent } from './message-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
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
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageModalComponent);
    component = fixture.componentInstance;
    component.partners = [...mockPartners];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isOpen).toBe(false);
    expect(component.messageForm.get('partnerId')?.value).toBe(null);
    expect(component.messageForm.get('content')?.value).toBe(null);
  });

  it('should emit close event', () => {
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onClose();
    
    expect(closeSpy).toHaveBeenCalled();
    expect(component.messageForm.get('partnerId')?.value).toBe(null);
    expect(component.messageForm.get('content')?.value).toBe(null);
  });

  it('should emit message sent event with form data when form is valid', () => {
    const expectedMessageData = {
      content: 'Test Message',
      partnerId: '1'
    };

    component.messageForm.patchValue(expectedMessageData);
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit();
    
    expect(messageSentSpy).toHaveBeenCalledWith(expectedMessageData);
    expect(closeSpy).toHaveBeenCalled();
    expect(component.messageForm.get('partnerId')?.value).toBe(null);
    expect(component.messageForm.get('content')?.value).toBe(null);
  });

  it('should not emit message sent event when form is invalid', () => {
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit();
    
    expect(messageSentSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not emit message sent event when partner is not selected', () => {
    component.messageForm.patchValue({
      content: 'Test Message',
      partnerId: ''
    });
    
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit();
    
    expect(messageSentSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not emit message sent event when content is empty', () => {
    component.messageForm.patchValue({
      content: '',
      partnerId: '1'
    });
    
    const messageSentSpy = jest.spyOn(component.messageSent, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');
    
    component.onSubmit();
    
    expect(messageSentSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });
}); 