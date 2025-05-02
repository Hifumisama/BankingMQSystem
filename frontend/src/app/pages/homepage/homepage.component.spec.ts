import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { Router } from '@angular/router';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomepageComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to messages page', () => {
    jest.spyOn(router, 'navigate');
    
    component.navigateToMessages();
    
    expect(router.navigate).toHaveBeenCalledWith(['/messages']);
  });

  it('should navigate to partners page', () => {
    jest.spyOn(router, 'navigate');
    
    component.navigateToPartners();
    
    expect(router.navigate).toHaveBeenCalledWith(['/partners']);
  });
});
