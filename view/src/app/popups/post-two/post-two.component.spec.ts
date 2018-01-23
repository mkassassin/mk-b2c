import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTwoComponent } from './post-two.component';

describe('PostTwoComponent', () => {
  let component: PostTwoComponent;
  let fixture: ComponentFixture<PostTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
