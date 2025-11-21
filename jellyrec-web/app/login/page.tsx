import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Suspense } from 'react';
import LoginForm from '@/app/ui/login-form';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'], subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Login To JellyRec',
};

export default function LoginPage() {
  return (
    <div
      className={`${roboto.className} w-full min-h-screen flex justify-center items-center bg-black`}
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md px-4 py-10">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 md:p-4 rounded-2xl shadow-2xl">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        </div>
        <h1 className="text-center text-5xl md:text-[5em] mb-2.5 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
          JellyRec
        </h1>
        <p className="text-white text-center text-lg md:text-2xl mb-6 md:mb-10 px-4">
          Movie Recommendation System with Jellyfin Integration
        </p>
        <div className="flex justify-center items-center flex-col">
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 text-white p-1.5 bg-[rgba(0,0,0,0.5)]">
        Image Credit:{' '}
        <a href="https://www.pexels.com/photo/7991582" className="text-white">
          Tima Miroshnichenko on Pixels
        </a>
      </div>
    </div>
  );
}