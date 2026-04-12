import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-thattaya-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#080808] text-white p-4 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      <div class="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
         <div class="w-[300px] h-[300px] border border-red-600/20 rounded-full flex items-center justify-center">
            <div class="w-[100px] h-[1px] bg-red-600/30 absolute"></div>
            <div class="w-[1px] h-[100px] bg-red-600/30 absolute"></div>
         </div>
      </div>

      <div class="w-full max-w-lg mb-8 flex justify-between items-center z-10 px-6">
        <div class="border-l-4 border-red-600 pl-4">
          <h2 class="text-2xl font-black italic tracking-tighter uppercase leading-none">
            LST <span class="text-red-600">TATTAYA</span>
          </h2>
          <p class="text-[8px] text-zinc-500 font-bold tracking-[0.5em] mt-1">REAL-TIME HAIR TRANSPLANT v3.0</p>
        </div>
        <div class="bg-zinc-900/80 px-6 py-2 rounded-2xl border border-white/5 shadow-2xl">
          <p class="text-[9px] text-zinc-500 font-black uppercase text-center mb-1">Success Rate</p>
          <p class="text-3xl font-black text-yellow-500 leading-none tracking-tighter">{{ score() }}</p>
        </div>
      </div>

      <div class="relative w-full max-w-lg aspect-square bg-[#0c0c0c] rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair"
           [ngClass]="{'bg-red-900/10': isHit()}"
           (click)="missedClick()">
        
        <div class="absolute inset-0 opacity-10 grayscale brightness-50 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]"></div>

        <svg class="absolute inset-0 w-full h-full -rotate-90 opacity-20">
          <circle cx="50%" cy="50%" r="48%" stroke="white" stroke-width="2" fill="none" 
                  [attr.stroke-dasharray]="100" [attr.stroke-dashoffset]="100 - (timeLeft() * 5)"></circle>
        </svg>

        <div *ngIf="isPlaying() || score() > 0" 
             class="relative w-72 h-80 flex flex-col items-center justify-start transition-transform"
             [ngClass]="isPlaying() ? 'animate-realistic-move' : ''"
             (click)="$event.stopPropagation(); plantHair($event)">
          
          <div class="relative w-56 h-64 bg-gradient-to-b from-[#f7cfaf] via-[#e5b691] to-[#c98d63] rounded-[120px] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_10px_30px_rgba(255,255,255,0.3)] border-t border-white/20">
            
            <div class="absolute inset-4 rounded-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <div class="absolute top-28 w-full px-12 flex justify-between opacity-80">
              <div class="w-8 h-1.5 bg-black/40 rounded-full mb-1"></div> <div class="w-8 h-1.5 bg-black/40 rounded-full mb-1"></div>
            </div>
            <div class="absolute top-36 w-full px-12 flex justify-between">
              <div class="w-5 h-2 bg-black rounded-full border-b border-white/20"></div> <div class="w-5 h-2 bg-black rounded-full border-b border-white/20"></div>
            </div>

            <div *ngFor="let h of hairs()" 
                 class="absolute w-0.5 bg-[#111] rounded-full origin-bottom shadow-sm"
                 [style.height.px]="30"
                 [style.left.px]="h.x"
                 [style.top.px]="h.y"
                 [style.transform]="'rotate(' + h.r + 'deg) scaleY(' + h.s + ')'">
                 <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-50"></div>
            </div>
          </div>
        </div>

        <div *ngIf="!isPlaying()" class="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-12 backdrop-blur-xl">
          <div class="text-[10px] font-black tracking-[0.5em] text-red-600 mb-4 animate-pulse uppercase">Mission Protocol</div>
          <h3 class="text-6xl font-black italic tracking-tighter mb-4 text-white">READY?</h3>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-12 leading-relaxed text-center">
            {{ score() > 0 ? 'Plant success: ' + (score()/10) + ' units. System rebooting.' : 'Focus on the upper scalp. Precision is the only way.' }}
          </p>
          <button (click)="startGame()" class="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-yellow-500 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95">
             START TRANSPLANT 💉
          </button>
        </div>

      </div>

      <p class="mt-10 text-[9px] text-zinc-700 font-black uppercase tracking-[0.8em]">LST SMOKER DIGITAL // NO DELAY</p>
    </div>
  `,
  styles: [`
    @keyframes realisticMove {
      0% { transform: translate(-120px, -10px) rotate(-5deg) scale(0.95); }
      33% { transform: translate(100px, 40px) rotate(8deg) scale(1.05); }
      66% { transform: translate(20px, -50px) rotate(-3deg) scale(1); }
      100% { transform: translate(-120px, -10px) rotate(-5deg) scale(0.95); }
    }
    .animate-realistic-move { animation: realisticMove 4s infinite ease-in-out; }

    :host { display: block; }
  `]
})
export class ThattayaGameComponent implements OnDestroy {
  score = signal(0);
  timeLeft = signal(20);
  isPlaying = signal(false);
  isHit = signal(false);
  hairs = signal<{x: number, y: number, r: number, s: number}[]>([]);
  private timer: any;

  startGame() {
    this.score.set(0);
    this.timeLeft.set(20);
    this.hairs.set([]);
    this.isPlaying.set(true);
    this.timer = setInterval(() => {
      if (this.timeLeft() > 0) this.timeLeft.update(t => t - 1);
      else this.endGame();
    }, 1000);
  }

  plantHair(e: MouseEvent) {
    if (!this.isPlaying()) return;
    
    this.isHit.set(true);
    setTimeout(() => this.isHit.set(false), 100);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // HARD REALISTIC HITBOX: Only the top scalp curve
    if (y > 110 || y < 10 || x < 20 || x > 200) return;

    this.hairs.update(h => [...h, { 
      x, y, 
      r: Math.random() * 40 - 20,
      s: 0.8 + Math.random() * 0.4 
    }]);
    this.score.update(s => s + 10);
  }

  missedClick() {
    if (this.isPlaying()) {
      this.timeLeft.update(t => Math.max(0, t - 2)); 
    }
  }

  endGame() {
    this.isPlaying.set(false);
    clearInterval(this.timer);
  }

  ngOnDestroy() { clearInterval(this.timer); }
}