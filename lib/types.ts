export interface PokemonListItem {
    name: string;
    url: string;
  }
  
  export interface PokemonListResponse {
    results: PokemonListItem[];
  }
  
  export interface Pokemon {
    id: number;
    name: string;
    weight: number; // Added weight
    sprites: {
      front_default: string;
    };
    types: Array<{
      type: {
        name: string;
      };
    }>;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
  }
  