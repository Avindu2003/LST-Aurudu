import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

@Component({
  selector: 'app-photo-contest',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="ඡායාරූප තරඟය" category="Community Event" 
      [rules]="['ඔබේ අවුරුදු ඇඳුමෙන් සැරසුණු පින්තූරයක් ඇතුළත් කරන්න.', 'වැඩිම මනාප (Votes) සංඛ්‍යාව ලබන අය ජයග්‍රහණය කරයි.', 'එක් අයෙකුට ලබාදිය හැක්කේ එක් මනාපයක් පමණි.']">
      
      <div class="max-w-2xl mx-auto">
        <div *ngIf="!uploadedImage()" class="glass-panel p-10 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center transition-all hover:border-red-600/50">
          <div class="text-6xl mb-4 opacity-50">📷</div>
          <p class="text-zinc-400 mb-6 text-center">අවුරුදු කුමාරයා/කුමාරිය තරඟයට පින්තූරයක් එක් කරන්න</p>
          <input type="file" (change)="onFileSelected($event)" class="hidden" #fileInput>
          <button (click)="fileInput.click()" class="btn-primary px-10">Upload Photo</button>
        </div>

        <div *ngIf="uploadedImage()" class="animate-fade-in">
          <div class="relative rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl mb-8">
            <img [src]="uploadedImage()" class="w-full h-auto object-cover max-h-[500px]">
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-8">
              <h3 class="text-2xl font-black text-white italic">#LST_AVURUDU_2026</h3>
            </div>
          </div>

          <div class="flex items-center justify-between glass-panel p-6 border-t-4 border-yellow-500">
            <div>
              <p class="text-zinc-500 uppercase text-xs font-bold tracking-widest">දැනට ලැබුණු මනාප</p>
              <div class="text-5xl font-black text-yellow-400">❤️ {{ votes() }}</div>
            </div>
            <button (click)="addVote()" [disabled]="voted()" 
                    class="btn-primary bg-gradient-to-r from-red-600 to-pink-600 px-12 py-4 rounded-full disabled:grayscale disabled:opacity-50">
              {{ voted() ? 'VOTED' : 'VOTE NOW' }}
            </button>
          </div>
          
          <button (click)="uploadedImage.set(null)" class="mt-6 text-zinc-600 hover:text-zinc-400 text-xs uppercase font-bold tracking-widest block mx-auto">
            වෙනත් පින්තූරයක් දමන්න
          </button>
        </div>
      </div>
    </app-game-layout>
  `
})
export class PhotoContest {
  uploadedImage = signal<string | null>(null);
  votes = signal(124); 
  voted = signal(false);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage.set(e.target.result);
        this.votes.set(Math.floor(Math.random() * 100));
        this.voted.set(false);
      };
      reader.readAsDataURL(file);
    }
  }

  addVote() {
    if (!this.voted()) {
      this.votes.update(v => v + 1);
      this.voted.set(true);
    }
  }
}