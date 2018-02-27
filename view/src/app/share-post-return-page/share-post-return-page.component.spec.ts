import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePostReturnPageComponent } from './share-post-return-page.component';

describe('SharePostReturnPageComponent', () => {
  let component: SharePostReturnPageComponent;
  let fixture: ComponentFixture<SharePostReturnPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePostReturnPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePostReturnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
