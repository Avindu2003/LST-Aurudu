import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TugOfWar } from './tug-of-war';

describe('TugOfWar', () => {
  let component: TugOfWar;
  let fixture: ComponentFixture<TugOfWar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TugOfWar],
    }).compileComponents();

    fixture = TestBed.createComponent(TugOfWar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
