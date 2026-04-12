import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoContest } from './photo-contest';

describe('PhotoContest', () => {
  let component: PhotoContest;
  let fixture: ComponentFixture<PhotoContest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoContest],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoContest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
