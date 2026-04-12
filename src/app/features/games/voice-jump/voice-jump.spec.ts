import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceJump } from './voice-jump';

describe('VoiceJump', () => {
  let component: VoiceJump;
  let fixture: ComponentFixture<VoiceJump>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceJump],
    }).compileComponents();

    fixture = TestBed.createComponent(VoiceJump);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
