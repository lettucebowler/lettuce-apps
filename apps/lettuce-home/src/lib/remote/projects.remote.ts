import { prerender } from '$app/server';
import * as v from 'valibot';
import { ProjectLog } from '$lib/schemas';

import projectsYaml from '$lib/assets/projects.yaml';

const projects = v.parse(ProjectLog, projectsYaml);

export const getProjects = prerender(() => projects.projects);

export const getActiveProjects = prerender(() =>
  projects.projects.filter((project) => project.status === 'active')
);
