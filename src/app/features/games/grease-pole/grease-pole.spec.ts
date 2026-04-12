import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreasePole } from './grease-pole';

describe('GreasePole', () => {
  let component: GreasePole;
  let fixture: ComponentFixture<GreasePole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreasePole],
    }).compileComponents();

    fixture = TestBed.createComponent(GreasePole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
