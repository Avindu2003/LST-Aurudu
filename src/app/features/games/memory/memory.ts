import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLayoutComponent } from '../../../shared/components/game-layout/game-layout';

interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule, GameLayoutComponent],
  template: `
    <app-game-layout title="මතක ශක්තිය" category="Brain Power" 
      [rules]="['එකම රූපය සහිත කාඩ්පත් ජෝඩු සොයන්න.', 'වරකට විවෘත කළ හැක්කේ කාඩ්පත් 2ක් පමණි.', 'අවම උත්සාහයන් ගණනකින් සියල්ල සොයන්න.']">
      
      <div class="max-w-[500px] mx-auto">
        <div class="flex justify-between mb-6 glass-panel px-6 py-3 border-b-2 border-blue-500">
          <div class="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Moves: <span class="text-white text-xl ml-2">{{ moves() }}</span>
          </div>
          <div class="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Matches: <span class="text-white text-xl ml-2">{{ matches() }} / 8</span>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 md:gap-4">
          <div *ngFor="let card of cards(); let i = index" 
               (click)="flipCard(i)"
               class="aspect-square cursor-pointer transition-all duration-500 preserve-3d"
               [class.rotate-y-180]="card.flipped || card.matched">
            
            <div class="absolute inset-0 bg-zinc-800 rounded-2xl border-2 border-white/5 flex items-center justify-center text-3xl backface-hidden">
              🏮
            </div>

            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-4xl rotate-y-180 backface-hidden shadow-xl"
                 [class.opacity-50]="card.matched"
                 [class.border-4]="card.matched"
                 [class.border-green-400]="card.matched">
              {{ card.icon }}
            </div>
          </div>
        </div>

        <div *ngIf="matches() === 8" class="mt-10 text-center animate-bounce">
          <h3 class="text-3xl font-black text-yellow-400 mb-4">සුපිරි! ඔබ ජයග්‍රහණය කළා! 🏆</h3>
          <button (click)="initGame()" class="btn-primary px-12">නැවත ක්‍රීඩා කරන්න</button>
        </div>
      </div>
    </app-game-layout>
  `,
  styles: [`
    .preserve-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
  `]
})
export class Memory implements OnInit {
  icons = ['🥮', '🍪', '🍌', '🍍', '🍵', '🥥', '🥭', '🥘'];
  cards = signal<Card[]>([]);
  moves = signal(0);
  matches = signal(0);
  flippedCards: number[] = [];
  lockBoard = false;

  ngOnInit() {
    this.initGame();
  }

  initGame() {
    const deck: Card[] = [];
    const fullIcons = [...this.icons, ...this.icons]; 
    
    // Shuffle
    fullIcons.sort(() => Math.random() - 0.5);

    fullIcons.forEach((icon, index) => {
      deck.push({ id: index, icon, flipped: false, matched: false });
    });

    this.cards.set(deck);
    this.moves.set(0);
    this.matches.set(0);
    this.flippedCards = [];
    this.lockBoard = false;
  }

  flipCard(index: number) {
    const currentCards = this.cards();
    if (this.lockBoard || currentCards[index].flipped || currentCards[index].matched) return;

    // Flip the card
    currentCards[index].flipped = true;
    this.flippedCards.push(index);
    this.cards.set([...currentCards]);

    if (this.flippedCards.length === 2) {
      this.moves.update(m => m + 1);
      this.checkMatch();
    }
  }

  checkMatch() {
    this.lockBoard = true;
    const currentCards = this.cards();
    const [id1, id2] = this.flippedCards;

    if (currentCards[id1].icon === currentCards[id2].icon) {
      // Match found
      currentCards[id1].matched = true;
      currentCards[id2].matched = true;
      this.matches.update(m => m + 1);
      this.flippedCards = [];
      this.lockBoard = false;
    } else {
      // No match - Flip back after 1s
      setTimeout(() => {
        currentCards[id1].flipped = false;
        currentCards[id2].flipped = false;
        this.cards.set([...currentCards]);
        this.flippedCards = [];
        this.lockBoard = false;
      }, 1000);
    }
  }
}