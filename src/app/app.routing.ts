import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'health-page',
    pathMatch: 'full',
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
    data: { preload: true, delay: false, time: 0 },
  },
  {
    path: 'health-page',
    loadChildren: () =>
      import('./health-page/health-page.module').then(
        (m) => m.AuthenticationModule
      ),
    data: { preload: true, delay: false, time: 0 },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
