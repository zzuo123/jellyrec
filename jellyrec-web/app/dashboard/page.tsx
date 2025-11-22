import { getFavoriteMovies } from "@/app/lib/actions";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/app/ui/theme-toggle";
import { LogoutButton } from "@/app/ui/logout-button";
import { get_rec } from "@/app/lib/recs";
import { DashboardContent } from "@/app/dashboard/dashboard-content";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  let movies: any[] = [];
  let error = null;
  let session;
  let recommendations: any[] = [];
  const { n } = await searchParams;

  const maxRecommendationsEnv = process.env.MAX_RECOMMENDATIONS;
  const maxRecommendations = maxRecommendationsEnv ? parseInt(maxRecommendationsEnv) : Infinity;

  const parsedLimit = parseInt(n || '12');
  let limit = isNaN(parsedLimit) ? 12 : parsedLimit;

  if (maxRecommendations !== Infinity && limit > maxRecommendations) {
    limit = maxRecommendations;
  }

  try {
    session = await getSession();
    if (!session) {
      redirect('/login');
    }
    movies = await getFavoriteMovies();

    if (movies && movies.length > 0) {
      const favMovies = movies
        .filter((m: any) => m.ProviderIds && m.ProviderIds.Imdb)
        .map((m: any) => ({ imdb_id: m.ProviderIds.Imdb }));

      if (favMovies.length > 0) {
        try {
          recommendations = await get_rec(favMovies, limit);
        } catch (e) {
          console.error("Failed to get recommendations", e);
        }
      }
    }
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  JellyRec
                </h1>
                <p className="text-xs text-gray-500">Your Personal Movie Recommender</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {error ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <DashboardContent
          movies={movies}
          recommendations={recommendations}
          session={session}
          currentLimit={limit}
          maxLimit={maxRecommendations}
        />
      )}

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 JellyRec - Self-hosted Movie Recommendations System for Jellyfin
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Documentation</a>
              <span>•</span>
              <a href="https://github.com/zzuo123/jellyrec" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">GitHub</a>
              <span>•</span>
              <a href="mailto:georgezuo888@gmail.com" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}