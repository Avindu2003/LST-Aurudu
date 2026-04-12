import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sweeper } from './sweeper';

describe('Sweeper', () => {
  let component: Sweeper;
  let fixture: ComponentFixture<Sweeper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sweeper],
    }).compileComponents();

    fixture = TestBed.createComponent(Sweeper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
