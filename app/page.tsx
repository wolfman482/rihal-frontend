'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Pokemon } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const limit = 20; // Pokémon per page
  const [totalPages, setTotalPages] = useState<number>(0); 

  useEffect(() => {
    const fetchTotalCount = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/?limit=1');
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / limit));
    };

    fetchTotalCount();
  }, []);

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true); 
      const offset = (currentPage - 1) * limit;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();

      const pokemonsDetails = await Promise.all(
        data.results.map(async (item: { url: string | URL | Request; }) => {
          const detailResponse = await fetch(item.url);
          return detailResponse.json();
        })
      );

      setPokemons(pokemonsDetails);
      setIsLoading(false);
    };

    fetchPokemons();
  }, [currentPage]);

  
  const paginationRange = (start: number, end: number) => [...Array(end - start + 1)].map((_, idx) => start + idx);

  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + 4, totalPages);
  if (totalPages - currentPage < 2) {
    startPage = Math.max(totalPages - 4, 1);
    endPage = totalPages;
  }

  return (
    <div className='py-24'>
      <div className='container'>
      {isLoading ? (
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
      ) : (
      <Table>
        <TableCaption>A list of Pokémon</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Pokémon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pokemons.map((pokemon) => (
            <TableRow key={pokemon.id}>
              <TableCell>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: 50, height: 50 }} />
              </TableCell>
              <TableCell>{pokemon.name}</TableCell>
              <TableCell>{pokemon.weight}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link href={`/pokemon/${pokemon.name}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); setCurrentPage((prev) => Math.max(prev - 1, 1));}} />
            </PaginationItem>
            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(1);}}>1</PaginationLink>
                </PaginationItem>
                {startPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
              </>
            )}
            {paginationRange(startPage, endPage).map(page => (
              <PaginationItem key={page}>
                <PaginationLink href="#" isActive={page === currentPage} onClick={(e) => {e.preventDefault(); setCurrentPage(page);}}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => {e.preventDefault(); setCurrentPage(totalPages);}}>{totalPages}</PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => {e.preventDefault(); setCurrentPage((prev) => Math.min(prev + 1, totalPages));}} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    </div>
    </div>
  );
}
