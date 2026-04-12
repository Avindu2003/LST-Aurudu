import { Component, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-pillow-fight',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="කොට්ට පොර" category="Speed Battle" 
      [rules]="['A සහ L Keys දෙක මාරුවෙන් මාරුවට වේගයෙන් ඔබන්න.', 'ඔබේ වේගය වැඩිවන තරමට ප්‍රතිවාදියා බිමට වැටේ.', 'ප්‍රතිවාදියාට පෙර ඔහුව වට්ටන්න!']">
      
      <div class="flex flex-col items-center justify-center py-10">
        <div class="relative w-full max-w-[500px] h-3 bg-gradient-to-r from-yellow-900 to-yellow-700 rounded-full mb-24 shadow-2xl border-b-4 border-black/20">
          
          <div class="absolute -top-20 transition-all duration-300 flex flex-col items-center"
               [style.left.%]="40 - offset()">
            <span class="text-7xl drop-shadow-xl">🧑‍🌾</span>
            <div class="bg-blue-600/80 backdrop-blur-md text-[10px] px-3 py-1 rounded-full mt-2 font-bold border border-white/20">ඔබ</div>
          </div>

          <div class="absolute -top-20 transition-all duration-300 flex flex-col items-center"
               [style.right.%]="40 - offset()">
            <span class="text-7xl scale-x-[-1] drop-shadow-xl">👹</span>
            <div class="bg-red-600/80 backdrop-blur-md text-[10px] px-3 py-1 rounded-full mt-2 font-bold border border-white/20">ප්‍රතිවාදියා</div>
          </div>

          <div *ngIf="isHitting()" class="absolute top-[-70px] left-1/2 -translate-x-1/2 text-5xl animate-ping select-none">💥</div>
        </div>

        <div class="w-full max-w-md bg-zinc-900/50 h-8 rounded-2xl overflow-hidden border-2 border-white/10 mb-8 p-1">
          <div class="h-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-red-600 transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
               [style.width.%]="50 + offset()"></div>
        </div>

        <div class="text-center glass-panel p-8 w-full max-w-md border-t-4 border-red-600">
          <h3 class="text-3xl font-black mb-6 uppercase italic tracking-tighter" 
              [ngClass]="offset() > 40 ? 'text-green-500' : (offset() < -40 ? 'text-red-500' : 'text-white')">
            {{ status() }}
          </h3>

          <div *ngIf="!gameOver()" class="flex justify-center gap-6 mb-4">
             <div class="flex flex-col items-center">
                <kbd class="bg-white text-black px-5 py-3 rounded-2xl font-black text-2xl shadow-xl border-b-4 border-gray-400">A</kbd>
                <span class="text-[10px] text-zinc-500 mt-2 font-bold">LEFT HIT</span>
             </div>
             <div class="flex flex-col items-center">
                <kbd class="bg-white text-black px-5 py-3 rounded-2xl font-black text-2xl shadow-xl border-b-4 border-gray-400">L</kbd>
                <span class="text-[10px] text-zinc-500 mt-2 font-bold">RIGHT HIT</span>
             </div>
          </div>

          <button *ngIf="gameOver()" (click)="reset()" class="btn-primary w-full py-4 text-xl">
            නැවත සටනට 🥊
          </button>
        </div>
      </div>
    </app-game-layout>
  `
})
export class PillowFight implements OnDestroy {
  offset = signal(0); 
  status = signal('සූදානම් වන්න!');
  gameOver = signal(false);
  isHitting = signal(false);
  lastKeyPressed = '';
  botInterval: any;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver()) return;
    const key = event.key.toUpperCase();
    if ((key === 'A' || key === 'L') && key !== this.lastKeyPressed) {
      this.lastKeyPressed = key;
      this.playerHit();
    }
  }

  constructor() { this.startBot(); }

  startBot() {
    this.botInterval = setInterval(() => {
      if (!this.gameOver()) {
        this.offset.update(v => v - 2); 
        this.checkWin();
      }
    }, 200);
  }

  playerHit() {
    this.isHitting.set(true);
    this.offset.update(v => v + 4);
    this.checkWin();
    setTimeout(() => this.isHitting.set(false), 100);
  }

  checkWin() {
    if (this.offset() >= 50) { this.status.set('🏆 ඔබ ජයග්‍රහණය කළා!'); this.endGame(); }
    else if (this.offset() <= -50) { this.status.set('❌ ඔබ පරාජය වුණා!'); this.endGame(); }
    else { this.status.set('වේගයෙන් පහර දෙන්න! 🔥'); }
  }

  endGame() { this.gameOver.set(true); clearInterval(this.botInterval); }

  reset() {
    this.offset.set(0); this.gameOver.set(false);
    this.lastKeyPressed = ''; this.status.set('සූදානම් වන්න!');
    this.startBot();
  }

  ngOnDestroy() { clearInterval(this.botInterval); }
}