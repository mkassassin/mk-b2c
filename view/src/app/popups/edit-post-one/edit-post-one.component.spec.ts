import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostOneComponent } from './edit-post-one.component';

describe('EditPostOneComponent', () => {
  let component: EditPostOneComponent;
  let fixture: ComponentFixture<EditPostOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPostOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
