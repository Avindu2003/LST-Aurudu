import { Component, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-catch-game',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="කැවුම් අල්ලමු" category="Action" 
      [rules]="['Basket එක එහා මෙහා කරන්න Arrow Keys පාවිච්චි කරන්න.', 'වැටෙන කැවුම් අල්ලන්න (Score +10).', 'රතිඤ්ඤා අල්ලන්න එපා (Game Over).']">
      
      <div class="relative w-full h-[400px] bg-gradient-to-b from-blue-900/40 to-green-900/40 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
        <div class="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-full font-bold text-yellow-400 z-10">
          Score: {{ score() }}
        </div>

        <div *ngFor="let item of items()" 
             class="absolute text-4xl transition-all duration-100 ease-linear"
             [style.left.%]="item.x" 
             [style.top.px]="item.y">
          {{ item.type === 'kavum' ? '🥮' : '🧨' }}
        </div>

        <div class="absolute bottom-4 text-6xl transition-all duration-75 ease-out"
             [style.left.%]="basketX()" 
             style="transform: translateX(-50%)">
          🧺
        </div>

        <div *ngIf="!gameRunning()" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
          <h3 class="text-3xl font-black mb-4">{{ gameOver() ? 'Game Over! ❌' : 'සූදානම්ද? 🏁' }}</h3>
          <p class="mb-6 text-yellow-500 font-bold">ඔබේ ලකුණු: {{ score() }}</p>
          <button (click)="startGame()" class="btn-primary bg-green-600 px-10 py-3 rounded-full hover:bg-green-500">
            දැන් අරඹන්න
          </button>
        </div>
      </div>
      
      <div class="flex justify-center gap-10 mt-6 md:hidden">
        <button (click)="moveBasket(-10)" class="w-16 h-16 bg-zinc-800 rounded-full text-2xl">◀</button>
        <button (click)="moveBasket(10)" class="w-16 h-16 bg-zinc-800 rounded-full text-2xl">▶</button>
      </div>
    </app-game-layout>
  `
})
export class CatchGame implements OnDestroy {
  basketX = signal(50);
  items = signal<any[]>([]);
  score = signal(0);
  gameRunning = signal(false);
  gameOver = signal(false);
  gameInterval: any;

  // Keyboard Controls
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') this.moveBasket(-5);
    if (event.key === 'ArrowRight') this.moveBasket(5);
  }

  moveBasket(dir: number) {
    this.basketX.update(x => Math.max(5, Math.min(95, x + dir)));
  }

  startGame() {
    this.score.set(0);
    this.items.set([]);
    this.gameRunning.set(true);
    this.gameOver.set(false);

    this.gameInterval = setInterval(() => {
      this.updateGame();
    }, 50);
  }

  updateGame() {
    this.items.update(prev => {
      let next = prev.map(i => ({ ...i, y: i.y + 7 }));
      
      // අලුත් එකක් එකතු කිරීම
      if (Math.random() < 0.05) {
        next.push({
          x: Math.random() * 90 + 5,
          y: -50,
          type: Math.random() > 0.2 ? 'kavum' : 'bomb'
        });
      }

      next = next.filter(i => {
        const caught = i.y > 330 && i.y < 370 && Math.abs(i.x - this.basketX()) < 8;
        if (caught) {
          if (i.type === 'bomb') this.stopGame();
          else this.score.update(s => s + 10);
          return false;
        }
        return i.y < 400; 
      });

      return next;
    });
  }

  stopGame() {
    clearInterval(this.gameInterval);
    this.gameRunning.set(false);
    this.gameOver.set(true);
  }

  ngOnDestroy() {
    clearInterval(this.gameInterval);
  }
}