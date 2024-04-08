'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pokemon } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';


type Props = {
    params: {
        pokemonName: string;
    }
}

type PokemonEvolution = {
    speciesName: string;
    minLevel: number | null;
    triggerName: string | null;
};


const PokemonDetails = ({params: {pokemonName}}: Props) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [evolutions, setEvolutions] = useState<PokemonEvolution[]>([]);

  useEffect(() => {
    if (!pokemonName || typeof pokemonName !== 'string') return;

    const fetchPokemonDetails = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data: Pokemon = await response.json();
      setPokemon(data);
        // Fetch species to get the evolution chain URL
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Fetch the evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        parseEvolutionChain(evolutionData.chain);


    };

    const parseEvolutionChain = (chain: { species: { name: any; }; evolution_details: string | any[]; evolves_to: string | any[]; }, level = 0) => {
        let evolutionsArray = [];

        while (chain) {
            evolutionsArray.push({
                speciesName: chain.species.name,
                minLevel: chain.evolution_details.length > 0 ? chain.evolution_details[0].min_level : null,
                triggerName: chain.evolution_details.length > 0 ? chain.evolution_details[0].trigger.name : null,
            });

            chain = chain.evolves_to.length > 0 ? chain.evolves_to[0] : null;
        }

        setEvolutions(evolutionsArray);
    };

    fetchPokemonDetails();
  }, [pokemonName]);

  if (!pokemon) return     
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>;

  return (
    <><div className='flex justify-center'>
          <div className='container py-24'>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className='flex flex-wrap justify-center items-center'>
                    <Image 
                        src={pokemon.sprites.front_default}
                        width={300}
                        height={300}
                        alt="pokemon image"
                    />
                    <h1 className='flex pb-6 text-2xl'>{pokemon.name}</h1>
                </div>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                              STATS
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">
                          <ul>
                            {pokemon.stats.map((statEntry) => (
                                <li key={statEntry.stat.name}>
                                    {statEntry.stat.name}: {statEntry.base_stat}
                                </li>
                            ))}
                             </ul>
                          </div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                              TYPES
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">
                            <ul>
                                {pokemon.types.map((typeEntry, index) => (
                                    <li key={index}>{typeEntry.type.name}</li>
                                ))}
                            </ul>
                        </div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">EVOLUTIONS</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">
                          {evolutions.map((evo, index) => (
                                <div key={index}>
                                    <p>Species: <Link href={`/pokemon/${evo.speciesName}`} style={{ color: 'blue' }}>{evo.speciesName}</Link></p>
                                    <p>Minimum Level: {evo.minLevel ?? 'N/A'}</p>
                                    <p>Trigger: {evo.triggerName ?? 'N/A'}</p>
                                    <br></br>
                                    <hr></hr>
                                    <br></br>
                                </div>
                            ))}
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </div></>
  );
};

export default PokemonDetails;

function parseEvolutionChain(chain: any) {
    throw new Error('Function not implemented.');
}

