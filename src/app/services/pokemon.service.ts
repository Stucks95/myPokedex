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

  updateCurrentPokeId(pokeId: number): void {
    this.currentPokeID = pokeId
  }

  getCurrentPokeId(): number {
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
          let poke: {evo0: {name: string, id: number}[], evo1: {name: string, id: number}[], evo2: {name: string, id: number}[]}
          = {evo0: [], evo1: [], evo2: []}

          // finding id by substringing the url
          let urlPokeEvo = evo.chain.species.url
          let idString: string = urlPokeEvo.substring(urlPokeEvo.lastIndexOf('-species/') + 9)
          let id0Evo: number = +idString.replace('/', '')
          let evo0: {name: string, id: number} = {name: evo.chain.species.name, id: id0Evo}
          poke.evo0.push({name: evo0.name, id: evo0.id})

          if(evo.chain.evolves_to) {
            evo.evolves_to = evo.chain.evolves_to
            evo.evolves_to.forEach((el: any, i: number) => {
              console.log('el', el)
              let firstEvolveTo: any = el
              // 1 EVO Poke
              if(firstEvolveTo) {
                // finding id by substringing the url
                urlPokeEvo = firstEvolveTo.species.url
                idString = urlPokeEvo.substring(urlPokeEvo.lastIndexOf('-species/') + 9)
                let id1stEvo = +idString.replace('/', '')
                poke.evo1.push({name: firstEvolveTo.species.name, id: id1stEvo})
                poke.evo2 = []
                let secondEvolveTo: any = el.evolves_to[0]
                // 2 EVO Poke
                if(secondEvolveTo) {
                  console.log('secondEvolveTo', secondEvolveTo)
                  urlPokeEvo = secondEvolveTo.species.url
                  idString = urlPokeEvo.substring(urlPokeEvo.lastIndexOf('-species/') + 9)
                  let id2ndEvo = +idString.replace('/', '')
                  poke.evo2.push({name: secondEvolveTo.species.name, id: id2ndEvo})
                }
              }
              // NO EVO Poke
              else {
                //poke.evo0.push({name: '', id: 0})
                poke.evo1 = []
                poke.evo2 = []
              }
            });
          }

          return poke
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
