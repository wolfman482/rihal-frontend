export interface PokemonListItem {
    name: string;
    url: string;
  }
  
  export interface PokemonListResponse {
    results: PokemonListItem[];
  }
  

  export type Species = {
    name: string;
    url: string;
  };
  export interface Pokemon {
    id: number;
    name: string;
    weight: number;
    species: Species;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
    types: Array<{
      type: {
        name: string;
      };
    }>;
    sprites: {
      front_default: string;
    };
  }
  