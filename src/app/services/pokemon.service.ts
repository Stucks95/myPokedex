import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import pokeByGen from './pokeByGen.json';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  // ENDPOINT API
  readonly appVersion: string = environment.version
  readonly baseUrl: string = "https://pokeapi.co/api/v2"
  readonly pokemonUrl: string = "https://pokeapi.co/api/v2/pokemon/"
  readonly typesUrl: string = "https://pokeapi.co/api/v2/type/" // + id or name
  readonly moveUrl: string = "https://pokeapi.co/api/v2/move/"
  readonly imageUrl: string = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
  readonly speciesUrl: string = "https://pokeapi.co/api/v2/pokemon-species"  // u can find species, description ecc..
  readonly evolutionUrl: string = "https://pokeapi.co/api/v2/evolution-chain"
  
  readonly totalPokemons: number = 905 // untill 8th gen
  currentPokeID: number

  constructor(private http: HttpClient) {}

  updateCurrentIdPoke(pokeId: number): void {
    this.currentPokeID = pokeId
  }

  getCurrentIdPoke(): number {
    return this.currentPokeID
  }

  getPokemons(offset: number, limit: number, first_index: number): Observable<Object> {
    return this.http.get(this.pokemonUrl+"?offset="+offset+"&limit="+limit)
    .pipe(
      map((data: Object) => {
      let results: Object[] = Object.values(data)[3]
      let i: number = first_index
      return results.map((poke: any) => {
        poke.index = i
        poke.image = this.getPokeImage(poke.index)
        i++
        return poke
      })
    }))
  }

  getMoves(pokeIndex: number) {
    return this.http.get(this.pokemonUrl+pokeIndex).pipe(
      map((poke: any) => {
        return poke.moves
    }))
  }

  getDetailsMove(urlMove: string): Observable<Object> {
    return this.http.get(urlMove)
  }

  getTypes(): Observable<{count: number, results: {name:string, url: string}[]}> {
    let types: {count: number, results: {name:string, url: string}[]} = {count: 0, results: []}
    return this.http.get(this.typesUrl).pipe(
      map((res: any) => {
        types.count = res.count
        types.results = res.results
        return types
    }))
  }

  getPokemonByType(type: string) {
    return this.http.get(this.typesUrl+type).pipe(
      map((res: any) => {
        return res.pokemon
    }))
  }

  getPokeDetails(index: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
      map((poke: Object) => {
        return poke
      })
    )
  }

  getPokemonInfo(name: string, lastPokeIndex: number): Observable<Object> {
    let pokemon: {index: number, name: string, image: string} = {index: 0, name: '', image: ''}
    return this.http.get(this.pokemonUrl+name).pipe(
      map((poke: any) => {
        if(poke.id <= lastPokeIndex) {
          pokemon.index = poke.id
          pokemon.name = poke.name
          pokemon.image = this.getPokeImage(pokemon.index)
          return pokemon
        } else {
          return pokemon
        }
      })
    )
  }

  getEvolutions(index: number): Observable<any> {
    return this.getSpecies(index).pipe(
      map((spec: any) => {
      return this.http.get(spec.evolution_chain.url).pipe(
        map((evo: any) => {
          var firstEvolveTo = evo.chain.evolves_to[0]
          // 1 EVO Poke
          if(firstEvolveTo) {
            evo.evo1Name = evo.chain.evolves_to[0].species.name
            evo.evo2Name = ''
            var secondEvolveTo = evo.chain.evolves_to[0].evolves_to[0]
            // 2 EVO Poke
            if(secondEvolveTo) {
              evo.evo2Name = evo.chain.evolves_to[0].evolves_to[0].species.name
            }
          }
          // NO EVO Poke
          else {
            evo.evo1Name = ''
            evo.evo2Name = ''
          }
          return evo
        })
      )}
    ))
  }

  getSpecies(pokeIndex: any) {
    return this.http.get(`${this.speciesUrl}/${pokeIndex}`).pipe(
      map((spec: any) => {
        return spec
      })
    )
  }

  getPokeByGeneration(idGen: number): Observable<Object> {
    let first_pokeindex: number = pokeByGen.byGen[idGen-1].first_pokeindex
    let poke_count: number = pokeByGen.byGen[idGen-1].poke_count
    // don't ask me why I used this IF, but it works.
    if(idGen == 1) {
      return this.getPokemons(first_pokeindex-1, poke_count, first_pokeindex)
    } else {
      return this.getPokemons(first_pokeindex-1, poke_count+1, first_pokeindex)
    }
  }

  findPokeGen(pokeIndex: number): any {
    let objGen = {region: '', id: null}
    pokeByGen.byGen.forEach((gen: any) => {
      if(pokeIndex >= gen.first_pokeindex && pokeIndex <= gen.last_pokeindex) {
        objGen = {region: gen.region, id: gen.idGen}
        return objGen
      }
      return objGen
    })
    return objGen
  }

  getPokeImage(index: number): string {
    return `${this.imageUrl}${index}.png`;
  }

  getRegions(): any[] {
    let regions: { idGen: number, region: string }[] = []
    pokeByGen.byGen.forEach((gen: any) => {
      if(gen.idGen != 9) {
        regions.push({idGen: gen.idGen, region: gen.region})
      }
    })
    return regions
  }

  findPokemon(search: string) {
    return this.http.get(this.pokemonUrl+search).pipe(
      map((poke: any) => {
        poke.image = this.getPokeImage(poke.id);
        poke.index = poke.id;
        return poke;
      })
    )
  }
   
}
