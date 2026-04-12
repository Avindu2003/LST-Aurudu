import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanaMutti } from './kana-mutti';

describe('KanaMutti', () => {
  let component: KanaMutti;
  let fixture: ComponentFixture<KanaMutti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanaMutti],
    }).compileComponents();

    fixture = TestBed.createComponent(KanaMutti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
