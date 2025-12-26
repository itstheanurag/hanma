import { create } from "zustand";
import { GITHUB } from "../constants";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

interface GithubState {
  stars: number;
  contributors: number;
  contributorsList: Contributor[];
  loading: boolean;
}

interface GithubActions {
  fetchStats: () => Promise<void>;
}

const DEFAULT_STARS = 0;
const DEFAULT_CONTRIBUTORS = 5;

export const useGithubStore = create<GithubState & GithubActions>(
  (set, get) => ({
    stars: DEFAULT_STARS,
    contributors: DEFAULT_CONTRIBUTORS,
    contributorsList: [],
    loading: false,

    fetchStats: async () => {
      const { loading, stars, contributorsList } = get();
      // If we already have data and aren't loading, skip
      if (loading || (stars > 0 && contributorsList.length > 0)) return;

      set({ loading: true });

      try {
        const [repoRes, contributorsRes] = await Promise.all([
          fetch(GITHUB.API_URL),
          fetch(GITHUB.CONTRIBUTORS_URL),
        ]);

        if (repoRes.ok) {
          const repoData = await repoRes.json();
          set({ stars: repoData.stargazers_count || DEFAULT_STARS });
        }

        if (contributorsRes.ok) {
          const contributorsData = await contributorsRes.json();
          const validContributors = Array.isArray(contributorsData)
            ? contributorsData
            : [];

          set({
            contributors: validContributors.length || DEFAULT_CONTRIBUTORS,
            contributorsList: validContributors,
          });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      } finally {
        set({ loading: false });
      }
    },
  }),
);
