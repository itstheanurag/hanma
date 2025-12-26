import { GITHUB } from "../constants";

export const baseStats = [
  { id: "snippets", label: "Active Snippets", value: 10 },
  { id: "frameworks", label: "Frameworks Support", value: 4 },
  { id: "type-safety", label: "Type Safety", value: 100, isPercentage: true },
];

export const githubStats = {
  repo: GITHUB.REPO_PATH,
  defaultStars: 100,
  defaultContributors: 5,
};
