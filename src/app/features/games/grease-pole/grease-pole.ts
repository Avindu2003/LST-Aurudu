import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-grease-pole',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="ලිස්සන ගහ නැගීම" category="Endurance" 
      [rules]="['සීග්‍රයෙන් CLIMB Button එක Click කරන්න.', 'Click කිරීම නැවැත්වූ සැනින් ඔබ පල්ලෙහාට ලිස්සා යයි.', 'ගහ මුදුනටම ගොස් ජයග්‍රහණය තහවුරු කරන්න.']">
      
      <div class="flex flex-col items-center justify-center py-10">
        
        <div class="relative w-24 h-[400px] bg-gradient-to-b from-yellow-900 to-yellow-700 rounded-t-full border-x-4 border-yellow-950 shadow-2xl">
          
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl animate-bounce">🚩</div>

          <div class="absolute w-20 h-20 text-5xl transition-all duration-100 ease-out flex items-center justify-center"
               [style.bottom.%]="height()" 
               style="left: 50%; transform: translateX(-50%)">
            🧗‍♂️
          </div>

          <div class="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" style="background-image: linear-gradient(0deg, transparent 20%, rgba(255,255,255,.2) 20%); background-size: 100% 20px;"></div>
        </div>

        <div class="w-full max-w-[300px] mt-8 bg-zinc-800 h-4 rounded-full overflow-hidden border border-white/10">
          <div class="h-full bg-gradient-to-r from-red-600 to-yellow-500 transition-all duration-100" [style.width.%]="height()"></div>
        </div>

        <div class="mt-8 text-center w-full max-w-[300px]">
          <h3 class="text-3xl font-black mb-6" [ngClass]="height() >= 95 ? 'text-green-500 animate-pulse' : 'text-white'">
            {{ height() | number:'1.0-0' }}%
          </h3>

          <button *ngIf="!won()" 
                  (mousedown)="climb()" 
                  (touchstart)="climb()"
                  class="w-full h-24 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-xl shadow-red-600/30 transition-all uppercase">
            👆 CLIMB!
          </button>

          <div *ngIf="won()" class="animate-fade-in">
            <p class="text-2xl font-bold text-yellow-400 mb-4">සුපිරි! ඔබ ජයග්‍රහණය කළා! 🏆</p>
            <button class="btn-primary bg-zinc-700" (click)="reset()">නැවත උත්සාහ කරන්න</button>
          </div>
        </div>
      </div>
    </app-game-layout>
  `
})
export class GreasePole implements OnDestroy {
  height = signal(0);
  won = signal(false);
  gravityInterval: any;

  constructor() {
    this.startGravity();
  }

  startGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.height() > 0 && !this.won()) {
        this.height.update(h => Math.max(0, h - 1.5)); 
      }
    }, 100);
  }

  climb() {
    if (this.won()) return;
    
    this.height.update(h => {
      const newHeight = h + 4;
      if (newHeight >= 95) {
        this.won.set(true);
        return 100;
      }
      return newHeight;
    });
  }

  reset() {
    this.height.set(0);
    this.won.set(false);
  }

  ngOnDestroy() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
  }
}