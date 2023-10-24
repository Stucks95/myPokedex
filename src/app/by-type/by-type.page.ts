import { Component, ViewChildren, QueryList } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { Subscription } from 'rxjs';

interface pokeBaseInfo {
  index: number, 
  name: string, 
  image: string
}

@Component({
  selector: 'app-by-type',
  templateUrl: './by-type.page.html',
  styleUrls: ['./by-type.page.scss'],
})
export class ByTypePage {
  @ViewChildren('type_select') typeSelect: QueryList<IonSelect>

  allSubs: {}[] = []
  subTypes: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  subPokemonByType: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}
  subPokemonInfo: {sub: Subscription | null, subscribed: boolean} = {sub: null, subscribed: false}

  pokemons: pokeBaseInfo[] = []
  lastPokeIndex: number = this.pokeService.totalPokemons
  pokeIndex: number
  types: {count: number, results: {name:string, url: string}[]} = {count: 0, results: []}
  customPopoverOptions = {
    header: 'Types',
  }
  skeletonLoad: boolean = true
  skeletonArray: number[] = [1,2,3,4,5,6,7,8,9,10]

  constructor(private pokeService: PokemonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.typeSelect = new QueryList<IonSelect>()
    this.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))
    this.getAllTypes()
    this.loadNormalPokemon()
  }

  ngAfterViewInit(): void {
    // skeleton fx 3sec
    setTimeout(() => {
      this.skeletonLoad = false
    }, 3000);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll()
  }

  unsubscribeAll(): void {
    this.allSubs.forEach((objSub: any) => {
      if(objSub.subscribed == true) {
        objSub.sub.unsubscribe()
      }
    })
  }

  getAllTypes(): void {
    this.subTypes.sub = this.pokeService.getTypes()
    .subscribe((types: any) => {
      this.subTypes.subscribed = true
      this.types = types
    })
    this.allSubs.push(this.subTypes)
  }

  loadNormalPokemon(): void {
    this.subPokemonByType.sub = this.pokeService.getPokemonByType("normal")
    .subscribe((pokemons: pokeBaseInfo[]) => {
      this.subPokemonByType.subscribed = true
      pokemons.forEach((poke: any) => {
        this.subPokemonInfo.sub = this.pokeService.getPokemonInfo(poke.pokemon.name, this.lastPokeIndex)
        .subscribe((res: any) => {
          this.subPokemonInfo.subscribed = true
          if(res.index != 0) {
            this.pokemons.push(res)
          }
        })
      });
    })
    this.allSubs.push(this.subPokemonByType)
    this.allSubs.push(this.subPokemonInfo)
  }

  loadPokeByType(): void {
    this.skeletonLoad = true
    this.pokemons = []
    let typeSelected = this.typeSelect.first.value
    
    this.subPokemonByType.sub = this.pokeService.getPokemonByType(typeSelected.name)
    .subscribe((pokemons: pokeBaseInfo[]) => {
      this.subPokemonByType.subscribed = true
      pokemons.forEach((poke: any) => {
        this.subPokemonInfo.sub = this.pokeService.getPokemonInfo(poke.pokemon.name, this.lastPokeIndex)
        .subscribe((res: any) => {
          this.subPokemonInfo.subscribed = true
          if(res.index != 0) {
            this.pokemons.push(res)
          }
        })
      });
    })
    this.allSubs.push(this.subPokemonByType)
    this.allSubs.push(this.subPokemonInfo)
    setTimeout(() => {
      this.pokemons.sort((a: pokeBaseInfo, b: pokeBaseInfo) => a.index - b.index)
      this.skeletonLoad = false
    }, 2000);
  }

  refreshPage(): void {
    window.location.reload();
  }
}
