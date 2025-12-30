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
  npmDownloads: number;
  npmSize: string;
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
    npmDownloads: 0,
    npmSize: "0 KB",
    loading: false,

    fetchStats: async () => {
      const { loading, stars, contributorsList } = get();
      // If we already have data and aren't loading, skip
      if (loading || (stars > 0 && contributorsList.length > 0)) return;

      set({ loading: true });

      try {
        const [repoRes, contributorsRes, npmDownloadsRes, npmSizeRes] =
          await Promise.all([
            fetch(GITHUB.API_URL),
            fetch(GITHUB.CONTRIBUTORS_URL),
            fetch("https://api.npmjs.org/downloads/point/last-month/hanma"),
            fetch("https://registry.npmjs.org/hanma/latest"),
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

        if (npmDownloadsRes.ok) {
          const data = await npmDownloadsRes.json();
          set({ npmDownloads: data.downloads || 0 });
        }

        if (npmSizeRes.ok) {
          const data = await npmSizeRes.json();
          const sizeInBytes = data.dist?.unpackedSize || 0;
          const sizeInKB = (sizeInBytes / 1024).toFixed(1) + " KB";
          set({ npmSize: sizeInKB });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        set({ loading: false });
      }
    },
  }),
);
