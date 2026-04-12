import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-sweeper',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="රතිඤ්ඤා බිම්බෝම්බ" category="Puzzle" 
      [rules]="['කොටු 25ක් ඇතුලේ රතිඤ්ඤා 5ක් සඟවා ඇත.', 'රතිඤ්ඤා පෑගුනොත් තරඟය අවසන් වේ.', 'රතිඤ්ඤා නොමැති කොටු 20ම විවෘත කරන්න.']">
      
      <div class="max-w-[400px] mx-auto">
        <div class="grid grid-cols-5 gap-2 mb-6">
          <div *ngFor="let cell of board(); let i = index" 
               (click)="reveal(i)"
               class="h-16 w-16 flex items-center justify-center text-2xl cursor-pointer rounded-lg transition-all duration-300 shadow-lg"
               [ngClass]="cell.revealed ? (cell.isBomb ? 'bg-red-600 scale-110' : 'bg-green-700') : 'bg-yellow-600 hover:bg-yellow-500'">
            
            <span *ngIf="cell.revealed">
              {{ cell.isBomb ? '🧨' : '🎁' }}
            </span>
            <span *ngIf="!cell.revealed" class="opacity-20 text-black">?</span>
          </div>
        </div>

        <div class="text-center glass-panel p-4">
          <p class="text-xl font-bold" [ngClass]="gameOver() ? 'text-red-500 animate-bounce' : 'text-yellow-400'">
            {{ status() }}
          </p>
          <p class="text-sm text-gray-400 mt-2">විවෘත කළ කොටු ගණන: {{ safeOpened() }} / 20</p>
          <button *ngIf="gameOver()" class="btn-primary mt-4 w-full" (click)="initGame()">නැවත උත්සාහ කරන්න</button>
        </div>
      </div>
    </app-game-layout>
  `
})
export class Sweeper {
  board = signal<any[]>([]);
  gameOver = signal(false);
  safeOpened = signal(0);
  status = signal('පරෙස්සමෙන් කොටුවක් තෝරන්න!');

  constructor() {
    this.initGame();
  }

  initGame() {
    const newBoard = Array.from({ length: 25 }, () => ({ isBomb: false, revealed: false }));
    let bombsPlaced = 0;
    while (bombsPlaced < 5) {
      const idx = Math.floor(Math.random() * 25);
      if (!newBoard[idx].isBomb) {
        newBoard[idx].isBomb = true;
        bombsPlaced++;
      }
    }
    this.board.set(newBoard);
    this.gameOver.set(false);
    this.safeOpened.set(0);
    this.status.set('පරෙස්සමෙන් කොටුවක් තෝරන්න!');
  }

  reveal(i: number) {
    if (this.gameOver() || this.board()[i].revealed) return;

    const currentBoard = [...this.board()];
    currentBoard[i].revealed = true;

    if (currentBoard[i].isBomb) {
      this.gameOver.set(true);
      this.status.set('💥 අයියෝ රතිඤ්ඤාව පෑගුනා! ඔබ පරාජිතයි.');
      currentBoard.forEach(c => { if(c.isBomb) c.revealed = true; });
    } else {
      this.safeOpened.update(v => v + 1);
      if (this.safeOpened() === 20) {
        this.gameOver.set(true);
        this.status.set('🏆 සුපිරි! ඔබ ජයග්‍රහණය කළා!');
      } else {
        this.status.set('බේරුණා! 😅 තව එකක් තෝරන්න.');
      }
    }
    this.board.set(currentBoard);
  }
}