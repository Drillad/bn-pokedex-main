import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PokemonDataService } from './pokemon-data.service';
import { PokemonCard } from '../models/pokemon.model'; // Import PokemonCard

describe('PokemonDataService', () => {
  let service: PokemonDataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import for testing HTTP requests
      providers: [PokemonDataService]
    });
    service = TestBed.inject(PokemonDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that no outstanding requests are present
    localStorage.clear(); // Clear local storage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return search results for a valid query', (done) => {
    const mockCards: PokemonCard[] = [
      {
        id: 'xy7-1',
        name: 'Bulbasaur',
        imageUrl: 'url1',
        imageUrlHiRes: 'url1_hires',
        types: ['Grass'],
        supertype: 'Pokémon',
        subtype: 'Basic',
        hp: '60',
        number: '1'
      },
      {
        id: 'xy7-2',
        name: 'Ivysaur',
        imageUrl: 'url2',
        imageUrlHiRes: 'url2_hires',
        types: ['Grass'],
        supertype: 'Pokémon',
        subtype: 'Stage 1',
        hp: '90',
        number: '2'
      }
    ];

    service.searchPokemonCards('Bulbasaur').subscribe(cards => {
      expect(cards.length).toBe(2);
      expect(cards[0].name).toBe('Bulbasaur');
      expect(cards[1].name).toBe('Ivysaur');
      done();
    });

    const req = httpTestingController.expectOne('https://api.pokemontcg.io/v1/cards?name=Bulbasaur*');
    expect(req.request.method).toBe('GET');
    req.flush({ cards: mockCards }); // Provide the mock response
  });

  it('should add a Pokemon card to the pokedex', (done) => {
    const newCard: PokemonCard = {
      id: 'mock1',
      name: 'Mock Pokemon',
      imageUrl: 'mockUrl',
      imageUrlHiRes: 'mockUrlHiRes',
      types: ['Colorless'],
      supertype: 'Pokémon',
      subtype: 'Basic',
      hp: '50',
      number: '1'
    };

    service.addPokemonToPokedex(newCard);

    service.pokedexCards$.subscribe(pokedex => {
      expect(pokedex.length).toBe(1);
      expect(pokedex[0]).toEqual(newCard);
      done();
    });
  });

  it('should remove a Pokemon card from the pokedex', (done) => {
    const card1: PokemonCard = { id: 'card1', name: 'Pikachu', imageUrl: 'a', imageUrlHiRes: 'a', types: ['L'], supertype: 'P', subtype: 'B', hp: '60', number: '1' };
    const card2: PokemonCard = { id: 'card2', name: 'Charmander', imageUrl: 'b', imageUrlHiRes: 'b', types: ['F'], supertype: 'P', subtype: 'B', hp: '60', number: '2' };

    service.addPokemonToPokedex(card1);
    service.addPokemonToPokedex(card2);

    service.removePokemonFromPokedex('card1');

    service.pokedexCards$.subscribe(pokedex => {
      expect(pokedex.length).toBe(1);
      expect(pokedex[0]).toEqual(card2);
      done();
    });
  });

  it('should not add duplicate Pokemon cards to the pokedex', (done) => {
    const newCard: PokemonCard = {
      id: 'mock1',
      name: 'Mock Pokemon',
      imageUrl: 'mockUrl',
      imageUrlHiRes: 'mockUrlHiRes',
      types: ['Colorless'],
      supertype: 'Pokémon',
      subtype: 'Basic',
      hp: '50',
      number: '1'
    };

    service.addPokemonToPokedex(newCard);
    service.addPokemonToPokedex(newCard); // Try adding again

    service.pokedexCards$.subscribe(pokedex => {
      expect(pokedex.length).toBe(1); // Should still be 1
      done();
    });
  });

  it('should load pokedex from local storage on init', (done) => {
    const storedCard: PokemonCard = { id: 'stored1', name: 'Stored Pokemon', imageUrl: 's', imageUrlHiRes: 's', types: ['N'], supertype: 'P', subtype: 'B', hp: '70', number: '1' };
    localStorage.setItem('pokedex', JSON.stringify([storedCard]));

    // Re-create service to simulate re-initialization
    service = new PokemonDataService(httpTestingController as any); // Cast as any for simplicity in test
    service.pokedexCards$.subscribe(pokedex => {
      expect(pokedex.length).toBe(1);
      expect(pokedex[0].id).toBe('stored1');
      done();
    });
  });

  it('should save pokedex to local storage', (done) => {
    const newCard: PokemonCard = { id: 'save1', name: 'Save Pokemon', imageUrl: 't', imageUrlHiRes: 't', types: ['N'], supertype: 'P', subtype: 'B', hp: '80', number: '1' };
    service.addPokemonToPokedex(newCard);

    setTimeout(() => {
      const storedPokedex = JSON.parse(localStorage.getItem('pokedex') || '[]');
      expect(storedPokedex.length).toBe(1);
      expect(storedPokedex[0].id).toBe('save1');
      done();
    }, 0);
  });
});