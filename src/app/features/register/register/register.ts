import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../../core/services/tournament.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="glass-panel p-10 w-full max-w-md border-t-8 border-red-600 shadow-[0_0_100px_rgba(217,4,41,0.2)]">
        <h1 class="text-4xl font-black mb-2 italic">GUILD REGISTRATION</h1>
        <p class="text-zinc-500 mb-8 text-sm uppercase tracking-widest">Esports Season 2026</p>

        <div class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-zinc-400 mb-2 uppercase">Guild Name</label>
            <input #name type="text" class="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white focus:border-red-600 outline-none transition-all">
          </div>

          <div>
            <label class="block text-xs font-bold text-zinc-400 mb-2 uppercase">Guild Logo (Emoji / Icon)</label>
            <input #logo type="text" placeholder="e.g. 🔥" class="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl text-white focus:border-red-600 outline-none transition-all">
          </div>

          <button (click)="register(name.value, logo.value)" class="btn-primary w-full py-5 text-lg">
            REGISTER GUILD 🚀
          </button>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  service = inject(TournamentService);
  router = inject(Router);

  register(name: string, logo: string) {
    if (name && logo) {
      this.service.registerGuild(name, logo);
      this.router.navigate(['/']);
    }
  }
}