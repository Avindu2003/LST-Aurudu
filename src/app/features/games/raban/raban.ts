import { Component, signal, OnInit } from '@angular/core'; // @angular/core එකෙන් එන්න ඕනේ
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-raban',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="රබන් ගැසීම" category="Rhythm & Memory" 
      [rules]="['මුලින්ම ප්ලේ වන රබන් පදය හොඳින් අසා සිටින්න.', 'එම පිළිවෙලටම රබන් වාදනය කරන්න.', 'වැරදුණහොත් නැවත මුල සිට ආරම්භ කිරීමට සිදුවේ.']">
      
      <div class="flex flex-col items-center justify-center py-6">
        <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-yellow-900 bg-orange-200 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform"
             (mousedown)="userClick()" [class.ring-8]="isPlayingPath()" [class.ring-yellow-500]="isPlayingPath()">
          
          <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
          <div class="text-center select-none">
            <span class="text-6xl md:text-8xl drop-shadow-md">🥁</span>
            <p class="text-yellow-900 font-black mt-2 text-xs uppercase tracking-widest">LST RABAN</p>
          </div>
          <div *ngIf="isVisualizing()" class="absolute inset-0 bg-yellow-400/30 animate-ping rounded-full"></div>
        </div>

        <div class="mt-12 text-center glass-panel p-8 w-full max-w-sm border-b-4 border-orange-500">
          <p class="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Level: {{ level() }}</p>
          <h3 class="text-2xl font-black mb-6" [ngClass]="gameOver() ? 'text-red-500' : 'text-white'">
            {{ status() }}
          </h3>
          <div class="flex gap-4">
            <button *ngIf="!gameStarted() || gameOver()" (click)="startGame()" class="btn-primary w-full bg-orange-600">
              තරඟය අරඹන්න 🏁
            </button>
            <button *ngIf="gameStarted() && !isPlayingPath() && !gameOver()" (click)="playSequence()" class="btn-primary w-full bg-zinc-700">
              නැවත අසන්න 👂
            </button>
          </div>
        </div>
      </div>
    </app-game-layout>
  `
})
export class Raban implements OnInit {
  sequence = signal<number[]>([]);
  userSequence: number[] = [];
  level = signal(1);
  status = signal('සූදානම් වන්න!');
  gameStarted = signal(false);
  isPlayingPath = signal(false);
  isVisualizing = signal(false);
  gameOver = signal(false);

  ngOnInit() {}

  startGame() {
    this.level.set(1); this.sequence.set([]);
    this.gameOver.set(false); this.gameStarted.set(true);
    this.nextLevel();
  }

  nextLevel() {
    this.userSequence = [];
    const newSeq = [...this.sequence(), 0]; 
    this.sequence.set(newSeq);
    this.playSequence();
  }

  async playSequence() {
    this.isPlayingPath.set(true);
    this.status.set('පදය අසා සිටින්න...');
    for (let i = 0; i < this.sequence().length; i++) {
      await this.showBeat();
      await new Promise(r => setTimeout(r, 400));
    }
    this.isPlayingPath.set(false);
    this.status.set('දැන් ඔබේ වාරය!');
  }

  async showBeat() {
    this.isVisualizing.set(true);
    await new Promise(r => setTimeout(r, 200));
    this.isVisualizing.set(false);
  }

  userClick() {
    if (!this.gameStarted() || this.isPlayingPath() || this.gameOver()) return;
    this.showBeat();
    this.userSequence.push(0);
    if (this.userSequence.length === this.sequence().length) {
      this.status.set('නියමයි! 👏');
      this.level.update(l => l + 1);
      setTimeout(() => this.nextLevel(), 1000);
    }
  }
}