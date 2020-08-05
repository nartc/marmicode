import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
} from '@angular/core';
import {
  ResourceType,
  resourceTypeColorMap,
  resourceTypeTextMap,
} from '@marmicode/resource-core';
import { TriangleModule } from '@marmicode/shared-ui';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-resource-type-triangle',
  template: `<mc-triangle [color]="color">{{ text }}</mc-triangle>`,
})
export class ResourceTypeTriangleComponent implements OnChanges {
  @Input() resourceType: ResourceType;
  color: string;
  text: string;

  ngOnChanges() {
    this.color = resourceTypeColorMap.get(this.resourceType);
    this.text = resourceTypeTextMap.get(this.resourceType);
  }
}

@NgModule({
  declarations: [ResourceTypeTriangleComponent],
  exports: [ResourceTypeTriangleComponent],
  imports: [CommonModule, TriangleModule],
})
export class ResourceTypeTriangleModule {}
