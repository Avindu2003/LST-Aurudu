import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-kana-mutti',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="කණා මුට්ටි බිඳීම" category="Luck & Skill" 
      [rules]="['මුට්ටි 3ක් වේගයෙන් එහා මෙහා වේ.', 'එක් මුට්ටියක පමණක් රුපියල් 5000ක් ඇත.', 'නිවැරදි මුට්ටිය තෝරා පහර දෙන්න.']">
      
      <div class="relative w-full h-[400px] flex items-center justify-around overflow-hidden bg-gradient-to-b from-sky-900/20 to-amber-900/20 rounded-[3rem] border-2 border-white/5">
        
        <div class="absolute top-0 left-0 w-full h-20 flex justify-around opacity-30">
          <div class="w-1 h-full bg-yellow-900"></div>
          <div class="w-1 h-full bg-yellow-900"></div>
          <div class="w-1 h-full bg-yellow-900"></div>
        </div>

        <div (click)="breakPot(0)" 
             class="pot-container" [class.animate-bounce]="!gameOver()">
          <div class="text-7xl cursor-pointer hover:scale-110 transition-all drop-shadow-2xl">
            {{ pots()[0].broken ? pots()[0].content : '🏺' }}
          </div>
        </div>

        <div (click)="breakPot(1)" 
             class="pot-container" [class.animate-bounce]="!gameOver()">
          <div class="text-7xl cursor-pointer hover:scale-110 transition-all drop-shadow-2xl">
            {{ pots()[1].broken ? pots()[1].content : '🏺' }}
          </div>
        </div>

        <div (click)="breakPot(2)" 
             class="pot-container" [class.animate-bounce]="!gameOver()">
          <div class="text-7xl cursor-pointer hover:scale-110 transition-all drop-shadow-2xl">
            {{ pots()[2].broken ? pots()[2].content : '🏺' }}
          </div>
        </div>

        <div *ngIf="gameOver()" class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-md z-10">
          <h2 class="text-4xl font-black mb-4 animate-tada">{{ status() }}</h2>
          <button (click)="reset()" class="btn-primary bg-yellow-600 px-10">නැවත උත්සාහ කරන්න</button>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">ඔබේ වාරය</p>
        <p class="text-2xl font-bold text-white">පහර දීමට මුට්ටියක් තෝරන්න! 🪵</p>
      </div>
    </app-game-layout>
  `,
  styles: [`
    .pot-container {
      @apply transition-all duration-500;
      animation-duration: 2s !important;
    }
    @keyframes tada {
      0% { transform: scale(1); }
      10%, 20% { transform: scale(0.9) rotate(-3deg); }
      30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
      40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
      100% { transform: scale(1) rotate(0); }
    }
    .animate-tada {
      animation: tada 1s ease-in-out;
    }
  `]
})
export class KanaMutti {
  pots = signal([
    { broken: false, content: '💦' },
    { broken: false, content: '💦' },
    { broken: false, content: '💰' }
  ]);
  gameOver = signal(false);
  status = signal('');

  constructor() {
    this.reset();
  }

  reset() {
    const contents = ['💦', '💦', '💰'].sort(() => Math.random() - 0.5);
    this.pots.set(contents.map(c => ({ broken: false, content: c })));
    this.gameOver.set(false);
    this.status.set('');
  }

  breakPot(index: number) {
    if (this.gameOver()) return;

    const currentPots = [...this.pots()];
    currentPots[index].broken = true;
    this.pots.set(currentPots);
    this.gameOver.set(true);

    if (currentPots[index].content === '💰') {
      this.status.set('🏆 ජයග්‍රහණයයි! ඔබට රු. 5000 ලැබුණා!');
    } else {
      this.status.set('💦 අයියෝ වතුර! මුට්ටිය හිස්.');
    }
  }
}