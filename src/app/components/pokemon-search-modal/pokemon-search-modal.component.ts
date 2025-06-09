// src/app/pokemon-search-modal/pokemon-search-modal.component.ts
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PokemonDataService } from '../../services/pokemon-data.service';
import { PokemonCard } from '../../models/pokemon.model';
import { Observable, BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, combineLatest, of, tap } from 'rxjs'; // Added combineLatest, of, tap

@Component({
  selector: 'app-pokemon-search-modal',
  templateUrl: './pokemon-search-modal.component.html',
  styleUrls: ['./pokemon-search-modal.component.scss']
})
export class PokemonSearchModalComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() pokemonSelected = new EventEmitter<PokemonCard>();

  searchTerm: string = '';
  searchResults: PokemonCard[] = [];
  isLoading: boolean = false;
  hasSearched: boolean = false;
  private searchTerms = new BehaviorSubject<string>('');

  constructor(private pokemonDataService: PokemonDataService) { }

  ngOnInit(): void {
    combineLatest([
      this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (!term.trim()) {
            this.hasSearched = false;
            this.isLoading = false; 
            return of([]); 
          }
          this.isLoading = true;
          this.hasSearched = true;
          // The service now handles both name and type filtering (client-side after API call)
          return this.pokemonDataService.searchPokemonCards(term);
        }),
        tap(() => this.isLoading = false)
      ),
      this.pokemonDataService.pokedexCards$ 
    ]).subscribe(([apiSearchResults, pokedexCards]) => {
      // Filter out Pokémon that are already in the Pokédex
      const pokedexCardIds = new Set(pokedexCards.map(card => card.id));
      this.searchResults = apiSearchResults.filter(card => !pokedexCardIds.has(card.id));

      // If the search term is empty, or no results found, then set hasSearched appropriately.
      if (!this.searchTerm.trim() && this.searchResults.length === 0) {
        this.hasSearched = false; // No results and no active search term
      } else if (this.searchResults.length === 0) {
        this.hasSearched = true; // Search term present, but no results found
      }
    });
  }

  onSearch(): void {
    this.searchTerms.next(this.searchTerm);
  }

  selectPokemonAndClose(card: PokemonCard): void {
    // The calculated levels are now part of the PokemonCard object returned by the service
    this.pokemonSelected.emit(card);
    this.handleCloseModal();
  }

  handleCloseModal(): void {
    this.closeModal.emit();
    this.searchTerm = '';
    this.searchResults = [];
    this.hasSearched = false;
    this.searchTerms.next(''); // Clear the search terms subject
  }

  // Helper function for happiness smileys
  public getHappinessArray(happinessLevel: number): any[] {
    return Array(Math.max(0, Math.min(10, happinessLevel))).fill(null);
  }
}