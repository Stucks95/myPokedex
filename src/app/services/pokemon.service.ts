import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  baseUrl: string = 'https://pokeapi.co/api/v2'
  imageUrl: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
  pokemonUrl: string = 'https://pokeapi.co/api/v2/pokemon-species'  // u can find species, description ecc..
  generationUrl: string = 'https://pokeapi.co/api/v2/generation'
  totalPokemons: number = 1292
  pokemonsByGen: Array<Object> = []

  constructor(private http: HttpClient) {}

  getAllPokemons(offset: number = 0, limit = this.totalPokemons): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      map((result: Object) => {
        console.log(result)
        return Object.values(result)[3]
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

  getGeneration() {
    this.http.get(`${this.generationUrl}/1`).subscribe((res: Object) => {
      this.pokemonsByGen = Object.values(res)[6]
      console.log('this.pokemonsByGen', this.pokemonsByGen)
      return this.pokemonsByGen
    })
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
