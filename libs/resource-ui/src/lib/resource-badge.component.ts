import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import {
  getResourceTypeColor,
  getResourceTypeText,
  ResourceType,
} from '@marmicode/resource-core';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-resource-badge',
  template: ` <span [style.backgroundColor]="badgeColor$ | async" class="badge">
    {{ badgeText$ | async }}
  </span>`,
  styles: [
    `
      .badge {
        display: inline-block;
        position: relative;
        border-radius: 10px;
        font-size: 15px;
        height: 20px;
        padding: 0 10px;

        color: rgba(255, 255, 255, 0.9);
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1);
        text-transform: uppercase;
      }
    `,
  ],
  providers: [RxState],
})
export class ResourceBadgeComponent {
  @Input() set resourceType(resourceType: ResourceType) {
    this._state.set({ resourceType });
  }

  badgeColor$ = this._state.select(
    map(({ resourceType }) => getResourceTypeColor(resourceType))
  );

  badgeText$ = this._state.select(
    map(({ resourceType }) => getResourceTypeText(resourceType))
  );

  constructor(private _state: RxState<{ resourceType: ResourceType }>) {}
}

@NgModule({
  declarations: [ResourceBadgeComponent],
  exports: [ResourceBadgeComponent],
  imports: [CommonModule],
})
export class ResourceBadgeModule {}
