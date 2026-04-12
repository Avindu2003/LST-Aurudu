import { Component, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-tug-of-war',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="ඩිජිටල් කඹ ඇදීම" category="Team Battle" 
      [rules]="['වමේ සහ දකුණේ Arrow Keys මාරුවෙන් මාරුවට වේගයෙන් ඔබන්න.', 'මැද ඇති රතු ලකුණ ඔබේ සීමාවට ගෙන එන්න.', 'ප්‍රතිවාදියාට පෙර කඹය ඇද ජයග්‍රහණය කරන්න!']">
      
      <div class="flex flex-col items-center justify-center py-12">
        
        <div class="relative w-full h-32 flex items-center justify-center mb-16 bg-zinc-900/30 rounded-full border border-white/5">
          
          <div class="absolute w-full h-2 bg-gradient-to-r from-yellow-800 via-yellow-600 to-yellow-800 shadow-xl"></div>
          
          <div class="absolute w-1 h-12 bg-red-600 shadow-[0_0_15px_red] z-10 transition-all duration-150"
               [style.left.%]="50 + pull()">
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">🚩</div>
          </div>

          <div class="absolute left-4 text-6xl md:text-7xl group">
             <span class="inline-block animate-bounce">🧑‍🤝‍🧑</span>
             <div class="text-[10px] text-blue-500 font-bold text-center mt-2">TEAM LST</div>
          </div>

          <div class="absolute right-4 text-6xl md:text-7xl">
             <span class="inline-block animate-bounce scale-x-[-1]">👹</span>
             <div class="text-[10px] text-red-500 font-bold text-center mt-2">TEAM BOT</div>
          </div>
        </div>

        <div class="w-full max-w-xl h-4 bg-zinc-800 rounded-full overflow-hidden border border-white/10 mb-10">
          <div class="h-full bg-gradient-to-r from-blue-600 via-white to-red-600 transition-all duration-300"
               [style.width.%]="50 + pull()"></div>
        </div>

        <div class="text-center glass-panel p-8 w-full max-w-md border-b-4 border-yellow-500">
          <h3 class="text-3xl font-black mb-6 italic tracking-tighter"
              [ngClass]="pull() > 20 ? 'text-green-500' : (pull() < -20 ? 'text-red-500' : 'text-white')">
            {{ status() }}
          </h3>

          <div *ngIf="!gameOver()" class="flex justify-center gap-8 mb-4">
             <div class="text-center">
                <kbd class="bg-white text-black px-4 py-2 rounded-lg font-bold text-xl shadow-lg">←</kbd>
                <p class="text-[10px] mt-2 text-zinc-500 font-bold uppercase">PULL LEFT</p>
             </div>
             <div class="text-center">
                <kbd class="bg-white text-black px-4 py-2 rounded-lg font-bold text-xl shadow-lg">→</kbd>
                <p class="text-[10px] mt-2 text-zinc-500 font-bold uppercase">PULL RIGHT</p>
             </div>
          </div>

          <button *ngIf="gameOver()" (click)="reset()" class="btn-primary w-full text-lg">
            නැවත තරඟයට 🪢
          </button>
        </div>
      </div>
    </app-game-layout>
  `
})
export class TugOfWar implements OnDestroy {
  pull = signal(0); 
  status = signal('ලෑස්ති වන්න! 🏁');
  gameOver = signal(false);
  lastKey = '';
  botInterval: any;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver()) return;
    
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.key !== this.lastKey) {
      this.lastKey = event.key;
      this.pull.update(v => v + 3); 
      this.checkWin();
    }
  }

  constructor() { this.startBot(); }

  startBot() {
    this.botInterval = setInterval(() => {
      if (!this.gameOver()) {
        this.pull.update(v => v - 2.2); 
        this.checkWin();
      }
    }, 150);
  }

  checkWin() {
    if (this.pull() >= 45) {
      this.status.set('🏆 LST කණ්ඩායම ජයග්‍රහණය කළා!');
      this.endGame();
    } else if (this.pull() <= -45) {
      this.status.set('❌ BOT කණ්ඩායම ජයග්‍රහණය කළා!');
      this.endGame();
    } else {
      this.status.set('අදින්න! තව හයියෙන්! 🔥');
    }
  }

  endGame() {
    this.gameOver.set(true);
    clearInterval(this.botInterval);
  }

  reset() {
    this.pull.set(0);
    this.gameOver.set(false);
    this.lastKey = '';
    this.status.set('සූදානම් වන්න!');
    this.startBot();
  }

  ngOnDestroy() { clearInterval(this.botInterval); }
}