import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Token } from 'marked';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-markdown-tokens',
  template: ` <mc-markdown-token
    *ngFor="let token of tokens"
    [token]="token"
  ></mc-markdown-token>`,
})
export class MarkdownTokensComponent {
  @Input() tokens: Token[];
}
