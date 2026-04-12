import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchGame } from './catch-game';

describe('CatchGame', () => {
  let component: CatchGame;
  let fixture: ComponentFixture<CatchGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatchGame],
    }).compileComponents();

    fixture = TestBed.createComponent(CatchGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
