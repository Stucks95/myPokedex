import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  baseUrl = 'https://pokeapi.co/api/v2';
  imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  pokemonUrl = 'https://pokeapi.co/api/v2/pokemon-species';  // u can find species, generations, description ecc..

  constructor(private http: HttpClient) {
  }

  getAllPokemons(offset: number = 0, limit: number = 1281) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      map((result: Object) => {
        return Object.values(result)[3];
      }),
      map((pokemons: any) => {
        return pokemons.map((poke: any, index: any) => {
          poke.image = this.getPokeImage(index + offset + 1);
          poke.pokeIndex = index + offset + 1;
          return poke;
        })
      })
    )
  }

  getPokemon(offset: number = 0, limit: number = 25) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      map((result: Object) => {
        return Object.values(result)[3];
      }),
      map((pokemons: any) => {
        return pokemons.map((poke: any, index: any) => {
          poke.image = this.getPokeImage(index + offset + 1);
          poke.pokeIndex = index + offset + 1;
          return poke;
        })
      })
    )
  }

  getSpecies(pokeIndex: any) {
    return this.http.get(`${this.pokemonUrl}/${pokeIndex}`).pipe(
      map((spec: any) => {
        return spec;
      })
    )
  }

  getPokeImage(index: any) {
    return `${this.imageUrl}${index}.png`;
  }

  findPokemon(search: any) {
    return this.http.get(`${this.baseUrl}/pokemon/${search}`).pipe(
      map((poke: any) => {
        poke.image = this.getPokeImage(poke.id);
        poke.pokeIndex = poke.id;
        return poke;
      })
    )
  }
   
  getPokeDetails(index: any) {
    return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
      map((poke: any) => {
        return poke;
      })
    )
  }
   
}
