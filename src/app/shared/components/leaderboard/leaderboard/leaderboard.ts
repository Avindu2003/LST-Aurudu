import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../../../core/services/tournament.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel p-6 border-l-4 border-yellow-500 h-full min-h-[500px]">
      
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-black italic flex items-center gap-2 tracking-tighter">
          🏆 LEADERBOARD 
          <span class="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse not-italic tracking-widest">LIVE</span>
        </h2>
      </div>

      <div class="space-y-4">
        <div *ngFor="let guild of service.guilds(); let i = index" 
             class="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-all group">
          
          <div class="flex items-center gap-3">
            <span class="text-sm font-black w-4 text-center" 
                  [ngClass]="i === 0 ? 'text-yellow-500' : 'text-zinc-600'">
              {{ i + 1 }}
            </span>
            
            <div class="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black group-hover:border-yellow-500 transition-colors">
              <img [src]="guild.logo" [alt]="guild.name" class="w-full h-full object-cover">
            </div>

            <div>
              <p class="text-[11px] font-black uppercase tracking-tighter w-24 truncate text-white leading-tight">
                {{ guild.name }}
              </p>
              <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {{ guild.votes }} <span class="text-red-600">VOTES</span>
              </p>
            </div>
          </div>

          <div class="text-right bg-black/40 px-3 py-2 rounded-xl border border-white/5">
            <p class="text-xs font-black text-yellow-500 leading-none mb-1">{{ guild.points }}</p>
            <p class="text-[8px] text-zinc-600 font-black uppercase tracking-widest">PTS</p>
          </div>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-white/5">
        <p class="text-[9px] text-zinc-600 font-bold uppercase text-center tracking-[0.3em]">
          Season 2026 Tournament
        </p>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(15, 15, 15, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 32px;
    }
  `]
})
export class LeaderboardComponent {
  service = inject(TournamentService);
}