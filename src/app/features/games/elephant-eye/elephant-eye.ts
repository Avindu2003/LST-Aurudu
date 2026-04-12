import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-elephant-eye',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="අලියාට ඇස තැබීම" category="Solo Skill" 
      [rules]="['පළමුව අලියාගේ ඇස තිබෙන තැන හොඳින් බලාගන්න.', 'Start එබූ පසු තත්පර 3කින් තිරය කළු වේ.', 'ඉන්පසු මතකයෙන් නිවැරදි තැන Click කරන්න.']">
      
      <div class="relative w-full max-w-[500px] mx-auto h-[350px] border-8 border-yellow-800 rounded-3xl overflow-hidden cursor-crosshair shadow-2xl"
           [class.bg-black]="isBlind()" (click)="placeEye($event)">
        
        <img *ngIf="!isBlind()" 
             src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=500" 
             class="w-full h-full object-cover opacity-80">
             
        <div *ngIf="showResult()" class="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-[0_0_10px_green]" 
             style="left: 36%; top: 38%;"></div>

        <div *ngIf="marker()" class="absolute text-4xl pointer-events-none drop-shadow-lg" 
             [style.left.px]="marker()?.x" [style.top.px]="marker()?.y" 
             style="transform: translate(-50%, -50%)">
          🎯
        </div>
      </div>

      <div class="mt-8 text-center glass-panel p-6">
        <h3 class="text-2xl font-black mb-4 transition-all" 
            [ngClass]="accuracy() > 80 ? 'text-green-500' : 'text-yellow-400'">
          {{ status() }}
        </h3>
        
        <div *ngIf="accuracy() > 0" class="mb-4 text-zinc-400 font-bold uppercase tracking-widest text-sm">
          නිවැරදි බව: {{ accuracy() }}%
        </div>

        <button *ngIf="!gameStarted()" class="btn-primary bg-yellow-600 px-12" (click)="startCountdown()">
          Start Game
        </button>
        
        <button *ngIf="showResult()" class="btn-primary bg-zinc-700 ml-4" (click)="reset()">
          නැවත උත්සාහ කරන්න
        </button>
      </div>
    </app-game-layout>
  `
})
export class ElephantEye {
  isBlind = signal(false);
  gameStarted = signal(false);
  showResult = signal(false);
  marker = signal<{x: number, y: number} | null>(null);
  status = signal('අලියා දෙස හොඳින් බලා සිටින්න...');
  accuracy = signal(0);

  readonly targetX = 0.36; 
  readonly targetY = 0.38;

  startCountdown() {
    this.gameStarted.set(true);
    let count = 3;
    const int = setInterval(() => {
      this.status.set(`සූදානම් වන්න... ${count--}`);
      if (count < 0) {
        clearInterval(int);
        this.isBlind.set(true);
        this.status.set('දැන් මතකයෙන් ඇස තිබූ තැන Click කරන්න!');
      }
    }, 1000);
  }

  placeEye(event: MouseEvent) {
    if (!this.isBlind() || this.showResult()) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.marker.set({ x, y });
    this.isBlind.set(false);
    this.showResult.set(true);

    // Accuracy Calculation
    const targetPxX = rect.width * this.targetX;
    const targetPxY = rect.height * this.targetY;
    const dist = Math.sqrt(Math.pow(x - targetPxX, 2) + Math.pow(y - targetPxY, 2));
    
    const score = Math.max(0, 100 - Math.round(dist / 1.5));
    this.accuracy.set(score);

    if (score > 90) this.status.set('නියමයි! හරියටම ඇස තිබ්බා! 🎯');
    else if (score > 70) this.status.set('ඉතා ආසන්නයි! සුපිරි. 👏');
    else this.status.set('අයියෝ! තව ටිකක් උත්සාහ කරන්න. 😅');
  }

  reset() {
    this.isBlind.set(false);
    this.gameStarted.set(false);
    this.showResult.set(false);
    this.marker.set(null);
    this.accuracy.set(0);
    this.status.set('අලියා දෙස හොඳින් බලා සිටින්න...');
  }
}