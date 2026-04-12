import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Raban } from './raban';

describe('Raban', () => {
  let component: Raban;
  let fixture: ComponentFixture<Raban>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Raban],
    }).compileComponents();

    fixture = TestBed.createComponent(Raban);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
