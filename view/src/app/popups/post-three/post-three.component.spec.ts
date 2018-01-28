import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostThreeComponent } from './post-three.component';

describe('PostThreeComponent', () => {
  let component: PostThreeComponent;
  let fixture: ComponentFixture<PostThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
