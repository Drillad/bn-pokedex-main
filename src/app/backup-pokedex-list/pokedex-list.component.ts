// src/app/pokedex-list/pokedex-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonDataService } from '../services/pokemon-data.service'; // Import the service
import { PokemonCard } from '../models/pokemon.model'; // Import the PokemonCard interface
import { Observable, Subscription } from 'rxjs'; // Import Observable and Subscription

@Component({
  selector: 'app-pokedex-list',
  templateUrl: './pokedex-list.component.html',
  styleUrls: ['./pokedex-list.component.scss'] // Ensure this matches your file extension (.css or .scss)
})
export class PokedexListComponent implements OnInit, OnDestroy {

  pokedexCards$: Observable<PokemonCard[]>; // Observable for the selected Pokédex cards
  private pokedexSubscription: Subscription | undefined; // To manage subscription cleanup

  showSearchModal = false; // State to control the visibility of the search modal

  constructor(private pokemonDataService: PokemonDataService) {
    // Initialize the observable directly from the service
    this.pokedexCards$ = this.pokemonDataService.pokedexCards$;
  }

  ngOnInit(): void {
    // You don't necessarily need to subscribe here if using async pipe in template,
    // but useful for debugging or if you need the actual array in TS.
    // We'll use the async pipe in the template for simplicity.
  }

  ngOnDestroy(): void {
    // It's good practice to unsubscribe to prevent memory leaks,
    // though async pipe handles it for you for simple cases.
    this.pokedexSubscription?.unsubscribe();
  }

  /**
   * Called when a user wants to remove a Pokémon from their Pokédex.
   * @param cardId The ID of the card to remove.
   */
  removePokemon(cardId: string): void {
    this.pokemonDataService.removePokemonFromPokedex(cardId);
  }

  /**
   * Opens the search modal to allow users to add new Pokémon.
   */
  openSearchModal(): void {
    this.showSearchModal = true;
  }

  /**
   * Closes the search modal.
   */
  closeSearchModal(): void {
    this.showSearchModal = false;
  }

  /**
   * Handles adding a Pokémon from the search modal to the Pokédex.
   * (This method will be called by the search modal component later)
   * @param card The PokemonCard to add.
   */
  onPokemonSelectedForPokedex(card: PokemonCard): void {
    this.pokemonDataService.addPokemonToPokedex(card);
    this.closeSearchModal(); // Close modal after selection
  }
}