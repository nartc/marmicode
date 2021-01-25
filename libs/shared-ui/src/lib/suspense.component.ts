import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  NgModule,
  TemplateRef,
} from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { LetViewContext } from '@rx-angular/template/lib/let';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-suspense',
  template: `
    <ng-container
      *rxLet="
        data$;
        let data;
        rxError: errorWrapperTemplate;
        rxSuspense: suspenseTemplate || placeholderTemplate
      "
    >
      <ng-container
        *ngTemplateOutlet="dataTemplate; context: { $implicit: data }"
      ></ng-container>
    </ng-container>
    <ng-template #errorWrapperTemplate let-error="$rxError">
      <ng-container
        *ngTemplateOutlet="
          errorTemplate || placeholderTemplate;
          context: { $implicit: error }
        "
      ></ng-container
    ></ng-template>

    <ng-template #placeholderTemplate></ng-template>
  `,
})
export class SuspenseComponent<T = unknown> {
  @ContentChild('data') dataTemplate: TemplateRef<{ $implicit: T }>;
  @ContentChild('error') errorTemplate: TemplateRef<{ $implicit: unknown }>;
  @ContentChild('suspense') suspenseTemplate: TemplateRef<undefined>;
  @Input() data$: Observable<T>;
}

@NgModule({
  declarations: [SuspenseComponent],
  exports: [SuspenseComponent],
  imports: [CommonModule, LetModule],
})
export class SuspenseModule {}
