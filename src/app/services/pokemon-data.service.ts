// src/app/services/pokemon-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { PokemonCard, PokemonAttack, PokemonTypeEffect } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {
  private apiUrl = 'http://localhost:3030/api/cards';

  private pokedexCardsSubject = new BehaviorSubject<PokemonCard[]>([]);
  public pokedexCards$ = this.pokedexCardsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPokedexFromLocalStorage();
  }

  private parseDamageValue(damage: string | undefined): number {
    if (!damage) { return 0; }
    const parsed = parseInt(damage.replace(/[^\d]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  private calculateHpLevel(hp: string | undefined): number {
    const parsedHp = parseInt(hp || '0', 10);
    return Math.min(100, isNaN(parsedHp) ? 0 : parsedHp);
  }

  private calculateStrengthLevel(attacks: PokemonAttack[] | undefined): number {
    const attackCount = attacks?.length || 0;
    return Math.min(100, attackCount * 50);
  }

  private calculateWeaknessLevel(weaknesses: PokemonTypeEffect[] | undefined): number {
    const weaknessCount = weaknesses?.length || 0;
    return Math.min(100, weaknessCount * 100);
  }

  private calculateHappinessLevel(card: PokemonCard): number {
    const hpLevel = this.calculateHpLevel(card.hp);
    const totalDamage = (card.attacks || []).reduce((sum, attack) => sum + this.parseDamageValue(attack.damage), 0);
    const weaknessLevel = this.calculateWeaknessLevel(card.weaknesses);

    const calculatedHp = hpLevel;
    const calculatedDamage = totalDamage;
    const calculatedWeaknessImpact = weaknessLevel / 25;

    const happiness = ((calculatedHp / 10) + (calculatedDamage / 10) + 12.5 - (calculatedWeaknessImpact)) / 5;

    return Math.max(0, Math.round(happiness));
  }

  private mapToPokemonCard(rawCard: any): PokemonCard {
    // If rawCard has a singular 'type' string, convert it to an array for the 'types' property
    const types: string[] = rawCard.type ? [rawCard.type] : [];

    const mappedCard: PokemonCard = {
      id: rawCard.id || '',
      name: rawCard.name || 'Unknown',
      imageUrl: rawCard.imageUrl || rawCard.images?.small || '',
      imageUrlHiRes: rawCard.imageUrlHiRes || rawCard.images?.large || '',
      types: types, // Assign the converted 'types' array here
      supertype: rawCard.supertype || '',
      subtype: rawCard.subtype || '',
      hp: rawCard.hp || '0',
      number: rawCard.number || '',
      nationalPokedexNumber: rawCard.nationalPokedexNumber,
      retreatCost: rawCard.retreatCost,
      convertedRetreatCost: rawCard.convertedRetreatCost,
      artist: rawCard.artist,
      rarity: rawCard.rarity,
      series: rawCard.series,
      set: rawCard.set,
      setCode: rawCard.setCode,
      attacks: rawCard.attacks || [],
      weaknesses: rawCard.weaknesses || [],
      resistances: rawCard.resistances || [],
      text: rawCard.text,
      flavorText: rawCard.flavorText,
      ancientTrait: rawCard.ancientTrait
    };

    mappedCard.calculatedHpLevel = this.calculateHpLevel(mappedCard.hp);
    mappedCard.calculatedStrengthLevel = this.calculateStrengthLevel(mappedCard.attacks);
    mappedCard.calculatedWeaknessLevel = this.calculateWeaknessLevel(mappedCard.weaknesses);
    mappedCard.calculatedHappinessLevel = this.calculateHappinessLevel(mappedCard);

    return mappedCard;
  }

  searchPokemonCards(term: string): Observable<PokemonCard[]> {
    const lowerCaseTerm = term.trim().toLowerCase();
    const searchUrl = `${this.apiUrl}?name=${lowerCaseTerm}`;

    if (!lowerCaseTerm) {
      return of([]);
    }

    return this.http.get<{ cards: any[] }>(searchUrl).pipe(
      map(response => {
        // Just map the raw cards to PokemonCard objects.
        // The backend now handles the name OR type filtering.
        return response.cards.map(rawCard => this.mapToPokemonCard(rawCard));
      }),
      tap(cards => console.log('Final filtered cards from Local API (backend handled name/type):', cards)),
      catchError(error => {
        console.error('Search error in PokemonDataService:', error);
        return of([]);
      })
    );
  }

  addPokemonToPokedex(card: PokemonCard): void {
    const currentPokedex = this.pokedexCardsSubject.value;
    if (!currentPokedex.some(c => c.id === card.id)) {
      const updatedPokedex = [...currentPokedex, card];
      this.pokedexCardsSubject.next(updatedPokedex);
      this.savePokedexToLocalStorage(updatedPokedex);
    }
  }

  removePokemonFromPokedex(cardId: string): void {
    const currentPokedex = this.pokedexCardsSubject.value;
    const updatedPokedex = currentPokedex.filter(card => card.id !== cardId);
    this.pokedexCardsSubject.next(updatedPokedex);
    this.savePokedexToLocalStorage(updatedPokedex);
  }

  private savePokedexToLocalStorage(pokedex: PokemonCard[]): void {
    localStorage.setItem('pokedexCards', JSON.stringify(pokedex));
  }

  private loadPokedexFromLocalStorage(): void {
    const savedPokedex = localStorage.getItem('pokedexCards');
    if (savedPokedex) {
      this.pokedexCardsSubject.next(JSON.parse(savedPokedex));
    }
  }
}