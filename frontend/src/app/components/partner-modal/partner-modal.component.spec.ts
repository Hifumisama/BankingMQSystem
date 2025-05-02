import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerModalComponent } from './partner-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IPartner } from '@shared/interfaces/partner.interface';

describe('PartnerModalComponent', () => {
  let component: PartnerModalComponent;
  let fixture: ComponentFixture<PartnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PartnerModalComponent,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isOpen).toBe(false);
    expect(component.partnerForm.get('alias')?.value).toBe('');
    expect(component.partnerForm.get('type')?.value).toBe('');
    expect(component.partnerForm.get('direction')?.value).toBe('INBOUND');
    expect(component.partnerForm.get('application')?.value).toBe('');
    expect(component.partnerForm.get('processed_flow_type')?.value).toBe('MESSAGE');
    expect(component.partnerForm.get('description')?.value).toBe('');
  });

  it('should emit close event', () => {
    const closeSpy = jest.spyOn(component.close, 'emit');
    
    component.onClose();
    
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit createPartner event with form data when form is valid', () => {
    const expectedPartnerData: Omit<IPartner, 'id' | 'createdAt'> = {
      alias: 'Test Partner',
      type: 'INBOUND',
      direction: 'INBOUND',
      application: 'Test App',
      processed_flow_type: 'MESSAGE',
      description: 'Test Description'
    };

    component.partnerForm.patchValue(expectedPartnerData);
    const createPartnerSpy = jest.spyOn(component.createPartner, 'emit');
    
    component.onSubmit();
    
    expect(createPartnerSpy).toHaveBeenCalledWith(expectedPartnerData);
  });

  it('should not emit createPartner event when form is invalid', () => {
    const createPartnerSpy = jest.spyOn(component.createPartner, 'emit');
    
    component.onSubmit();
    
    expect(createPartnerSpy).not.toHaveBeenCalled();
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
