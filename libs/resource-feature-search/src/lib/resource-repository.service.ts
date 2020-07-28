import { A } from '@angular/cdk/keycodes';
import { Injectable, NgModule } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GraphQLModule } from './graphql.module';
import * as schema from './graphql/schema';
import { Query } from './graphql/schema';
import { skillFragment, skillFragmentToSkill } from './graphql/skill-fragment';
import { createAuthor, createResource, Resource } from './resource';
import { createSkill, Skill } from './skill';

const allResources = gql`
  ${skillFragment}
  query {
    resourceCollection(order: [releasedAt_DESC]) {
      items {
        sys {
          id
        }
        resourceType
        title
        author {
          name
          picture {
            url
          }
        }
        duration
        picture {
          url
        }
        requiredSkillCollection(limit: 10) {
          items {
            ...Skill
          }
        }
        skillCollection(limit: 10) {
          items {
            ...Skill
          }
        }
        summary
        url
      }
    }
  }
`;

const resourcesBySkillSlug = gql`
  ${skillFragment}
  query($skillSlug: String!) {
    skillCollection(limit: 1, where: { slug: $skillSlug }) {
      items {
        linkedFrom {
          resourceCollection {
            items {
              title
              skillCollection(limit: 10) {
                items {
                  label
                }
              }
            }
          }
        }
      }
    }
  }
`;

@Injectable()
export class ResourceRepository {
  constructor(private _apollo: Apollo) {}

  getResources(): Observable<Resource[]> {
    return this._apollo
      .query<Query>({
        query: allResources,
      })
      .pipe(
        map(({ data }) =>
          data.resourceCollection.items.map((item) =>
            createResource({
              id: item.sys.id,
              type: item.resourceType as any,
              title: item.title,
              author:
                item.author &&
                createAuthor({
                  name: item.author.name,
                  pictureUri: item.author.picture.url,
                }),
              duration: item.duration,
              pictureUri: item.picture.url,
              requiredSkills: this._toSkills(item.requiredSkillCollection),
              skills: this._toSkills(item.skillCollection),
              summary: item.summary,
              url: item.url,
            })
          )
        )
      );
  }

  getResourcesBySkillSlug(skillSlug: string) {
    // @todo work in progress
    // return this._apollo.query<Query>({
    //   query: resourcesBySkillSlug,
    //   variables: {
    //     skillSlug,
    //   },
    // });
    return this.getResources().pipe(
      map((resources) =>
        resources.filter((resource) =>
          resource.skills.find((skill) => skill.slug === skillSlug)
        )
      )
    );
  }

  private _toSkills(skills: { items: schema.Skill[] }): Skill[] {
    return skills?.items.map(skillFragmentToSkill);
  }
}

@NgModule({
  imports: [GraphQLModule],
  providers: [ResourceRepository],
})
export class ResourceRepositoryModule {}
