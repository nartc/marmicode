import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  resourceSearchRouterHelper,
  servicesRouterHelper,
} from '@marmicode/shared-router-helpers';

export const routes: Routes = [
  /* Learning map. */
  {
    path: 'learning-map',
    loadChildren: () =>
      import('@marmicode/learning-map-feature-tree').then(
        (m) => m.LearningMapRoutingModule
      ),
  },

  /* Resource search. */
  {
    path: resourceSearchRouterHelper.LEARN_PATH,
    loadChildren: () =>
      import('@marmicode/resource-feature-search').then(
        (m) => m.ResourceSearchRoutingModule
      ),
  },

  /* Services */
  {
    path: servicesRouterHelper.SERVICES_PATH,
    loadChildren: () =>
      import('@marmicode/services-feature-presentation').then(
        (m) => m.ServicesRoutingModule
      ),
  },

  /* / redirect. */
  {
    path: '',
    pathMatch: 'full',
    /* @todo use resourceSearchRouterHelper.learnEverything().join('/'). */
    redirectTo: '/learn/everything',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
