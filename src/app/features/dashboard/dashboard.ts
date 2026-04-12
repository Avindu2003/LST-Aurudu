import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TournamentService } from '../../core/services/tournament.service';
import { LeaderboardComponent } from '../../shared/components/leaderboard/leaderboard/leaderboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LeaderboardComponent],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      
      <header class="max-w-[1400px] mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="animate-fade-in">
          <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500 italic uppercase leading-none">
            LST අවුරුදු ARENA
          </h1>
          <p class="text-zinc-500 font-bold tracking-[0.4em] text-[10px] mt-3 uppercase">Official Esports Tournament 2026</p>
        </div>

        <button routerLink="/register-guild" class="btn-primary bg-yellow-600 border-b-4 border-yellow-800 px-10 py-5 rounded-2xl shadow-xl hover:scale-105 transition-all">
          REGISTER YOUR GUILD 🛡️
        </button>
      </header>

      <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-9 space-y-12">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section class="relative overflow-hidden bg-gradient-to-br from-red-600/20 to-yellow-600/10 p-8 rounded-[2.5rem] border border-white/5 group cursor-pointer shadow-2xl transition-all hover:border-red-500/40" [routerLink]="['/games/thattaya-game']">
               <div class="flex items-center justify-between">
                  <div>
                    <span class="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Trending Now</span>
                    <h2 class="text-2xl font-black italic uppercase mt-2">තට්ටයට කොණ්ඩේ සිටුවීම 👨‍🦲</h2>
                    <p class="text-zinc-400 text-[10px] font-bold uppercase mt-1">LST Surgeon Protocol v4.0</p>
                  </div>
                  <div class="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">👨‍🦲</div>
               </div>
            </section>

            <section class="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/10 p-8 rounded-[2.5rem] border border-white/5 group cursor-pointer shadow-2xl transition-all hover:border-blue-500/40" [routerLink]="['/games/hidden-guest']">
               <div class="flex items-center justify-between">
                  <div>
                    <span class="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Just Added</span>
                    <h2 class="text-2xl font-black italic uppercase mt-2">VIP දඩයම 🗳️</h2>
                    <p class="text-zinc-400 text-[10px] font-bold uppercase mt-1">Political Edition v4.0</p>
                  </div>
                  <div class="text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">🗳️</div>
               </div>
            </section>
          </div>

          <section class="glass-panel p-8 border-t-4 border-red-600">
            <h2 class="text-2xl font-black mb-8 flex items-center gap-3 italic text-white uppercase">
              🔥 GUILD RANKING & VOTING
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div *ngFor="let guild of tournament.guilds()" 
                   class="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/5 hover:border-red-600/40 transition-all group overflow-hidden shadow-2xl">
                
                <div class="flex items-center justify-between mb-6">
                  <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-red-600 transition-all shadow-xl bg-black">
                    <img [src]="guild.logo" [alt]="guild.name" class="w-full h-full object-cover">
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Votes</p>
                    <p class="text-3xl font-black text-yellow-500">{{ guild.votes }}</p>
                  </div>
                </div>

                <h3 class="font-black text-xl mb-6 truncate text-white italic uppercase tracking-tighter">
                  {{ guild.name }}
                </h3>
                
                <button (click)="tournament.vote(guild.id)" 
                        class="w-full py-4 bg-white/5 hover:bg-red-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/5 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                  VOTE NOW ❤️
                </button>
              </div>
            </div>
          </section>

          <section>
             <h2 class="text-2xl font-black mb-8 flex items-center gap-3 text-yellow-500 italic uppercase">
               <span class="w-2 h-8 bg-yellow-500 rounded-full"></span> ⚔️ ALL TOURNAMENT GAMES
             </h2>
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div *ngFor="let game of games" [routerLink]="game.route" 
                     class="game-card p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-all group cursor-pointer border border-white/5 rounded-[2rem] shadow-lg hover:shadow-2xl hover:border-yellow-500/30">
                   <div class="text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">{{ game.icon }}</div>
                   <h3 class="text-sm font-black uppercase tracking-tighter leading-tight group-hover:text-yellow-500 transition-colors">{{ game.title }}</h3>
                </div>
             </div>
          </section>
        </div>

        <div class="lg:col-span-3">
          <app-leaderboard></app-leaderboard>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(15, 15, 15, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 2.5rem;
    }
    .animate-fade-in {
      animation: fadeIn 1s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent {
  tournament = inject(TournamentService);

  games = [
    { title: 'තට්ටයට කොණ්ඩේ සිටුවීම', icon: '👨‍🦲', route: '/games/thattaya-game' },
    { title: 'VIP දඩයම', icon: '🗳️', route: '/games/hidden-guest' },
    { title: 'ඩිජිටල් කඹ ඇදීම', icon: '🪢', route: '/games/tug-of-war' },
    { title: 'පියාඹන VIP', icon: '🦅', route: '/games/flappy-vip' },
    { title: 'කෑගහපන් යකෝ', icon: '🗣️', route: '/games/voice-jump' }, 
    { title: 'පංච දැමීම', icon: '🐚', route: '/games/pancha' },
    { title: 'කොට්ට පොර', icon: '🥊', route: '/games/pillow-fight' },
    { title: 'රබන් ගැසීම', icon: '🥁', route: '/games/raban' },
    { title: 'ඡායාරූප තරඟය', icon: '📸', route: '/games/photo-contest' },
    { title: 'ඇස තැබීම', icon: '🐘', route: '/games/elephant-eye' },
    { title: 'ලිස්සන ගහ', icon: '🧗‍♂️', route: '/games/grease-pole' },
    { title: 'කණා මුට්ටි', icon: '🏺', route: '/games/kana-mutti' },
    { title: 'රතිඤ්ඤා බෝම්බ', icon: '🧨', route: '/games/sweeper' },
    { title: 'මතක ශක්තිය', icon: '🧠', route: '/games/memory' },
    { title: 'කැවුම් අල්ලමු', icon: '🧺', route: '/games/catch' }
  ];
}