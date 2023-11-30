import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('pokeMusic') pokeMusic: QueryList<AudioBuffer>
  @ViewChild('card_search_by', { read: ElementRef }) card_search_by: ElementRef<HTMLIonCardElement>
  @ViewChild('card_info', { read: ElementRef }) card_info: ElementRef<HTMLIonCardElement>

  @ViewChild('gen_item', { read: ElementRef }) gen_item: ElementRef<HTMLIonItemElement>
  @ViewChild('type_item', { read: ElementRef }) type_item: ElementRef<HTMLIonItemElement>
  @ViewChild('all_item', { read: ElementRef }) all_item: ElementRef<HTMLIonItemElement>
  @ViewChild('types_item', { read: ElementRef }) types_item: ElementRef<HTMLIonItemElement>

  themeToggle: boolean = false;
  appVersion: string = this.pokeService.appVersion
  volume: number = 0.6

  constructor(
    private pokeService: PokemonService, 
    private searchByAnimationCtrl: AnimationController,
    private infoAnimationCtrl: AnimationController,
    private generationAnimationCtrl: AnimationController,
    private typeAnimationCtrl: AnimationController,
    private allAnimationCtrl: AnimationController,
  ) {}

  ngOnInit(): void {
    this.pokeMusic = new QueryList<AudioBuffer>()

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    this.initializeDarkTheme(prefersDark.matches)
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches))
  }

  ngAfterViewInit(): void {
    const searchByAnimation = this.searchByAnimationCtrl
      .create()
      .addElement(this.card_search_by.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo('background', 'blue', 'var(--background)')
    
    const infoAnimation = this.infoAnimationCtrl
      .create()
      .addElement(this.card_info.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo('background', 'blue', 'var(--background)')
    
    const generationItemAnimation = this.generationAnimationCtrl
      .create()
      .addElement(this.gen_item.nativeElement)
      .duration(1500)
      .iterations(1)
      .fromTo('transform', 'translateX(100px)', 'translateX(0px)')
      .fromTo('opacity', '0.2', '1')

    const typeItemAnimation = this.typeAnimationCtrl
      .create()
      .addElement(this.type_item.nativeElement)
      .duration(1500)
      .iterations(1)
      .fromTo('transform', 'translateX(-100px)', 'translateX(0px)')
      .fromTo('opacity', '0.2', '1')

    const allItemAnimation = this.allAnimationCtrl
      .create()
      .addElement(this.all_item.nativeElement)
      .duration(1500)
      .iterations(1)
      .fromTo('transform', 'translateX(0px)', 'translateX(0px)')
      .fromTo('opacity', '0.2', '1')

    searchByAnimation.play()
    infoAnimation.play()

    //generationItemAnimation.play()
    //typeItemAnimation.play()
    //allItemAnimation.play()
  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(e: { detail: { checked: any; }; }) {
    this.toggleDarkTheme(e.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean | undefined) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  refreshPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {}

}
