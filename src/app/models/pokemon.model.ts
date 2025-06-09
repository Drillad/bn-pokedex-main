// src/app/models/pokemon.model.ts

// Interface for a single attack
export interface PokemonAttack {
  cost: string[];
  name: string;
  text: string;
  damage: string;
  convertedEnergyCost: number;
}

// Interface for a single weakness or resistance
export interface PokemonTypeEffect {
  type: string;
  value: string;
}

// Interface for a single Pokémon card
export interface PokemonCard {
  id: string;
  name: string;
  nationalPokedexNumber?: number; 
  imageUrl: string;
  imageUrlHiRes: string;
  types: string[];
  supertype: string;
  subtype: string;
  hp: string; // 
  retreatCost?: string[]; 
  convertedRetreatCost?: number; 
  number: string;
  artist?: string; 
  rarity?: string; 
  series?: string; 
  set?: string; 
  setCode?: string; 
  attacks?: PokemonAttack[]; 
  weaknesses?: PokemonTypeEffect[]; 
  resistances?: PokemonTypeEffect[]; 
  text?: string[]; 
  flavorText?: string; 
  ancientTrait?: { 
    name: string;
    text: string;
  };
  calculatedHpLevel?: number;
  calculatedStrengthLevel?: number;
  calculatedWeaknessLevel?: number;
  calculatedHappinessLevel?: number;
  calculatedDamage?: number;
}