import { create } from "zustand";

interface GithubState {
  stars: number;
  contributors: number;
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
    loading: false,

    fetchStats: async () => {
      const { loading } = get();
      if (loading) return;

      set({ loading: true });

      try {
        const [repoRes, contributorsRes] = await Promise.all([
          fetch("https://api.github.com/repos/itstheanurag/hanma"),
          fetch(
            "https://api.github.com/repos/itstheanurag/hanma/contributors?per_page=100",
          ),
        ]);

        if (repoRes.ok) {
          const repoData = await repoRes.json();
          set({ stars: repoData.stargazers_count || DEFAULT_STARS });
        }

        if (contributorsRes.ok) {
          const contributorsData = await contributorsRes.json();
          set({
            contributors: Array.isArray(contributorsData)
              ? contributorsData.length
              : DEFAULT_CONTRIBUTORS,
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
