import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.page.html',
})
export class AnimationPage implements OnInit {
  
  options: AnimationOptions = {
    path: '../../assets/animation_pokemon.json'
  }
  animationEnd: boolean = false
  themeToggle: boolean = false

  constructor() {}

  ngOnInit(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    this.initializeDarkTheme(prefersDark.matches)
    // timeout for LOGO ANIMATION
    setTimeout(() => {
      this.animationEnd = true
      window.location.replace('/home')
    }, 4000)
  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean | undefined) {
    document.body.classList.toggle('dark', shouldAdd);
  }

}
