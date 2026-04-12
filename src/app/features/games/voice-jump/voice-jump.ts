import { Component, signal, OnDestroy, OnInit, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Character {
  id: string;
  name: string;
  image: string;
  sound: string; 
}

@Component({
  selector: 'app-voice-jump',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center font-sans overflow-hidden select-none relative">
      
      <div class="absolute inset-0 z-0 transition-colors duration-300"
           [ngStyle]="{'background-color': volumeLevel() > 60 ? '#450a0a' : (volumeLevel() > 20 ? '#1e1b4b' : '#050505')}">
         <div class="absolute bottom-0 w-[200%] h-64 bg-gradient-to-t from-blue-900/30 to-transparent z-0 opacity-50"
              style="background-image: linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.3) 75%, rgba(59, 130, 246, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.3) 75%, rgba(59, 130, 246, 0.3) 76%, transparent 77%, transparent); background-size: 50px 50px; transform: perspective(500px) rotateX(60deg); transform-origin: bottom;">
         </div>
      </div>

      <div *ngIf="gameState() === 'playing' || gameState() === 'gameover'" class="absolute top-6 w-full z-50 flex justify-between px-6 md:px-12 pointer-events-none items-start">
        <div class="glass-panel px-6 py-2 rounded-2xl border border-white/10 shadow-xl">
           <span class="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">Distance</span>
           <h1 class="text-4xl md:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-md">
             {{ score() }}<span class="text-xl text-zinc-500">m</span>
           </h1>
        </div>

        <div class="glass-panel px-6 py-4 rounded-2xl border border-white/10 shadow-xl flex flex-col items-end w-48 md:w-64" *ngIf="gameState() === 'playing'">
           <span class="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2">Mic / Key Input</span>
           <div class="w-full h-3 bg-zinc-900 rounded-full border border-white/10 overflow-hidden relative shadow-inner">
              <div class="h-full transition-all duration-75"
                   [ngClass]="volumeLevel() > 60 || isJumpingKey() ? 'bg-red-500 shadow-[0_0_10px_red]' : (volumeLevel() > 20 || isWalkingKey() ? 'bg-blue-500 shadow-[0_0_10px_blue]' : 'bg-zinc-700')"
                   [style.width.%]="isJumpingKey() ? 100 : (isWalkingKey() ? 40 : volumeLevel())"></div>
              <div class="absolute top-0 bottom-0 left-[20%] w-0.5 bg-white/30"></div>
              <div class="absolute top-0 bottom-0 left-[60%] w-0.5 bg-white/30"></div>
           </div>
        </div>
      </div>

      <div *ngIf="gameState() === 'playing' || gameState() === 'gameover'" class="relative z-10 w-full max-w-5xl h-[400px] md:h-[500px] bg-gradient-to-b from-transparent to-black/80 border-4 border-zinc-800 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] backdrop-blur-sm">
        
        <div class="absolute inset-y-0 left-0 transition-transform duration-75 ease-linear will-change-transform"
             [style.transform]="'translateX(' + cameraX() + 'px)'"
             [style.width.px]="worldWidth">
             
             <div *ngFor="let plat of platforms()" class="absolute bottom-0 h-24 bg-gradient-to-t from-blue-900/80 to-blue-600/80 border-t-4 border-blue-400 rounded-t-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md"
                  [style.left.px]="plat.x" [style.width.px]="plat.w">
                  <div class="absolute top-0 left-0 w-full h-1 bg-white/50 rounded-t-xl"></div>
                  <div class="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px);"></div>
             </div>

             <div class="absolute bottom-[-50px] w-full h-24 bg-red-600/30 blur-[40px] z-0"></div>

             <div class="absolute z-30 transition-none will-change-transform"
                  [style.bottom.px]="playerVisualY() + 96" 
                  [style.left.px]="playerX()">
               
               <div class="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-transform"
                    [ngClass]="{
                      'scale-125 drop-shadow-[0_0_20px_rgba(239,68,68,1)]': jumpCount() > 0, 
                      'scale-100 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]': jumpCount() === 0
                    }">
                 
                 <img [src]="selectedChar()?.image" 
                      class="w-full h-full object-cover rounded-full border-[3px] border-white/80 bg-black shadow-2xl transition-transform duration-[400ms]"
                      [style.transform]="'rotate(' + playerRotation() + 'deg)'"
                      (error)="handleImageError($event)">
                      
                 <div *ngIf="jumpCount() === 2" class="absolute -bottom-4 w-10 h-10 bg-white/50 blur-xl rounded-full animate-ping"></div>
               </div>
             </div>
        </div>
      </div>

      <div *ngIf="gameState() !== 'playing'" class="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-2xl bg-black/80 p-4">
        
        <ng-container *ngIf="gameState() === 'select'">
          <div class="text-center mb-8 animate-fade-in">
             <h2 class="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 uppercase tracking-tighter drop-shadow-2xl">
               CHOOSE FIGHTER
             </h2>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl w-full px-4">
             <div *ngFor="let char of characters" 
                  (click)="selectCharacter(char)"
                  class="bg-zinc-900/40 border border-white/10 rounded-3xl p-4 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:scale-105 hover:bg-blue-900/30 transition-all shadow-xl group">
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-zinc-700 group-hover:border-blue-500 mb-4 bg-black transition-colors shadow-inner">
                   <img [src]="char.image" class="w-full h-full object-cover" (error)="handleImageError($event)">
                </div>
                <h3 class="font-black italic text-lg md:text-xl uppercase text-white group-hover:text-blue-400">{{ char.name }}</h3>
             </div>
          </div>
          <button routerLink="/" class="mt-12 text-zinc-500 font-bold uppercase text-xs hover:text-white transition-colors tracking-widest bg-white/5 px-6 py-2 rounded-full">
            ⬅️ Back to Arena
          </button>
        </ng-container>

        <ng-container *ngIf="gameState() === 'idle'">
          <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-6 shadow-[0_0_50px_rgba(59,130,246,0.6)] animate-bounce-slow bg-black">
             <img [src]="selectedChar()?.image" class="w-full h-full object-cover">
          </div>
          <h3 class="text-6xl md:text-8xl font-black italic mb-4 text-white tracking-tighter text-center">
            කෑගහපන් <span class="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">යකෝ!</span>
          </h3>
          
          <div class="glass-panel p-6 rounded-2xl max-w-md w-full mb-8 text-center shadow-2xl border border-white/10">
             <p class="text-zinc-300 font-bold uppercase text-sm mb-4 tracking-widest">New Protocol: Double Jump!</p>
             <ul class="text-xs text-zinc-400 text-left space-y-3 font-mono">
                <li class="flex items-center gap-3">➡️ <span class="text-white">Hold Right Arrow</span> = Walk</li>
                <li class="flex items-center gap-3">🚀 <span class="text-white">Tap Spacebar x2</span> = Double Jump!</li>
                <li class="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">🎤 <span class="text-yellow-500 font-bold">Or use your Mic to Scream!</span></li>
             </ul>
          </div>

          <div class="flex flex-col md:flex-row gap-4 items-center w-full max-w-md justify-center">
            <button (click)="startWithoutMic()" class="px-10 py-5 w-full bg-blue-600 text-white font-black text-xl uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.6)] border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-2 transition-all">
              PLAY (KEYBOARD) ⌨️
            </button>
            <button (click)="requestMicAndStart()" class="px-8 py-5 w-full bg-red-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] border-b-[6px] border-red-800 active:border-b-0 active:translate-y-2 transition-all">
              PLAY (MIC) 🎤
            </button>
          </div>
          
          <button (click)="changeCharacter()" class="mt-8 text-zinc-400 font-bold uppercase text-xs hover:text-white transition-colors tracking-widest border border-zinc-700 px-6 py-2 rounded-full">
            🔄 Switch Character
          </button>
        </ng-container>

        <ng-container *ngIf="gameState() === 'gameover'">
          <div class="text-[120px] mb-2 filter grayscale drop-shadow-2xl">💀</div>
          <h3 class="text-6xl md:text-8xl font-black italic mb-2 text-red-600 tracking-tighter text-center drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
            ළිඳේ නේද?
          </h3>
          <p class="text-white font-black uppercase tracking-widest text-3xl mb-2">Distance: {{ score() }}m</p>
          
          <p class="text-zinc-500 text-sm font-bold italic mb-8 max-w-sm text-center">
            "අම්මෝ ඒ සද්දේ! කණත් පැළුණා යකෝ!" 🔊
          </p>
          
          <div class="flex flex-col gap-4 w-full max-w-xs">
            <button (click)="startGame()" class="px-10 py-6 w-full bg-white text-black font-black text-2xl uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-transform active:scale-95">
              RETRY 🔄
            </button>
            <button (click)="changeCharacter()" class="px-10 py-4 w-full bg-transparent border-2 border-zinc-700 text-zinc-400 font-bold uppercase text-xs hover:text-white hover:border-zinc-500 rounded-2xl transition-colors tracking-widest">
              Change Character
            </button>
          </div>
        </ng-container>

      </div>
    </div>
  `,
  styles: [`
    .glass-panel { background: rgba(15, 15, 15, 0.6); backdrop-filter: blur(15px); }
    .animate-bounce-slow { animation: bounce 2s infinite; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    :host { display: block; }
  `]
})
export class VoiceJumpComponent implements OnInit, OnDestroy {
  gameState = signal<'select' | 'idle' | 'playing' | 'gameover'>('select');
  score = signal(0);
  
  // 🎵 Sounds added to characters!
  characters: Character[] = [
    { id: 'smoker', name: 'smoker', image: '/assets/smoker.png', sound: '/assets/sounds/smoker_hit.mp3' },
    { id: 'ranjan', name: 'Ranjan', image: '/assets/ranjan.jpg', sound: '/assets/sounds/ranjan_hit.mp3' },
    { id: 'piumi', name: 'Piumi', image: '/assets/piumi.jpg', sound: '/assets/sounds/piumi_hit.mp3' },
    { id: 'sajith', name: 'Sajith', image: '/assets/sajith.jpg', sound: '/assets/sounds/sajith_hit.mp3' },
    { id: 'anura', name: 'Anura', image: '/assets/anura.jpg', sound: '/assets/sounds/anura_hit.mp3' },
    { id: 'namal', name: 'Namal', image: '/assets/namal.jpg', sound: '/assets/sounds/namal_hit.mp3' },
    { id: 'harini', name: 'Harini', image: '/assets/harini.jpg', sound: '/assets/sounds/harini_hit.mp3' },
    { id: 'mahinda', name: 'Mahinda', image: '/assets/mahinda.jpg', sound: '/assets/sounds/mahinda_hit.mp3' }
  ];
  selectedChar = signal<Character | null>(null);

  // Audio 
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  microphone: MediaStreamAudioSourceNode | null = null;
  volumeLevel = signal(0);
  usingMic = signal(false);

  // Keyboard Flags
  isWalkingKey = signal(false);
  isJumpingKey = signal(false);
  jumpKeyJustPressed = false;

  // PHYSICS ENGINE 
  playerX = signal(100); 
  playerY = 0; 
  playerVisualY = signal(0); 
  playerVelocityY = 0;
  playerRotation = signal(0); 
  
  jumpCount = signal(0); 

  cameraX = computed(() => -Math.max(0, this.playerX() - 300)); 
  
  readonly gravity = -0.8; 
  readonly jumpPower = 15; 
  readonly walkSpeed = 6;  
  readonly worldWidth = 20000; 

  platforms = signal<{x: number, w: number}[]>([]);
  private animationFrameId: number = 0;

  ngOnInit() {
    this.generateLevel();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameState() !== 'playing') return;

    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      this.isJumpingKey.set(true);
      
      if (!this.jumpKeyJustPressed) {
        this.triggerJump();
        this.jumpKeyJustPressed = true;
      }
    }
    
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      this.isWalkingKey.set(true);
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      this.isJumpingKey.set(false);
      this.jumpKeyJustPressed = false;
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      this.isWalkingKey.set(false);
    }
  }

  selectCharacter(char: Character) {
    this.selectedChar.set(char);
    this.gameState.set('idle'); 
  }

  changeCharacter() {
    this.gameState.set('select'); 
  }

  generateLevel() {
    const plats = [];
    let currentX = 0; 
    
    plats.push({ x: 0, w: 800 });
    currentX = 800;

    for(let i=0; i<50; i++) {
       const gap = Math.random() * 200 + 150; 
       currentX += gap;
       
       const platWidth = Math.random() * 400 + 200; 
       plats.push({ x: currentX, w: platWidth });
       currentX += platWidth;
    }
    this.platforms.set(plats);
  }

  async requestMicAndStart() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.smoothingTimeConstant = 0.3; 
      this.analyser.fftSize = 256; 
      this.microphone.connect(this.analyser);
      
      this.usingMic.set(true);
      this.startGame();
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Mic access denied! Playing with keyboard instead.");
      this.startWithoutMic();
    }
  }

  startWithoutMic() {
    this.usingMic.set(false);
    this.startGame();
  }

  startGame() {
    this.score.set(0);
    this.playerX.set(100);
    this.playerY = 0;
    this.playerVisualY.set(0);
    this.playerVelocityY = 0;
    this.playerRotation.set(0);
    this.jumpCount.set(0);
    
    this.isWalkingKey.set(false);
    this.isJumpingKey.set(false);
    this.jumpKeyJustPressed = false;
    
    this.generateLevel(); 
    this.gameState.set('playing');
    
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }

    cancelAnimationFrame(this.animationFrameId);
    this.gameLoop();
  }

  getVolume() {
    if (!this.analyser || !this.usingMic()) return 0;
    const array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    let sum = 0;
    for (let i = 0; i < array.length; i++) { sum += array[i]; }
    const average = sum / array.length;
    return Math.min(100, (average / 255) * 100 * 2.5); 
  }

  triggerJump() {
    if (this.jumpCount() < 2) {
      this.playerVelocityY = this.jumpPower;
      this.jumpCount.update(c => c + 1);
    }
  }

  gameLoop() {
    if (this.gameState() !== 'playing') return;

    const currentVol = this.getVolume();
    this.volumeLevel.set(currentVol);

    if (currentVol > 65) {
      if (!this.jumpKeyJustPressed) {
         this.triggerJump();
         this.jumpKeyJustPressed = true;
      }
    } else if (currentVol < 40 && !this.isJumpingKey()) {
      this.jumpKeyJustPressed = false; 
    }

    let moveSpeed = 0;
    if (currentVol > 20 || this.isWalkingKey()) moveSpeed = this.walkSpeed;
    if (currentVol > 65 || this.isJumpingKey() || this.jumpCount() > 0) moveSpeed = this.walkSpeed + 2; 
    
    this.playerX.update(x => x + moveSpeed);
    
    this.score.set(Math.floor(this.playerX() / 50));

    this.playerVelocityY += this.gravity;
    this.playerY += this.playerVelocityY;

    if (this.jumpCount() > 0) {
       this.playerRotation.update(r => r + 15); 
    } else {
       const currentRot = this.playerRotation() % 360;
       if (currentRot > 0) this.playerRotation.set(currentRot > 180 ? 360 : 0);
    }

    let isOnPlatform = false;
    const px = this.playerX();
    const halfWidth = 24; 

    for (let p of this.platforms()) {
       if (px + halfWidth > p.x && px - halfWidth < p.x + p.w) {
          isOnPlatform = true;
          break;
       }
    }

    if (isOnPlatform && this.playerY <= 0 && this.playerVelocityY <= 0) {
       this.playerY = 0;
       this.playerVelocityY = 0;
       this.jumpCount.set(0); 
    }

    this.playerVisualY.set(this.playerY);

    if (this.playerY < -300) {
       this.gameOver();
       return; 
    }

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  // 🔊 SOUD EFFECT LOGIC ADDED HERE!
  playDeathSound() {
    const char = this.selectedChar();
    if (char && char.sound) {
      const audio = new Audio(char.sound);
      audio.volume = 1.0;
      audio.play().catch(err => console.warn('Sound could not be played:', err));
    }
  }

  gameOver() {
    if (this.gameState() !== 'gameover') {
      this.playDeathSound(); 
      this.gameState.set('gameover');
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.microphone) this.microphone.disconnect();
    if (this.audioContext) this.audioContext.close();
  }

  handleImageError(event: any) {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = '<span class="text-3xl">🗣️</span>';
  }
}