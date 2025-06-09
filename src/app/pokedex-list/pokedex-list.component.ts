// src/app/pokedex-list/pokedex-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonDataService } from '../services/pokemon-data.service';
import { PokemonCard } from '../models/pokemon.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-pokedex-list',
  templateUrl: './pokedex-list.component.html',
  styleUrls: ['./pokedex-list.component.scss']
})
export class PokedexListComponent implements OnInit, OnDestroy {

  pokedexCards$: Observable<PokemonCard[]>;
  private pokedexSubscription: Subscription | undefined;

  showSearchModal = false;

  constructor(private pokemonDataService: PokemonDataService) {
    this.pokedexCards$ = this.pokemonDataService.pokedexCards$;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.pokedexSubscription?.unsubscribe();
  }

  removePokemon(cardId: string): void {
    this.pokemonDataService.removePokemonFromPokedex(cardId);
  }

  openSearchModal(): void {
    this.showSearchModal = true;
  }

  closeSearchModal(): void {
    this.showSearchModal = false;
  }

  onPokemonSelectedForPokedex(card: PokemonCard): void {
    // When a Pokémon is selected from the modal, it already has calculated levels
    this.pokemonDataService.addPokemonToPokedex(card);
    this.closeSearchModal(); // Close modal after adding
  }

  // >>> THIS IS THE NEWLY CORRECTED FUNCTION THAT GENERATES THE SMILEY ARRAY <<<
  public getHappinessArray(happinessLevel: number): any[] {
    // Rule: 1 smiley per 1 happiness point, maxed at 10.
    // Ensure the number of smileys is between 0 and 10.
    return Array(Math.max(0, Math.min(10, happinessLevel))).fill(null);
  }
}