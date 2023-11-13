import { PokemonService } from './../services/pokemon.service';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent  implements OnInit {

  pokeIndex: number

  constructor(private route: ActivatedRoute, private pokeService: PokemonService) { }

  ngOnInit(): void {
    let urlHref = window.location.href
    this.pokeIndex = +urlHref.substring(urlHref.lastIndexOf('/') + 1)
    this.pokeService.updateCurrentPokeId(this.pokeIndex)
  }

/*   ngAfterContentChecked() {
    ('ngAfterContentChecked')
  } */

  ngDoCheck() {
    this.pokeIndex = this.pokeService.getCurrentPokeId()
  }

}
