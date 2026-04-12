import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElephantEye } from './elephant-eye';

describe('ElephantEye', () => {
  let component: ElephantEye;
  let fixture: ComponentFixture<ElephantEye>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElephantEye],
    }).compileComponents();

    fixture = TestBed.createComponent(ElephantEye);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
