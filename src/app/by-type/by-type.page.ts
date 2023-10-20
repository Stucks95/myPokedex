import { Component, ViewChildren, QueryList } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-by-type',
  templateUrl: './by-type.page.html',
  styleUrls: ['./by-type.page.scss'],
})
export class ByTypePage {
  @ViewChildren('type_select') typeSelect: QueryList<IonSelect>

  pokemons: {index: number, name: string, image: string}[] = []
  lastPokeIndex: number = this.pokeService.totalPokemons
  pokeIndex: number
  types: {count: number, results: {name:string, url: string}[]} = {count: 0, results: []}
  customPopoverOptions = {
    header: 'Types',
  }

  constructor(private pokeService: PokemonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.typeSelect = new QueryList<IonSelect>()
    this.pokeIndex = Number (this.route.snapshot.paramMap.get('index'))
    this.getAllTypes()
    this.loadNormalPokemon()
  }

  getAllTypes(): void {
    this.pokeService.getTypes().subscribe((types: any) => {
      this.types = types
    })
  }

  loadNormalPokemon() {
    this.pokeService.getPokemonByType("normal")
    .subscribe((pokemons: any) => {
      pokemons.forEach((poke: any) => {
        this.pokeService.getPokemonInfo(poke.pokemon.name, this.lastPokeIndex)
        .subscribe((res: any) => {
          if(res.index != 0) {
            this.pokemons.push(res)
          }
        })
      });
    })
  }

  loadPokeByType() {
    this.pokemons = []
    let typeSelected = this.typeSelect.first.value
    console.log('typeSelected', typeSelected)
    this.pokeService.getPokemonByType(typeSelected.name)
    .subscribe((pokemons: any) => {
      pokemons.forEach((poke: any) => {
        this.pokeService.getPokemonInfo(poke.pokemon.name, this.lastPokeIndex)
        .subscribe((res: any) => {
          if(res.index != 0) {
            this.pokemons.push(res)
          }
        })
      });
    })
  }

  refreshPage(): void {
    window.location.reload();
  }
}
