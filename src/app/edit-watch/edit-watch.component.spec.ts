import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWatchComponent } from './edit-watch.component';

describe('EditWatchComponent', () => {
  let component: EditWatchComponent;
  let fixture: ComponentFixture<EditWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
