'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { MovieCard } from "@/app/ui/movie-card";
import { RecommendationCard } from "@/app/ui/recommendation-card";

interface DashboardContentProps {
    movies: any[];
    recommendations: any[];
    session: any;
    currentLimit: number;
    maxLimit: number;
}

type SortOption = 'default' | 'release_date' | 'rating' | 'title';

export function DashboardContent({ movies, recommendations, session, currentLimit, maxLimit }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'favorites' | 'recommendations'>('favorites');
    const [sortOption, setSortOption] = useState<SortOption>('default');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleLoadMore = () => {
        const params = new URLSearchParams(searchParams);
        const nextLimit = currentLimit + 12;
        const targetLimit = (maxLimit !== Infinity && nextLimit > maxLimit) ? maxLimit : nextLimit;
        params.set('n', targetLimit.toString());

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    const getSortedMovies = () => {
        if (!movies) return [];
        const sorted = [...movies];
        switch (sortOption) {
            case 'release_date':
                return sorted.sort((a, b) => new Date(b.PremiereDate).getTime() - new Date(a.PremiereDate).getTime());
            case 'rating':
                return sorted.sort((a, b) => (b.CommunityRating || 0) - (a.CommunityRating || 0));
            case 'title':
                return sorted.sort((a, b) => a.Name.localeCompare(b.Name));
            case 'default':
            default:
                return sorted;
        }
    };

    const getSortedRecommendations = () => {
        if (!recommendations) return [];
        const sorted = [...recommendations];
        switch (sortOption) {
            case 'release_date':
                return sorted.sort((a, b) => {
                    const dateA = a.released !== 'N/A' ? new Date(a.released).getTime() : 0;
                    const dateB = b.released !== 'N/A' ? new Date(b.released).getTime() : 0;
                    return dateB - dateA;
                });
            case 'rating':
                return sorted.sort((a, b) => {
                    const ratingA = a.rating !== 'N/A' ? parseFloat(a.rating) : 0;
                    const ratingB = b.rating !== 'N/A' ? parseFloat(b.rating) : 0;
                    return ratingB - ratingA;
                });
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'default':
            default:
                return sorted;
        }
    };

    const sortedMovies = getSortedMovies();
    const sortedRecommendations = getSortedRecommendations();

    const SortDropdown = () => (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
            <div className="relative inline-block text-left">
                <div className="relative">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="appearance-none pl-4 pr-10 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-colors shadow-sm"
                    >
                        <option value="default">Default</option>
                        <option value="release_date">Release Date</option>
                        <option value="rating">Rating</option>
                        <option value="title">Title</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Navigation Tabs */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-1 py-2">
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex-1 sm:flex-none justify-center px-2 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-t-lg font-semibold shadow-sm border-b-2 transition-all duration-300 ${activeTab === 'favorites'
                                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-500'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 border-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Favorites
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('recommendations')}
                            className={`flex-1 sm:flex-none justify-center px-2 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-t-lg font-semibold shadow-sm border-b-2 transition-all duration-300 ${activeTab === 'recommendations'
                                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-500'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 border-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Recommendations
                                {recommendations && recommendations.length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                        {recommendations.length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Favorites */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Favorites</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {movies?.length || 0}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Movies */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Movies</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {movies?.length || 0}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Count */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-xl shadow-md p-6 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/90 mb-1">Recommendations</p>
                                <p className="text-3xl font-bold text-white">
                                    {recommendations?.length || 0}
                                </p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-fadeIn">
                    {activeTab === 'favorites' && (
                        <>
                            {(!movies || movies.length === 0) ? (
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-lg p-8 text-center shadow-sm">
                                    <div className="inline-block bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4">
                                        <svg className="w-12 h-12 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                                        No Favorite Movies Yet
                                    </h3>
                                    <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                                        Start adding your favorite movies in Jellyfin to see them here and get personalized recommendations!
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 px-4 py-2 rounded-full">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        Tip: Click the star icon in Jellyfin to favorite a movie
                                    </div>
                                </div>
                            ) : (
                                <section>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                Your Favorite Movies
                                            </span>
                                            <span className="text-lg text-gray-400 font-normal">
                                                ({movies.length})
                                            </span>
                                        </h2>

                                        <div className="flex items-center gap-2 self-end sm:self-auto">
                                            <SortDropdown />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {sortedMovies.map((movie: any) => (
                                            <MovieCard
                                                key={movie.Id}
                                                movie={movie}
                                                baseUrl={session.baseurl}
                                                token={session.token}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {activeTab === 'recommendations' && (
                        <>
                            {(!recommendations || recommendations.length === 0) ? (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-400 dark:border-blue-600 rounded-lg p-8 text-center shadow-sm">
                                    <div className="inline-block bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
                                        <svg className="w-12 h-12 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                                        No Recommendations Available
                                    </h3>
                                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                                        We need more favorite movies to generate recommendations for you. Try adding more favorites!
                                    </p>
                                </div>
                            ) : (
                                <section className="mb-12">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                                Recommended for You
                                            </span>
                                            <span className="text-lg text-gray-400 font-normal">
                                                ({recommendations.length})
                                            </span>
                                        </h2>
                                        <div className="flex items-center gap-2 self-end sm:self-auto">
                                            <SortDropdown />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                                        {sortedRecommendations.map((movie: any) => (
                                            <RecommendationCard
                                                key={movie.imdb_id}
                                                movie={movie}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-center pb-8">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isPending || (maxLimit !== Infinity && currentLimit >= maxLimit)}
                                            className="group relative px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-purple-100 dark:border-purple-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            <span className={`flex items-center gap-2 ${isPending ? 'opacity-0' : 'opacity-100'}`}>
                                                {(maxLimit !== Infinity && currentLimit >= maxLimit) ? 'No More Recommendations' : 'Load More Movies'}
                                                {!(maxLimit !== Infinity && currentLimit >= maxLimit) && (
                                                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </span>
                                            {isPending && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="animate-spin h-5 w-5 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
