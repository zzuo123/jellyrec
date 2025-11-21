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
      className={`${roboto.className} w-full h-screen flex justify-center items-center bg-black`}
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/7991582/pexels-photo-7991582.jpeg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-white text-center text-[5em] mb-2.5 bg-gradient-to-br from-[#610699] to-[#1ca1d8] bg-clip-text text-transparent">
          JelllyRec
        </h1>
        <p className="text-white text-center text-2xl mb-10">
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