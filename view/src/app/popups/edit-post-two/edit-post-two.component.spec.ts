import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostTwoComponent } from './edit-post-two.component';

describe('EditPostTwoComponent', () => {
  let component: EditPostTwoComponent;
  let fixture: ComponentFixture<EditPostTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPostTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
