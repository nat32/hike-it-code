import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHikeComponent } from './edit-hike.component';

describe('EditHikeComponent', () => {
  let component: EditHikeComponent;
  let fixture: ComponentFixture<EditHikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditHikeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
