import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { AnimationController, IonCard, IonItem } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('pokeMusic') pokeMusic: QueryList<AudioBuffer>
  @ViewChild(IonCard, { read: ElementRef }) card_title: ElementRef<HTMLIonCardElement>

  @ViewChild('gen_item', { read: ElementRef }) gen_item: ElementRef<HTMLIonItemElement>
  @ViewChild('type_item', { read: ElementRef }) type_item: ElementRef<HTMLIonItemElement>
  @ViewChild('all_item', { read: ElementRef }) all_item: ElementRef<HTMLIonItemElement>


  themeToggle: boolean = false;
  appVersion: string = this.pokeService.appVersion
  volume: number = 0.6

  constructor(
    private pokeService: PokemonService, 
    private titleAnimationCtrl: AnimationController,
    private generationAnimationCtrl: AnimationController,
    private typeAnimationCtrl: AnimationController,
    private allAnimationCtrl: AnimationController,
  ) {}

  ngOnInit(): void {
    this.pokeMusic = new QueryList<AudioBuffer>()
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark theme based on the initial value
    this.initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));
  }

  ngAfterViewInit(): void {
    const titleAnimation = this.titleAnimationCtrl
      .create()
      .addElement(this.card_title.nativeElement)
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

    titleAnimation.play()
    console.log('gen_item, type_item, all_item', this.gen_item, this.type_item, this.all_item)
    generationItemAnimation.play()
    typeItemAnimation.play()
    allItemAnimation.play()

  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(ev: { detail: { checked: any; }; }) {
    this.toggleDarkTheme(ev.detail.checked);
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
