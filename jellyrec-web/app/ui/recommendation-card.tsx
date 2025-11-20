
'use client';

import { useState } from 'react';

interface RecommendationCardProps {
    movie: any;
}

export function RecommendationCard({ movie }: RecommendationCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const year = movie.released !== 'N/A' ? new Date(movie.released).getFullYear() : 'N/A';
    const rating = movie.rating !== 'N/A' ? movie.rating : 'N/A';
    const imageUrl = movie.poster_url !== 'N/A' ? movie.poster_url : '/placeholder-movie.png';

    return (
        <>
            {/* Movie Card */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        {rating}
                    </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {movie.title}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {year} {movie.rated && `• ${movie.rated}`}
                    </div>

                    {movie.genre && movie.genre !== 'N/A' && (
                        <div className="flex flex-wrap gap-1">
                            {movie.genre.split(', ').slice(0, 2).map((genre: string) => (
                                <span
                                    key={genre}
                                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                                >
                                    {genre}
                                </span>
                            ))}
                            {movie.genre.split(', ').length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                    +{movie.genre.split(', ').length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Backdrop Image (using poster as fallback since OMDb doesn't provide backdrop) */}
                        <div className="relative h-64 md:h-80 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover opacity-30 blur-sm scale-110"
                            />
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 -mt-32 relative z-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                {/* Poster */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt={movie.title}
                                        className="w-32 md:w-40 rounded-lg shadow-lg"
                                    />
                                </div>

                                {/* Title and Meta */}
                                <div className="flex-grow pt-8 md:pt-0">
                                    <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                                        {movie.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200 mb-4">
                                        <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                                            <span className="text-yellow-400">⭐</span>
                                            <span className="font-semibold">{rating}</span>
                                        </span>
                                        <span>•</span>
                                        <span>{year}</span>
                                        {movie.rated && movie.rated !== 'N/A' && (
                                            <>
                                                <span>•</span>
                                                <span className="px-2 py-0.5 bg-gray-700 text-gray-200 rounded border border-gray-600">
                                                    {movie.rated}
                                                </span>
                                            </>
                                        )}
                                        {movie.runtime && movie.runtime !== 'N/A' && (
                                            <>
                                                <span>•</span>
                                                <span>{movie.runtime}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Genres */}
                                    {movie.genre && movie.genre !== 'N/A' && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {movie.genre.split(', ').map((genre: string) => (
                                                <span
                                                    key={genre}
                                                    className="px-3 py-1 bg-blue-600/80 text-white text-sm rounded-full font-medium backdrop-blur-sm"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* IMDb Link */}
                                    <a
                                        href={`https://www.imdb.com/title/${movie.imdb_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                                    >
                                        View on IMDb
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Overview */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                                {movie.plot && movie.plot !== 'N/A' && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Overview</h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {movie.plot}
                                        </p>
                                    </div>
                                )}

                                {/* Additional Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Director */}
                                    {movie.director && movie.director !== 'N/A' && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Director</h4>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {movie.director}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actors */}
                                    {movie.actors && movie.actors !== 'N/A' && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cast</h4>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {movie.actors}
                                            </p>
                                        </div>
                                    )}

                                    {/* Awards */}
                                    {movie.awards && movie.awards !== 'N/A' && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Awards</h4>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {movie.awards}
                                            </p>
                                        </div>
                                    )}

                                    {/* Language */}
                                    {movie.language && movie.language !== 'N/A' && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Language</h4>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {movie.language}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
