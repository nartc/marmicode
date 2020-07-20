import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Resource } from './resource';
import {
  resourceTypeActionMap,
  resourceTypeColorMap,
  resourceTypeTextMap,
} from './resource-type';
import { ResourceTypeTriangleModule } from './resource-type-triangle.component';
import { SkillLabelModule } from './skill-label.pipe';
import { ResourceCardTriangleModule } from './triangle.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-resource-card',
  template: ` <mat-card class="card">
    <article>
      <img
        [src]="resource.pictureUri"
        class="picture"
        mat-card-image
        alt="Photo of a Shiba Inu"
      />
      <mc-resource-type-triangle
        [resourceType]="resource.type"
      ></mc-resource-type-triangle>

      <mat-card-header>
        <img [src]="resource.author.pictureUri" mat-card-avatar />
        <mat-card-title>
          <h2 class="title">{{ resource.title }}</h2>
        </mat-card-title>
        <mat-card-subtitle fxLayout="row">
          <span class="author">by {{ resource.author.name }}</span>
          <span>&nbsp;-&nbsp;</span>
          <span [style.color]="color">4 minutes read</span>
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <p>
          {{ resource.summary }}
        </p>
        <section class="list-container">
          <h3 [style.color]="color" class="list-title">Goals</h3>
          <mat-chip-list>
            <div fxLayout="row wrap">
              <mat-chip
                *ngFor="let skill of resource.skills"
                [disabled]="true"
                [style.opacity]="1"
              >
                {{ skill | skillLabel }}
              </mat-chip>
            </div>
          </mat-chip-list>
        </section>
        <section class="list-container">
          <h3 [style.color]="color" class="list-title">Required Skills</h3>
          <mat-chip-list>
            <div fxLayout="row wrap">
              <mat-chip
                *ngFor="let skill of resource.requiredSkills"
                [disabled]="true"
                [style.opacity]="1"
              >
                {{ skill | skillLabel }}
              </mat-chip>
            </div>
          </mat-chip-list>
        </section>
      </mat-card-content>

      <mat-card-actions fxLayout="row" fxLayoutAlign="center">
        <button
          [style.backgroundColor]="color"
          class="action-button"
          mat-raised-button
          color="primary"
        >
          {{ actionText }}
        </button>
      </mat-card-actions>
    </article>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
        width: 550px;
      }

      .card {
        overflow: hidden;
      }

      .picture {
        height: 200px;
        object-fit: cover;
      }

      /* Override h2 styling. */
      .title {
        margin: 0;
        font: inherit;
      }

      .author {
        color: grey;
      }

      .list-title {
        font-family: Avenir, Roboto, 'Helvetica Neue', sans-serif;
        text-transform: uppercase;
      }

      .list-container {
        margin-top: 30px;
      }

      .action-button {
        font-size: 1.1em;
        min-width: 130px;
        text-transform: uppercase;
      }
    `,
  ],
})
export class ResourceCardComponent implements OnChanges {
  @Input() resource: Resource;
  actionText: string;
  color: string;

  ngOnChanges() {
    this.color = resourceTypeColorMap.get(this.resource.type);
    this.actionText = resourceTypeActionMap.get(this.resource.type);
  }
}

@NgModule({
  declarations: [ResourceCardComponent],
  exports: [ResourceCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    ResourceCardTriangleModule,
    ResourceTypeTriangleModule,
    MatIconModule,
    MatChipsModule,
    SkillLabelModule,
  ],
})
export class ResourceCardModule {}
