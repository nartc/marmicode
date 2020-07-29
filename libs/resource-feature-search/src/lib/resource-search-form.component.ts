import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { WipModule } from '@marmicode/shared-utils';
import { SearchInputModule } from './search-input.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, concat, defer, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { resourceSearchRouterHelper } from './resource-search-router-helper';
import { Skill } from './skill';
import {
  SkillRepository,
  SkillRepositoryModule,
} from './skill-repository.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-resource-search-form',
  template: `
    <mc-search-input
      [control]="skillControl"
      [matAutocomplete]="auto"
    ></mc-search-input>
    <mat-autocomplete
      #auto="matAutocomplete"
      [displayWith]="getSkillLabel"
      (closed)="onAutoCompleteClose()"
    >
      <mat-option *ngFor="let skill of filteredSkills$ | async" [value]="skill">
        {{ skill.label }}
      </mat-option>
    </mat-autocomplete>
  `,
})
export class ResourceSearchFormComponent implements OnInit {
  skillControl = new FormControl();
  allSkills$ = this._skillRepository
    .getSkills()
    .pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  filteredSkills$: Observable<Skill[]>;
  getSkillLabel = (skill: Skill) => skill?.label;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _skillRepository: SkillRepository
  ) {
    this.filteredSkills$ = combineLatest([
      this.allSkills$,
      concat(
        defer(() => of(this.skillControl.value)),
        this.skillControl.valueChanges
      ),
    ]).pipe(
      map(([skills, keywords]) => {
        /* Nothing to filter. */
        if (keywords == null) {
          return skills;
        }

        /* These are not keywords but a selected skill. */
        if (typeof keywords !== 'string') {
          return [];
        }

        const keywordsTokenList = this._tokenize(keywords);

        return skills.filter((skill) => {
          /* Tokenize label. */
          const labelTokenList = this._tokenize(skill.label);

          /* Check if all keywords match the label. */
          return keywordsTokenList.every((keywordsToken) =>
            labelTokenList.find((token) => token.startsWith(keywordsToken))
          );
        });
      })
    );
  }

  ngOnInit() {
    const selectedSkill$ = this.skillControl.valueChanges.pipe(
      filter((value) => typeof value !== 'string')
    );

    const navigateToSkill$ = selectedSkill$.pipe(
      switchMap((skill: Skill) =>
        defer(() =>
          this._router.navigate(
            resourceSearchRouterHelper.learn(skill?.slug ?? '')
          )
        )
      )
    );

    const skillSlug$ = this._route.paramMap.pipe(
      map((params) => params.get(resourceSearchRouterHelper.SKILL_SLUG_PARAM))
    );

    const updateForm$ = combineLatest([skillSlug$, this.allSkills$]).pipe(
      map(([skillSlug, skills]) =>
        skills.find((skill) => skill.slug === skillSlug)
      ),
      tap((skill) =>
        this.skillControl.setValue(skill, {
          emitEvent: false,
        })
      )
    );

    combineLatest([navigateToSkill$, updateForm$])
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  onAutoCompleteClose() {
    /* Reset auto complete if input is not a skill. */
    if (this.skillControl.value?.id == null) {
      this.skillControl.reset();
    }
  }

  private _tokenize(text: string) {
    return text.split(' ').map((token) => token.toLowerCase());
  }
}

@NgModule({
  declarations: [ResourceSearchFormComponent],
  exports: [ResourceSearchFormComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SkillRepositoryModule,
    SearchInputModule,
    WipModule,
  ],
})
export class ResourceSearchFormModule {}
