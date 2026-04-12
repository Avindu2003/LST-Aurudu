import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pancha } from './pancha';

describe('Pancha', () => {
  let component: Pancha;
  let fixture: ComponentFixture<Pancha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pancha],
    }).compileComponents();

    fixture = TestBed.createComponent(Pancha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
