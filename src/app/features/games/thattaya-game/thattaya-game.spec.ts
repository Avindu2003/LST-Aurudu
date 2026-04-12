import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThattayaGame } from './thattaya-game';

describe('ThattayaGame', () => {
  let component: ThattayaGame;
  let fixture: ComponentFixture<ThattayaGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThattayaGame],
    }).compileComponents();

    fixture = TestBed.createComponent(ThattayaGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
