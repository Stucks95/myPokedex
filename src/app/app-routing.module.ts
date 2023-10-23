import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'details/:index',
        loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
      },
      {
        path: 'base-stat/:index',
        loadChildren: () => import('./base-stat/base-stat.module').then( m => m.BaseStatPageModule)
      },
    ]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
/*   {
    path: 'details/:index',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  }, */
  {
    path: 'by-all',
    loadChildren: () => import('./by-all/by-all.module').then( m => m.ByAllPageModule)
  },
  {
    path: 'by-gen',
    loadChildren: () => import('./by-gen/by-gen.module').then( m => m.ByGenPageModule)
  },
  {
    path: 'by-gen/:index',
    loadChildren: () => import('./by-gen/by-gen.module').then( m => m.ByGenPageModule)
  },
  {
    path: 'by-type',
    loadChildren: () => import('./by-type/by-type.module').then( m => m.ByTypePageModule)
  },
  {
    path: 'by-type/:index',
    loadChildren: () => import('./by-type/by-type.module').then( m => m.ByTypePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
