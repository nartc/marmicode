import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs/operators';

export interface ArticlePageInfo {
  type: 'article';
  author?: {
    name: string;
    twitter?: string;
  };
  description?: string;
  pictureUri?: string;
  publishedAt?: Date;
  title?: string;
}

export function createArticlePageInfo(
  meta: Omit<ArticlePageInfo, 'type'>
): ArticlePageInfo {
  return {
    ...meta,
    type: 'article',
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-page',
  template: ` <ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        background-color: white;
        min-height: 100%;
      }
    `,
  ],
  providers: [RxState],
})
export class PageComponent implements OnDestroy {
  @Input() set title(title: string) {
    this._state.set({ title });
  }

  @Input() set info(info: ArticlePageInfo) {
    this._state.set({ info });
  }

  private _defaultTitle = 'Marmicode';

  constructor(
    private _metaService: Meta,
    private _state: RxState<{ title: string; info: ArticlePageInfo }>,
    private _titleService: Title
  ) {
    /* Initialize title. */
    this._state.set({ title: null });

    /* Sync input with page title. */
    this._state.hold(
      this._state
        .select('title')
        .pipe(
          map((title) => (title ? `${title} | Marmicode` : this._defaultTitle))
        ),
      (title) => this._titleService.setTitle(title)
    );

    /* Update meta data. */
    this._state.hold(this._state.select('info'), (info) => {
      const twitter = info.author?.twitter;
      const tags = [
        { name: 'author', content: info.author?.name },
        { name: 'description', content: info.description },
        { property: 'og:type', content: info.type },
        { property: 'og:description', content: info.description },
        { property: 'og:image', content: info.pictureUri },
        {
          property: 'article:published_time',
          content: info.publishedAt?.toISOString(),
        },
        {
          property: 'article:author',
          content: twitter ? `https://twitter.com/${twitter}` : null,
        },
        { property: 'twitter:card', content: 'summary_large_image' },
        {
          property: 'twitter:creator',
          content: twitter ? `@${twitter}` : null,
        },
        { property: 'twitter:description', content: info.description },
        { property: 'twitter:title', content: info.title },
      ]
        /* Ignore null values. */
        .filter((tag) => tag.content != null);
      this._metaService.addTags(tags);
    });
  }

  ngOnDestroy() {
    this._metaService.removeTag('author');
    this._metaService.removeTag('description');
    this._metaService.removeTag('og:type');
    this._metaService.removeTag('og:description');
    this._metaService.removeTag('og:image');
    this._metaService.removeTag('article:published_time');
    this._metaService.removeTag('article:author');
    this._metaService.removeTag('twitter:card');
    this._metaService.removeTag('twitter:creator');
    this._metaService.removeTag('twitter:description');
    this._metaService.removeTag('twitter:title');
    this._titleService.setTitle(this._defaultTitle);
  }
}

@NgModule({
  declarations: [PageComponent],
  exports: [PageComponent],
  imports: [CommonModule],
})
export class PageModule {}
