'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MovieCardProps {
  movie: any;
  baseUrl: string;
  token: string;
}

export function MovieCard({ movie, baseUrl, token }: MovieCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const year = movie.PremiereDate ? new Date(movie.PremiereDate).getFullYear() : 'N/A';
  const rating = movie.CommunityRating ? movie.CommunityRating.toFixed(1) : 'N/A';
  
  // Construct image URL for the movie poster
  const imageUrl = movie.Id 
    ? `${baseUrl}/Items/${movie.Id}/Images/Primary?maxHeight=400&tag=${movie.ImageTags?.Primary}&quality=90`
    : '/placeholder-movie.png';

  const backdropUrl = movie.BackdropImageTags?.[0]
    ? `${baseUrl}/Items/${movie.Id}/Images/Backdrop/0?maxWidth=1280&tag=${movie.BackdropImageTags[0]}&quality=90`
    : imageUrl;

  return (
    <>
      {/* Movie Card */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
      >
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={movie.Name}
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
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {movie.Name}
          </h3>
          <div className="text-sm text-gray-600 mb-2">
            {year} {movie.OfficialRating && `• ${movie.OfficialRating}`}
          </div>
          
          {movie.Genres && movie.Genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.Genres.slice(0, 2).map((genre: string) => (
                <span 
                  key={genre}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
              {movie.Genres.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{movie.Genres.length - 2}
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
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backdrop Image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-b from-gray-900 to-gray-800">
              <img
                src={backdropUrl}
                alt={movie.Name}
                className="w-full h-full object-cover opacity-50"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={movie.Name}
                    className="w-32 md:w-40 rounded-lg shadow-lg"
                  />
                </div>

                {/* Title and Meta */}
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {movie.Name}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{rating}</span>
                    </span>
                    <span>•</span>
                    <span>{year}</span>
                    {movie.OfficialRating && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-gray-200 rounded">
                          {movie.OfficialRating}
                        </span>
                      </>
                    )}
                    {movie.RunTimeTicks && (
                      <>
                        <span>•</span>
                        <span>{Math.round(movie.RunTimeTicks / 600000000)} min</span>
                      </>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.Genres && movie.Genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.Genres.map((genre: string) => (
                        <span 
                          key={genre}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tagline */}
                  {movie.Tagline && (
                    <p className="text-gray-600 italic mb-4">
                      "{movie.Tagline}"
                    </p>
                  )}
                </div>
              </div>

              {/* Overview */}
              {movie.Overview && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {movie.Overview}
                  </p>
                </div>
              )}

              {/* Additional Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Director */}
                {movie.People?.find((p: any) => p.Type === 'Director') && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Director</h4>
                    <p className="text-gray-700">
                      {movie.People.find((p: any) => p.Type === 'Director').Name}
                    </p>
                  </div>
                )}

                {/* Studio */}
                {movie.Studios && movie.Studios.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Studio</h4>
                    <p className="text-gray-700">
                      {movie.Studios.map((s: any) => s.Name).join(', ')}
                    </p>
                  </div>
                )}

                {/* Release Date */}
                {movie.PremiereDate && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Release Date</h4>
                    <p className="text-gray-700">
                      {new Date(movie.PremiereDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Community Rating Count */}
                {movie.VoteCount && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Votes</h4>
                    <p className="text-gray-700">
                      {movie.VoteCount.toLocaleString()} votes
                    </p>
                  </div>
                )}
              </div>

              {/* Cast */}
              {movie.People && movie.People.filter((p: any) => p.Type === 'Actor').length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Cast</h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.People
                      .filter((p: any) => p.Type === 'Actor')
                      .slice(0, 6)
                      .map((actor: any) => (
                        <div 
                          key={actor.Id}
                          className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                        >
                          {actor.PrimaryImageTag && (
                            <img
                              src={`${baseUrl}/Items/${actor.Id}/Images/Primary?maxHeight=60&tag=${actor.PrimaryImageTag}&quality=90`}
                              alt={actor.Name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {actor.Name}
                            </p>
                            {actor.Role && (
                              <p className="text-xs text-gray-600">
                                {actor.Role}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}