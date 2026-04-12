import { Component, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Politician {
  id: string;
  name: string;
  image: string;
  points: number;
  hitText: string;
  type: 'normal' | 'rare' | 'boss'; // අලුත්: චරිත වර්ගීකරණය
}

interface Booth {
  id: number;
  vip: Politician | null;
  isHit: boolean;
  timeoutId?: any;
  warningPhase?: boolean; // අලුත්: එළියට එන්න කලින් අනතුරු ඇඟවීම
}

@Component({
  selector: 'app-hidden-guest',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="game-engine-container min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans overflow-hidden select-none relative cursor-crosshair"
         [ngClass]="{'shake-arena-extreme': isExtremeShaking(), 'shake-arena-hard': isShaking()}">
      
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-[#050505] to-[#020202] z-0 pointer-events-none"></div>
      
      <div class="absolute inset-0 z-0 opacity-15 pointer-events-none" style="background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 60px 60px; transform: perspective(600px) rotateX(60deg) scale(2.5); transform-origin: top; animation: gridMove 20s linear infinite;"></div>

      <div class="w-full max-w-6xl flex justify-between items-end mb-6 z-10 px-4 md:px-8 mt-4">
        
        <div class="glass-panel px-6 py-4 border-l-[8px] border-red-600 rounded-[2rem] w-1/3 relative overflow-hidden group shadow-[0_0_40px_rgba(220,38,38,0.15)] flex flex-col items-start justify-center">
          <p class="text-[10px] md:text-sm text-zinc-400 font-black uppercase tracking-[0.5em] mb-1">Mission Time</p>
          <div class="flex items-center gap-2">
            <h2 class="text-6xl md:text-8xl font-black italic tracking-tighter transition-colors duration-300" 
                [ngClass]="timeLeft() <= 10 ? 'text-red-500 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'text-white drop-shadow-lg'">
              {{ timeLeft() }}<span class="text-3xl text-zinc-600">s</span>
            </h2>
          </div>
          <div class="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
             <div class="h-full bg-red-600 transition-all duration-1000" [style.width.%]="(timeLeft() / 45) * 100"></div>
          </div>
        </div>

        <div class="text-center w-1/3 flex flex-col items-center justify-end pb-2">
          <div class="bg-red-600/10 border border-red-600/30 px-6 py-2 rounded-full mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.3)]">
             <span class="text-[10px] font-black tracking-[0.4em] uppercase text-red-500 animate-pulse">Arena Live</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 uppercase tracking-tighter drop-shadow-2xl">
            VIP දඩයම
          </h1>
          
          <div class="mt-4 flex items-center justify-center gap-2" [ngClass]="{'animate-bounce': comboMultiplier() > 1}">
             <span class="text-3xl md:text-5xl font-black text-yellow-500 italic drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">x{{ comboMultiplier() }}</span>
             <span class="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2">COMBO</span>
          </div>
        </div>

        <div class="glass-panel px-6 py-4 border-r-[8px] border-yellow-500 rounded-[2rem] w-1/3 text-right relative overflow-hidden group shadow-[0_0_40px_rgba(234,179,8,0.15)] flex flex-col items-end justify-center">
          <p class="text-[10px] md:text-sm text-zinc-400 font-black uppercase tracking-[0.5em] mb-1">Total Score</p>
          <h2 class="text-6xl md:text-8xl font-black italic text-yellow-500 tracking-tighter drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]">
            {{ score() }}
          </h2>
          <div class="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden flex justify-end">
             <div class="h-full bg-yellow-500 transition-all duration-300" [style.width.%]="Math.min((score() / 1000) * 100, 100)"></div>
          </div>
        </div>
      </div>

      <div class="relative z-10 w-full max-w-5xl aspect-[4/3] md:aspect-[16/7] bg-gradient-to-b from-zinc-900 to-black rounded-[4rem] border-[6px] border-zinc-800/80 p-4 md:p-8 shadow-[0_40px_80px_rgba(0,0,0,0.9),inset_0_10px_40px_rgba(255,255,255,0.05)] overflow-visible perspective-1000">
        
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-40 bg-red-600/15 blur-[80px] pointer-events-none rounded-full"></div>

        <div class="grid grid-cols-4 gap-4 md:gap-6 w-full h-full relative z-10">
          
          <div *ngFor="let booth of booths(); let i = index" 
               class="relative w-full h-full bg-[#080808] rounded-[25px] border-b-[18px] border-zinc-900 shadow-[inset_0_30px_40px_rgba(0,0,0,0.9)] overflow-hidden flex items-end justify-center group transition-transform hover:scale-[1.02]"
               (mousedown)="whack(booth, i)">
            
            <div class="absolute bottom-0 w-full h-4/5 bg-gradient-to-t from-black via-black/95 to-transparent z-0"></div>

            <div *ngIf="booth.warningPhase" class="absolute inset-0 bg-red-600/20 animate-ping z-0 rounded-[25px]"></div>

            <div class="absolute bottom-[20%] w-full h-[80%] transition-transform duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-bottom z-10 flex items-end justify-center"
                 [ngClass]="booth.vip && !booth.isHit ? 'translate-y-0 scale-100' : 'translate-y-[150%] scale-75'">
              
              <div *ngIf="booth.vip" class="w-full h-full relative flex justify-center items-end">
                
                <div class="absolute inset-0 rounded-t-full blur-xl pointer-events-none" 
                     [ngClass]="{
                       'bg-red-500/40 animate-pulse': booth.vip.type === 'boss',
                       'bg-blue-500/30 animate-pulse': booth.vip.type === 'rare',
                       'bg-white/5': booth.vip.type === 'normal'
                     }"></div>
                
                <img [src]="booth.vip.image" 
                     (error)="handleImageError($event)"
                     class="relative w-[85%] md:w-[75%] h-full object-contain object-bottom rounded-[20px] shadow-2xl pointer-events-none transition-all duration-100 bg-black/60"
                     [ngClass]="{
                       'brightness-0 opacity-40 scale-75 translate-y-10 blur-sm': booth.isHit,
                       'brightness-110 drop-shadow-[0_-10px_30px_rgba(0,0,0,0.9)] border-[6px] border-yellow-500/50': booth.vip.type === 'boss' && !booth.isHit,
                       'brightness-110 drop-shadow-[0_-5px_20px_rgba(0,0,0,0.9)] border-[4px] border-blue-500/50': booth.vip.type === 'rare' && !booth.isHit,
                       'brightness-110 drop-shadow-2xl border-[4px] border-zinc-700/80': booth.vip.type === 'normal' && !booth.isHit
                     }">
                
                <div *ngIf="booth.isHit" class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div class="absolute w-full h-full bg-red-600/50 mix-blend-color-dodge rounded-[20px]"></div>
                  <div class="absolute w-40 h-40 bg-red-500/40 blur-2xl rounded-full scale-up-fast"></div>
                  <span class="text-8xl md:text-9xl filter drop-shadow-[0_0_40px_rgba(255,255,255,1)] rotate-[-20deg] scale-up-elastic">💢</span>
                </div>
              </div>
            </div>

            <div class="absolute bottom-0 w-full h-[25%] bg-gradient-to-t from-zinc-950 to-zinc-800 border-t-[5px] border-zinc-600 z-20 flex flex-col items-center justify-center shadow-[0_-15px_30px_rgba(0,0,0,0.8)]">
               <div class="flex gap-3 mb-2">
                 <div class="w-3 h-1.5 rounded-full" [ngClass]="booth.warningPhase ? 'bg-yellow-500 shadow-[0_0_10px_yellow] animate-pulse' : (booth.vip && !booth.isHit ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-zinc-800')"></div>
                 <div class="w-3 h-1.5 rounded-full bg-zinc-800"></div>
                 <div class="w-3 h-1.5 rounded-full bg-zinc-800"></div>
               </div>
               <span class="text-[9px] md:text-[11px] text-zinc-950 font-black opacity-80 tracking-[0.4em]">ZONE 0{{i+1}}</span>
            </div>
          </div>
        </div>

        <div *ngFor="let t of floatingTexts()" class="absolute pointer-events-none z-50 font-black italic tracking-tighter whitespace-nowrap"
             [ngClass]="{
               'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,1)] text-6xl md:text-8xl z-[60]': t.type === 'boss',
               'text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,1)] text-5xl md:text-6xl': t.type === 'rare',
               'text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,1)] text-4xl md:text-5xl': t.type === 'normal'
             }"
             [style.left.px]="t.x" [style.top.px]="t.y"
             style="animation: floatExplode 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
          {{ t.text }}
          <span *ngIf="t.multiplier > 1" class="text-2xl text-white ml-2 drop-shadow-none">x{{ t.multiplier }}</span>
        </div>
      </div>

      <div *ngIf="!isPlaying()" class="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center backdrop-blur-3xl">
        <div class="relative mb-8 group cursor-pointer" (click)="startGame()">
           <div class="w-48 h-48 bg-red-600/20 rounded-full animate-ping absolute inset-0 mix-blend-screen group-hover:bg-red-500/40 transition-colors"></div>
           <div class="text-[150px] relative z-10 animate-bounce-slow filter drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] group-hover:scale-110 transition-transform">🔨</div>
        </div>
        
        <h3 class="text-[80px] md:text-[120px] font-black italic mb-4 text-white tracking-tighter text-center leading-none drop-shadow-2xl">
          VIP <span class="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800">දඩයම</span>
        </h3>
        
        <div class="bg-zinc-900/60 border border-white/10 p-8 rounded-[2rem] mb-12 mt-4 max-w-2xl text-center backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <p class="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-4">Target Intelligence Protocol v4.0</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div class="bg-zinc-800/80 p-3 rounded-xl border border-zinc-700">
               <span class="block text-xl">👨‍💼</span>
               <span class="text-xs text-zinc-300 font-black uppercase mt-1 block">Normal (10 PTS)</span>
            </div>
            <div class="bg-blue-900/30 p-3 rounded-xl border border-blue-500/30">
               <span class="block text-xl">🧴</span>
               <span class="text-xs text-blue-400 font-black uppercase mt-1 block">Rare (30 PTS)</span>
            </div>
            <div class="bg-red-900/30 p-3 rounded-xl border border-red-500/30">
               <span class="block text-xl">🔥</span>
               <span class="text-xs text-red-500 font-black uppercase mt-1 block">Boss (50 PTS)</span>
            </div>
          </div>
          <p class="text-yellow-500 font-black uppercase text-xs mt-6 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
            Consecutive hits build up your COMBO Multiplier!
          </p>
        </div>

        <button (click)="startGame()" class="px-24 py-8 bg-red-600 text-white font-black text-4xl uppercase tracking-[0.3em] rounded-full hover:bg-red-500 hover:scale-[1.05] active:scale-95 transition-all shadow-[0_0_80px_rgba(220,38,38,0.7)] border-b-[8px] border-red-900">
          ENTER ARENA ⚡
        </button>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(25px); }
    
    @keyframes gridMove { 0% { background-position: 0 0; } 100% { background-position: 0 100px; } }

    .shake-arena-hard { animation: shakeHard 0.2s cubic-bezier(.36,.07,.19,.97) both; }
    .shake-arena-extreme { animation: shakeExtreme 0.3s cubic-bezier(.36,.07,.19,.97) both; }
    
    @keyframes shakeHard { 
      0%, 100% { transform: translate(0,0); } 
      20% { transform: translate(-10px, 10px) rotate(-1deg); } 
      40% { transform: translate(10px, -10px) rotate(1deg); } 
      60% { transform: translate(-10px, -10px); } 
      80% { transform: translate(10px, 10px); } 
    }
    
    @keyframes shakeExtreme { 
      0%, 100% { transform: translate(0,0); } 
      20% { transform: translate(-25px, 25px) rotate(-3deg) scale(1.02); } 
      40% { transform: translate(25px, -25px) rotate(3deg) scale(0.98); } 
      60% { transform: translate(-25px, -25px) rotate(-1deg) scale(1.05); } 
      80% { transform: translate(25px, 25px) rotate(1deg) scale(0.95); } 
    }

    @keyframes floatExplode { 
      0% { transform: translate(-50%, 0) scale(0.1) rotate(-15deg); opacity: 0; } 
      30% { transform: translate(-50%, -60px) scale(1.4) rotate(8deg); opacity: 1; }
      70% { transform: translate(-50%, -80px) scale(1) rotate(0deg); opacity: 1; } 
      100% { transform: translate(-50%, -130px) scale(0.8); opacity: 0; } 
    }
    
    .scale-up-elastic { animation: scale-up-elastic 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
    @keyframes scale-up-elastic { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
    .scale-up-fast { animation: scaleUp 0.2s ease-out forwards; }
    @keyframes scaleUp { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
    
    .animate-bounce-slow { animation: bounce 3s infinite; }
    
    .perspective-1000 { perspective: 1000px; }
    
    :host { display: block; }
  `]
})
export class HiddenGuestComponent implements OnDestroy {
  Math = Math; // Template access
  score = signal(0);
  timeLeft = signal(45); // Increased time
  isPlaying = signal(false);
  isShaking = signal(false);
  isExtremeShaking = signal(false);
  
  booths = signal<Booth[]>([]);
  floatingTexts = signal<{x: number; y: number; text: string; id: number, type: string, multiplier: number}[]>([]);
  private textIdCounter = 0;

  // COMBO SYSTEM
  comboCount = signal(0);
  comboMultiplier = computed(() => {
    const count = this.comboCount();
    if (count >= 15) return 4;
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    return 1;
  });

  private gameTimerId: any;
  private popUpTimerId: any;
  private currentSpeed = 1200;

  // 🎯 UPGRADED VIP DATABASE WITH RARITY TIERS
  private readonly vipDb: Politician[] = [
    { id: 'smoker', name: 'smoker', image: '/assets/smoker.png', points: 50, hitText: 'MP 40! 🔥', type: 'boss' },
    { id: 'ranjan', name: 'Ranjan', image: '/assets/ranjan.jpg', points: 30, hitText: 'වන් ෂොට්! 🥊', type: 'rare' },
    { id: 'piumi', name: 'Piumi', image: '/assets/piumi.jpg', points: 30, hitText: 'මගේ ක්‍රීම් එක! 🧴', type: 'rare' },
    { id: 'harini', name: 'Harini', image: '/assets/harini.jpg', points: 10, hitText: 'සිස්ටම් චේන්ජ්! 🔄', type: 'normal' },
    { id: 'akd', name: 'Anura', image: '/assets/anura.jpg', points: 10, hitText: 'සහෝදරයා! ✊', type: 'normal' },
    { id: 'sajith', name: 'Sajith', image: '/assets/sajith.jpg', points: 10, hitText: 'සීග්‍රගාමී! 🚀', type: 'normal' },
    { id: 'namal', name: 'Namal', image: '/assets/namal.jpg', points: 10, hitText: 'නාමල් බේබි! 🍼', type: 'normal' },
    { id: 'mahinda', name: 'Mahinda', image: '/assets/mahinda.jpg', points: 10, hitText: 'හොඳටම කළා! 💯', type: 'normal' }
  ];

  constructor() {
    this.initBooths();
  }

  initBooths() {
    const initialBooths: Booth[] = [];
    for (let i = 0; i < 8; i++) {
      initialBooths.push({ id: i, vip: null, isHit: false, warningPhase: false });
    }
    this.booths.set(initialBooths);
  }

  handleImageError(event: any) {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = '<span class="text-sm font-black text-red-500">IMAGE ERROR</span>';
  }

  startGame() {
    this.score.set(0);
    this.timeLeft.set(45);
    this.comboCount.set(0);
    this.currentSpeed = 1200;
    this.isPlaying.set(true);
    this.initBooths();
    
    clearInterval(this.gameTimerId);
    this.gameTimerId = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
        
        // Speed scaling
        if (this.timeLeft() % 5 === 0 && this.currentSpeed > 300) {
          this.currentSpeed -= 100; 
          this.startPopUpLoop(); 
        }
      } else {
        this.endGame();
      }
    }, 1000);

    this.startPopUpLoop();
  }

  startPopUpLoop() {
    clearInterval(this.popUpTimerId);
    this.popUpTimerId = setInterval(() => {
      this.triggerRandomVip();
      if (this.currentSpeed < 800 && Math.random() > 0.7) {
         setTimeout(() => this.triggerRandomVip(), 200);
      }
    }, this.currentSpeed);
  }

  triggerRandomVip() {
    if (!this.isPlaying()) return;

    const availableBooths = this.booths().filter(b => b.vip === null && !b.warningPhase);
    if (availableBooths.length === 0) return;

    const randomBooth = availableBooths[Math.floor(Math.random() * availableBooths.length)];
    
    let randomVip: Politician;
    const roll = Math.random();
    if (roll > 0.90) {
       randomVip = this.vipDb.find(v => v.type === 'boss')!;
    } else if (roll > 0.70) {
       const rares = this.vipDb.filter(v => v.type === 'rare');
       randomVip = rares[Math.floor(Math.random() * rares.length)];
    } else {
       // 70% chance for Normal
       const normals = this.vipDb.filter(v => v.type === 'normal');
       randomVip = normals[Math.floor(Math.random() * normals.length)];
    }

    this.booths.update(current => {
      const updated = [...current];
      updated[randomBooth.id].warningPhase = true;
      return updated;
    });

    setTimeout(() => {
       if(!this.isPlaying()) return;
       
       this.booths.update(current => {
         const updated = [...current];
         updated[randomBooth.id].warningPhase = false;
         updated[randomBooth.id].vip = randomVip;
         updated[randomBooth.id].isHit = false;
         return updated;
       });

      
       let displayTime = this.currentSpeed * 0.8;
       if (randomVip.type === 'boss') displayTime *= 0.7; 

       const timeout = setTimeout(() => {
         this.hideVip(randomBooth.id, true);
       }, displayTime);

       this.booths.update(current => {
         const updated = [...current];
         updated[randomBooth.id].timeoutId = timeout;
         return updated;
       });
    }, 400); 
  }

  hideVip(boothId: number, missed: boolean = false) {
    this.booths.update(current => {
      const updated = [...current];
      if (!updated[boothId].isHit) {
        updated[boothId].vip = null; 
        if (missed) {
          this.comboCount.set(0);
        }
      }
      return updated;
    });
  }

  whack(booth: Booth, index: number) {
    if (!this.isPlaying() || !booth.vip || booth.isHit) {

      if (!booth.vip && !booth.isHit && this.isPlaying()) {
        this.comboCount.set(0);
      }
      return;
    }

    // Combo logic
    this.comboCount.update(c => c + 1);
    const multiplier = this.comboMultiplier();
    const finalPoints = booth.vip.points * multiplier;
    this.score.update(s => s + finalPoints);

    if (booth.vip.type === 'boss') {
       this.isExtremeShaking.set(true);
       setTimeout(() => this.isExtremeShaking.set(false), 300);
    } else {
       this.isShaking.set(true);
       setTimeout(() => this.isShaking.set(false), 200);
    }

    const gridEl = document.querySelector('.grid') as HTMLElement;
    let x = 0, y = 0;
    if (gridEl) {
       const cell = gridEl.children[index] as HTMLElement;
       const rect = cell.getBoundingClientRect();
       const gridRect = gridEl.getBoundingClientRect();
       x = rect.left - gridRect.left + (rect.width / 2); 
       y = rect.top - gridRect.top;
    }
    
    this.spawnFloatingText(x, y, booth.vip.hitText, booth.vip.type, multiplier);

    // Hit State
    clearTimeout(booth.timeoutId);
    this.booths.update(current => {
      const updated = [...current];
      updated[index].isHit = true;
      return updated;
    });

    setTimeout(() => {
      this.booths.update(current => {
        const updated = [...current];
        updated[index].vip = null;
        updated[index].isHit = false;
        return updated;
      });
    }, 200); 
  }

  spawnFloatingText(x: number, y: number, text: string, type: string, multiplier: number) {
    const id = this.textIdCounter++;
    this.floatingTexts.update(texts => [...texts, { x, y, text, id, type, multiplier }]);
    
    setTimeout(() => {
      this.floatingTexts.update(texts => texts.filter(t => t.id !== id));
    }, 800);
  }

  endGame() {
    this.isPlaying.set(false);
    clearInterval(this.gameTimerId);
    clearInterval(this.popUpTimerId);
    this.initBooths();
  }

  ngOnDestroy() {
    clearInterval(this.gameTimerId);
    clearInterval(this.popUpTimerId);
  }
}