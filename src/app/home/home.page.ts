import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  offset = 0;
  pokemons: any = [];

  @ViewChild(IonInfiniteScroll) infinite!: IonInfiniteScroll;

  constructor(private pokeService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons()
  }

  ngAfterViewInit(): void {
  }  

  loadGen1() {
    let arr: Array<Object> = []
    console.log(this.pokeService.getGeneration())
  }

  refreshPage(): void {
    window.location.reload();
  }

  loadPokemons(loadMore = false, event?: any): void {
    if(loadMore) {
      this.offset += 25
    }

    this.pokeService.getPokemon(this.offset).subscribe(res => {
      this.pokemons = [...this.pokemons, ...res]

      if(event) {
        event.target.complete();
      }

      if(this.offset >= 150) {
        this.infinite.disabled = true;
        console.log('infinite disable? ', this.infinite.disabled)
      }
    })
  }

  onSearchChange(e: any): void {
    let value = e.detail.value

    if(value=='') {
      this.offset = 0;
      this.loadPokemons()
      return
    }

    this.pokeService.findPokemon(value).subscribe(res => {
      this.pokemons = [res];
    }, err => {
      this.pokemons = [];
    })
  }

}
