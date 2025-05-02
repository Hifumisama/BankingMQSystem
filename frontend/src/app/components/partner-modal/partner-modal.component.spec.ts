import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerModalComponent } from './partner-modal.component';
import { FormsModule, NgForm } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('PartnerModalComponent', () => {
  let component: PartnerModalComponent;
  let fixture: ComponentFixture<PartnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PartnerModalComponent,
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.formData).toEqual({
      alias: '',
      type: '',
      direction: 'INBOUND',
      application: '',
      processed_flow_type: 'MESSAGE',
      description: ''
    });
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    
    component.onClose();
    
    expect(component.close.emit).toHaveBeenCalled();
    expect(component.formData).toEqual({
      alias: '',
      type: '',
      direction: 'INBOUND',
      application: '',
      processed_flow_type: 'MESSAGE',
      description: ''
    });
  });

  it('should emit createPartner event with form data when form is valid', () => {
    const mockForm = {
      valid: true
    } as NgForm;

    const expectedPartnerData: Omit<IPartner, 'id' | 'createdAt'> = {
      alias: 'Test Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'Test App',
      processed_flow_type: 'MESSAGE',
      description: 'Test Description'
    };

    component.formData = { ...expectedPartnerData };
    spyOn(component.createPartner, 'emit');
    
    component.onSubmit(mockForm);
    
    expect(component.createPartner.emit).toHaveBeenCalledWith(expectedPartnerData);
    expect(component.formData).toEqual({
      alias: '',
      type: '',
      direction: 'INBOUND',
      application: '',
      processed_flow_type: 'MESSAGE',
      description: ''
    });
  });

  it('should not emit createPartner event when form is invalid', () => {
    const mockForm = {
      valid: false
    } as NgForm;

    const expectedPartnerData: Omit<IPartner, 'id' | 'createdAt'> = {
      alias: 'Test Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'Test App',
      processed_flow_type: 'MESSAGE',
      description: 'Test Description'
    };

    component.formData = { ...expectedPartnerData };
    spyOn(component.createPartner, 'emit');
    
    component.onSubmit(mockForm);
    
    expect(component.createPartner.emit).not.toHaveBeenCalled();
    expect(component.formData).toEqual(expectedPartnerData);
  });

  it('should have correct direction options', () => {
    expect(component.directions).toEqual([
      { value: 'INBOUND', label: 'Entrant' },
      { value: 'OUTBOUND', label: 'Sortant' }
    ]);
  });

  it('should have correct flow type options', () => {
    expect(component.flowTypes).toEqual([
      { value: 'MESSAGE', label: 'Message' },
      { value: 'ALERTING', label: 'Alerte' },
      { value: 'NOTIFICATION', label: 'Notification' }
    ]);
  });
});
