import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResourceType } from '@marmicode/resource-core';
import { ResourceBadgeModule } from '@marmicode/resource-ui';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-resource-title-banner',
  template: `
    <svg preserveAspectRatio="none" viewBox="0 0 100 100">
      <polygon style="fill: #561f4b" points="0,0 20,0 10,100 0,100" />
    </svg>
    <div fxLayout="row" fxLayoutAlign="center">
      <mc-resource-badge
        [resourceType]="resourceType"
        class="badge"
      ></mc-resource-badge>
    </div>

    <!-- eslint-disable-next-line @angular-eslint/template/eqeqeq -->
    <h1 class="title" [class.without-subtitle]="subtitle == null">
      {{ title }}
    </h1>

    <h2 *ngIf="subtitle" class="subtitle">
      {{ subtitle }}
    </h2>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        background-color: #86527c;
      }

      .badge {
        margin-top: 10px;
      }

      .title,
      .subtitle {
        position: relative;
        color: white;
        font-weight: 300;
        text-align: center;
        margin: 0;
      }

      .title {
        font-size: 1.2em;
      }

      /* Use more space if there is no subtitle. */
      .title.without-subtitle {
        font-size: 1.5em;
        font-weight: 350;
        margin-top: 10px;
      }

      .subtitle {
        font-size: 1.4em;
        margin-bottom: 5px;
      }

      svg {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ResourceTitleBannerComponent {
  @Input() resourceType: ResourceType;
  @Input() title: string;
  @Input() subtitle: string;
}

@NgModule({
  declarations: [ResourceTitleBannerComponent],
  exports: [ResourceTitleBannerComponent],
  imports: [CommonModule, FlexLayoutModule, ResourceBadgeModule],
})
export class ResourceTitleBannerModule {}
