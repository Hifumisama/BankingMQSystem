import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerModalComponent } from './partner-modal.component';

describe('PartnerModalComponent', () => {
  let component: PartnerModalComponent;
  let fixture: ComponentFixture<PartnerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
