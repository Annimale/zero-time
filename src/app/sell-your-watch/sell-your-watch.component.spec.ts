import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellYourWatchComponent } from './sell-your-watch.component';

describe('SellYourWatchComponent', () => {
  let component: SellYourWatchComponent;
  let fixture: ComponentFixture<SellYourWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellYourWatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellYourWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
