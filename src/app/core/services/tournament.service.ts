import { Injectable, signal } from '@angular/core';

export interface Guild {
  id: number;
  name: string;
  logo: string;
  votes: number;
  points: number;
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
  guilds = signal<Guild[]>([
    { id: 1, name: 'LSR SR', logo: 'assets/lst.jpeg', votes: 1540, points: 2850 }, 
    { id: 2, name: 'LSR GL', logo: 'assets/gl.jpeg', votes: 1200, points: 2100 },
    { id: 3, name: 'LSR JR', logo: 'assets/jr.jpeg', votes: 980, points: 1950 }
  ]);

  registerGuild(name: string, logo: string) {
    const newGuild = { id: Date.now(), name, logo, votes: 0, points: 0 };
    this.guilds.update(g => [...g, newGuild]);
  }

  vote(guildId: number) {
    this.guilds.update(gs => gs.map(g => 
      g.id === guildId ? { ...g, votes: g.votes + 1 } : g
    ));
  }
}