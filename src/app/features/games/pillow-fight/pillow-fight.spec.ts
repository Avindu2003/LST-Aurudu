import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillowFight } from './pillow-fight';

describe('PillowFight', () => {
  let component: PillowFight;
  let fixture: ComponentFixture<PillowFight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillowFight],
    }).compileComponents();

    fixture = TestBed.createComponent(PillowFight);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
