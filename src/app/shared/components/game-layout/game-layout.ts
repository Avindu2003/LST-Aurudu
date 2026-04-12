import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeaderboardComponent } from '../leaderboard/leaderboard/leaderboard'; // Leaderboard එක import කරන්න

@Component({
  selector: 'app-game-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, LeaderboardComponent],
  template: `
    <div class="max-w-[1600px] mx-auto p-4 md:p-6 animate-fade-in">
      
      <div class="flex flex-col md:flex-row items-center justify-between mb-6 glass-panel p-4 border-l-4 border-red-600 gap-4">
        <div class="flex items-center gap-4">
          <button routerLink="/" class="p-2 hover:bg-white/5 rounded-full transition-all text-zinc-400 hover:text-white">
            ⬅
          </button>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{{ title }}</h1>
            <span class="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">{{ category }} | SEASON 2026</span>
          </div>
        </div>

        <div class="hidden lg:flex items-center gap-6 px-6 border-l border-white/10">
          <div class="text-center">
            <p class="text-[8px] text-zinc-500 uppercase font-black">Your Guild Rank</p>
            <p class="text-yellow-500 font-bold">#01</p>
          </div>
          <div class="text-center">
            <p class="text-[8px] text-zinc-500 uppercase font-black">Points Earned</p>
            <p class="text-white font-bold">1,240</p>
          </div>
        </div>

        <button routerLink="/" class="btn-close">
          ✕ CLOSE
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div *ngIf="showRules()" class="lg:col-span-3 glass-panel p-6 border-t-2 border-yellow-500 sticky top-6">
          <h2 class="text-xl font-bold mb-4 text-yellow-500 flex items-center gap-2 italic">
            📜 තරඟ නීති
          </h2>
          <ul class="space-y-4 mb-8">
            <li *ngFor="let rule of rules" class="text-zinc-400 text-sm flex gap-3 leading-relaxed">
              <span class="text-red-600 mt-1">●</span> {{ rule }}
            </li>
          </ul>
          <button (click)="startGame()" class="btn-primary w-full py-4 text-lg shadow-red-600/20">
            තරඟය අරඹන්න 🔥
          </button>
        </div>

        <div [class.lg:col-span-6]="showRules()" 
             [class.lg:col-span-9]="!showRules()" 
             class="glass-panel p-4 md:p-8 min-h-[500px] flex items-center justify-center relative border border-white/5 overflow-hidden">
          
          <div class="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none"></div>
          
          <button *ngIf="!showRules()" (click)="showRules.set(true)" class="btn-rules-toggle">
            SHOW RULES
          </button>

          <div class="w-full h-full z-10">
            <ng-content></ng-content> 
          </div>
        </div>

        <div class="lg:col-span-3 sticky top-6">
          <app-leaderboard></app-leaderboard>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(15, 15, 15, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 28px;
    }

    .btn-close {
      @apply text-[10px] font-black text-zinc-500 border border-zinc-800 px-4 py-2 rounded-full 
             hover:bg-red-600 hover:text-white hover:border-red-600 transition-all;
    }

    .btn-rules-toggle {
      @apply absolute top-6 left-6 text-[10px] text-zinc-500 hover:text-white 
             uppercase font-black tracking-widest bg-black/40 px-3 py-1 rounded-md;
    }

    .animate-fade-in {
      animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class GameLayoutComponent {
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() rules: string[] = [];

  showRules = signal(true);

  startGame() {
    this.showRules.set(false);
  }
}