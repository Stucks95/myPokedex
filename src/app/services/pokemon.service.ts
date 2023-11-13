import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import pokeByGen from './pokeByGen.json';
import { environment } from 'src/environments/environment.prod';

interface Damage_Relations {
  no_damage_from: {name: string}[], 
  half_damage_from: {name: string}[], 
  double_damage_from: {name: string}[]
}

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
  //dm_rel: Damage_Relations

  constructor(private http: HttpClient) {}

  updateCurrentPokeId(pokeId: number): void {
    this.currentPokeID = pokeId
  }

  getCurrentPokeId(): number {
    return this.currentPokeID
  }

  findIDByURL(idString: string) {
    let idTypeUrl: string = idString
    let idStr: string = idTypeUrl.substring(idTypeUrl.lastIndexOf('type/') + 5)
    return +idStr.replace('/', '')
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

  getDamageRelationsByType(idType: number): Observable<Damage_Relations> {
    let dm_rel: Damage_Relations = {
      no_damage_from: [], 
      half_damage_from: [], 
      double_damage_from: []
    }
    return this.http.get(this.typesUrl+idType).pipe(
      map((type: any) => {
        dm_rel.no_damage_from = type.damage_relations.no_damage_from
        dm_rel.half_damage_from = type.damage_relations.half_damage_from
        dm_rel.double_damage_from = type.damage_relations.double_damage_from
        return dm_rel
      })
    )
  }

  calculateDamageRelationsBy2Types(dm_rel: Damage_Relations[]): Damage_Relations {
    let resDm_Rel: Damage_Relations = {no_damage_from: [], half_damage_from: [], double_damage_from: []}
    let resultsDouble_dmg: {name: string}[] = []
    let resultsHalf_dmg: {name: string}[] = []
    let resultsNo_dmg: {name: string}[] = []
    let allDouble_dmg: any[] = []
    let allHalf_dmg: any[] = []
    let allNo_dmg: any[] = []

    // catching all the double, half and no dmg
    dm_rel[0].double_damage_from.forEach((dmg: any) => {
      allDouble_dmg.push(dmg.name)
    });
    dm_rel[1].double_damage_from.forEach((dmg: any) => {
      allDouble_dmg.push(dmg.name)
    });
    dm_rel[0].half_damage_from.forEach((dmg: any) => {
      allHalf_dmg.push(dmg.name)
    });
    dm_rel[1].half_damage_from.forEach((dmg: any) => {
      allHalf_dmg.push(dmg.name)
    });
    dm_rel[0].no_damage_from.forEach((dmg: any) => {
      allNo_dmg.push(dmg.name)
      resultsNo_dmg.push({name: dmg.name})
    });
    dm_rel[1].no_damage_from.forEach((dmg: any) => {
      allNo_dmg.push(dmg.name)
      resultsNo_dmg.push({name: dmg.name})
    });

    allDouble_dmg = [...new Set(allDouble_dmg)]
    allHalf_dmg = [...new Set(allHalf_dmg)]
    allNo_dmg = [...new Set(allNo_dmg)]

    // cerco se tra i tipi double dmg ci siano resistenze (1/2) o immunità (0)
    allDouble_dmg.forEach((double_dmg: any) => {
      let isUniqueInHalfDmg: boolean = true
      let isUniqueInNoDmg: boolean = true
      allHalf_dmg.forEach((half_dmg: any) => {
        if(double_dmg == half_dmg) {
          isUniqueInHalfDmg = false
        }
      })
      allNo_dmg.forEach((no_dmg: any) => {
        if(double_dmg == no_dmg) {
          isUniqueInNoDmg = false
        }
      })
      if(isUniqueInHalfDmg && isUniqueInNoDmg) {
        resultsDouble_dmg.push({name: double_dmg})
      }
    })
    // cerco se tra i tipi half dmg ci siano debolezze (2) o immunità (0)
    allHalf_dmg.forEach((half_dmg: any) => {
      let isUniqueInDoubleDmg: boolean = true
      let isUniqueInNoDmg: boolean = true
      allDouble_dmg.forEach((double_dmg: any) => {
        if(half_dmg == double_dmg) {
          isUniqueInDoubleDmg = false
        }
      })
      allNo_dmg.forEach((no_dmg: any) => {
        if(half_dmg == no_dmg) {
          isUniqueInNoDmg = false
        }
      })
      if(isUniqueInDoubleDmg && isUniqueInNoDmg) {
        resultsHalf_dmg.push({name: half_dmg})
      }
    })
    
    resDm_Rel.double_damage_from = resultsDouble_dmg
    resDm_Rel.half_damage_from = resultsHalf_dmg
    resDm_Rel.no_damage_from = resultsNo_dmg
    
    return resDm_Rel
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
                  urlPokeEvo = secondEvolveTo.species.url
                  idString = urlPokeEvo.substring(urlPokeEvo.lastIndexOf('-species/') + 9)
                  let id2ndEvo = +idString.replace('/', '')
                  poke.evo2.push({name: secondEvolveTo.species.name, id: id2ndEvo})
                }
              }
              // NO EVO Poke
              else {
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
