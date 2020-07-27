import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ResourceSearchComponent,
  ResourceSearchModule,
  resourceSearchRouterHelper,
} from '@marmicode/resource-feature-search';

export const routes: Routes = [
  {
    path: '',
    component: ResourceSearchComponent,
  },
  {
    path: `${resourceSearchRouterHelper.LEARN_PATH}/:${resourceSearchRouterHelper.SKILL_SLUG_PARAM}`,
    component: ResourceSearchComponent,
  },
];

@NgModule({
  imports: [ResourceSearchModule, RouterModule.forChild(routes)],
})
export class ResourceSearchRoutingModule {}
