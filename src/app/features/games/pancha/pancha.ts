import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-pancha',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="පංච දැමීම" category="Live Multi" 
      [rules]="['බෙල්ලන් 6ක් එකවර දැමිය යුතුය.', 'උඩු අතට වැටෙන බෙල්ලන් ගණන ඔබේ ලකුණු වේ.', 'පංච (5) හෝ හය (6) වැටුණහොත් තවත් අවස්ථාවක් හිමිවේ.']">
      
      <div class="flex flex-col items-center justify-center py-6">
        
        <div class="grid grid-cols-3 gap-6 md:gap-10 mb-12 p-10 bg-yellow-900/20 rounded-[3rem] border-2 border-yellow-600/30 shadow-inner">
          <div *ngFor="let shell of shells(); let i = index" 
               class="text-6xl md:text-8xl transition-all duration-500 transform"
               [class.rotate-x-180]="!shell" 
               [class.scale-110]="rolling()"
               [style.transition-delay.ms]="i * 50">
            <span class="drop-shadow-2xl inline-block">{{ shell ? '🐚' : '🕳️' }}</span>
          </div>
        </div>

        <div class="text-center mb-10">
          <p class="text-zinc-500 uppercase tracking-[0.3em] text-xs font-bold mb-2">දැනට ලැබුණු ලකුණු</p>
          <div class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600 drop-shadow-lg">
            {{ lastRoll() }}
          </div>
          <p *ngIf="extraTurn()" class="text-green-500 font-bold mt-2 animate-bounce">🔥 තවත් අවස්ථාවක් හිමිවිය!</p>
        </div>

        <div class="glass-panel px-10 py-4 mb-8 border border-white/5 flex items-center gap-4">
          <span class="text-zinc-400 font-bold uppercase text-xs">මුළු ලකුණු:</span>
          <span class="text-3xl font-black text-white">{{ totalScore() }}</span>
        </div>

        <button [disabled]="rolling()" 
                (click)="roll()" 
                class="btn-primary bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-16 py-5 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.3)] disabled:opacity-50">
          {{ rolling() ? 'බෙල්ලන් දමමින්...' : 'පංච දාන්න 🎲' }}
        </button>
      </div>
    </app-game-layout>
  `,
  styles: [`
    .rotate-x-180 {
      transform: rotateX(180deg) scale(0.9);
      opacity: 0.6;
    }
  `]
})
export class Pancha {
  shells = signal<boolean[]>([true, true, true, true, true, true]); 
  lastRoll = signal(0);
  totalScore = signal(0);
  extraTurn = signal(false);
  rolling = signal(false);

  roll() {
    this.rolling.set(true);
    this.extraTurn.set(false);

    setTimeout(() => {
      const newRoll = Array.from({ length: 6 }, () => Math.random() > 0.5);
      this.shells.set(newRoll);
      
      const upCount = newRoll.filter(x => x).length;
      let rollValue = upCount;

      if (upCount === 0) {
        rollValue = 6;
        this.extraTurn.set(true);
      } else if (upCount === 5 || upCount === 6) {
        this.extraTurn.set(true);
      }

      this.lastRoll.set(rollValue);
      this.totalScore.update(s => s + rollValue);
      this.rolling.set(false);
    }, 800);
  }
}