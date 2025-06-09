import { Routes } from '@angular/router';
import { PokedexListComponent } from './pokedex-list/pokedex-list.component'; // Import PokedexListComponent

export const routes: Routes = [
  { path: '', component: PokedexListComponent },
  { path: 'pokedex', component: PokedexListComponent },
  { path: '**', redirectTo: 'pokedex' } // Redirect any unknown path to pokedex
];