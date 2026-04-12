import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register/register';

export const routes: Routes = [
  // Main Dashboard
  { 
    path: '', 
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) 
  },
  { path: 'register-guild', component: RegisterComponent },
  // 🔥 Live & Multiplayer
  { path: 'games/tug-of-war', loadComponent: () => import('./features/games/tug-of-war/tug-of-war').then(m => m.TugOfWar) },
  { path: 'games/thattaya-game', loadComponent: () => import('./features/games/thattaya-game/thattaya-game').then(m => m.ThattayaGameComponent) },
  { path: 'games/pancha', loadComponent: () => import('./features/games/pancha/pancha').then(m => m.Pancha) },
  { path: 'games/photo-contest', loadComponent: () => import('./features/games/photo-contest/photo-contest').then(m => m.PhotoContest) },
  
  // 🎯 Action & Solo Skills
  { path: 'games/elephant-eye', loadComponent: () => import('./features/games/elephant-eye/elephant-eye').then(m => m.ElephantEye) },
  { path: 'games/sweeper', loadComponent: () => import('./features/games/sweeper/sweeper').then(m => m.Sweeper) },
  { path: 'games/catch', loadComponent: () => import('./features/games/catch-game/catch-game').then(m => m.CatchGame) },
  { path: 'games/grease-pole', loadComponent: () => import('./features/games/grease-pole/grease-pole').then(m => m.GreasePole) },
  { 
  path: 'games/hidden-guest', 
  loadComponent: () => import('./features/games/hidden-guest/hidden-guest').then(m => m.HiddenGuestComponent) 
},
{ 
    path: 'games/voice-jump', 
    loadComponent: () => import('./features/games/voice-jump/voice-jump').then(m => m.VoiceJumpComponent) 
  },
  // 🧠 Puzzle & Brain Games
  { path: 'games/raban', loadComponent: () => import('./features/games/raban/raban').then(m => m.Raban) },
{ path: 'games/kana-mutti', loadComponent: () => import('./features/games/kana-mutti/kana-mutti').then(m => m.KanaMutti) },
{ path: 'games/memory', loadComponent: () => import('./features/games/memory/memory').then(m => m.Memory) },
  { path: 'games/mutti', loadComponent: () => import('./features/games/kana-mutti/kana-mutti').then(m => m.KanaMutti) },
  { path: 'games/tic-tac-toe', loadComponent: () => import('./features/games/tic-tac-toe/tic-tac-toe').then(m => m.TicTacToe) },
  { path: 'games/memory', loadComponent: () => import('./features/games/memory/memory').then(m => m.Memory) },
  { path: 'games/pillow-fight', loadComponent: () => import('./features/games/pillow-fight/pillow-fight').then(m => m.PillowFight) },
  { path: '**', redirectTo: '' }
];