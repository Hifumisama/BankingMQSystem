import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonTheme, ButtonSize } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.theme).toBe('primary');
    expect(component.size).toBe('large');
    expect(component.disabled).toBe(false);
    expect(component.type).toBe('button');
  });

  it('should emit clicked event when clicked and not disabled', () => {
    const clickSpy = jest.spyOn(component.clicked, 'emit');
    
    component.onClick();
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not emit clicked event when disabled', () => {
    const clickSpy = jest.spyOn(component.clicked, 'emit');
    component.disabled = true;
    
    component.onClick();
    
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should apply correct classes for primary theme', () => {
    component.theme = 'primary';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('bg-blue-600');
    expect(classes).toContain('hover:bg-blue-700');
    expect(classes).toContain('text-white');
    expect(classes).toContain('focus:ring-blue-500');
  });

  it('should apply correct classes for secondary theme', () => {
    component.theme = 'secondary';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('bg-gray-200');
    expect(classes).toContain('hover:bg-gray-300');
    expect(classes).toContain('text-gray-800');
    expect(classes).toContain('focus:ring-gray-500');
  });

  it('should apply correct classes for agreed theme', () => {
    component.theme = 'agreed';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('bg-green-600');
    expect(classes).toContain('hover:bg-green-700');
    expect(classes).toContain('text-white');
    expect(classes).toContain('focus:ring-green-500');
  });

  it('should apply correct classes for denied theme', () => {
    component.theme = 'denied';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('bg-red-600');
    expect(classes).toContain('hover:bg-red-700');
    expect(classes).toContain('text-white');
    expect(classes).toContain('focus:ring-red-500');
  });

  it('should apply correct classes for small size', () => {
    component.size = 'small';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('px-3');
    expect(classes).toContain('py-1.5');
    expect(classes).toContain('text-sm');
  });

  it('should apply correct classes for large size', () => {
    component.size = 'large';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('px-4');
    expect(classes).toContain('py-2');
    expect(classes).toContain('text-base');
  });

  it('should apply correct classes for extra-large size', () => {
    component.size = 'extra-large';
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('px-8');
    expect(classes).toContain('py-3');
    expect(classes).toContain('text-lg');
    expect(classes).toContain('w-[200px]');
  });

  it('should apply disabled classes when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const classes = component.buttonClasses;
    expect(classes).toContain('opacity-50');
    expect(classes).toContain('cursor-not-allowed');
  });
});
