import { ResourceType } from './resource-type';

export interface Author {
  name: string;
  pictureUri: string;
}

export function createAuthor(author: Author) {
  return { ...author };
}

export interface Resource {
  id?: string;
  type: ResourceType;
  title: string;
  author?: Author;
  duration: number;
  pictureUri?: string;
  requiredSkills: string[];
  skills: string[];
  summary: string;
  url: string;
}

export function createResource(resource: Resource) {
  return { ...resource };
}
