'use client';

import { useActionState } from 'react';
import { signIn } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [state, action, pending] = useActionState(
    signIn,
    undefined,
  );

  return (
    <div className="bg-[rgba(217,217,217,0.5)] rounded-[10px] w-[25em]">
      <p className="text-white text-center text-xl font-medium m-0 pt-2.5 pb-2.5 bg-[#915F5F] rounded-t-[10px]">
        Login Using Jellyfin Credential
      </p>
      <form action={action} className="p-5">
        <hr className="border-white mb-5" />
        
        <label htmlFor="baseurl" className="text-white font-medium text-lg block">
          Server Url
        </label>
        <input
          id="baseurl"
          name="baseurl"
          type="text"
          placeholder="Jellyfin Server Url"
          className="w-full p-2 mt-1.5 mb-4 border-none bg-[rgba(217,217,217,0.7)] rounded-[10px] text-black font-medium text-base"
          disabled={pending}
        />
        
        <label htmlFor="username" className="text-white font-medium text-lg block">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          className="w-full p-2 mt-1.5 mb-4 border-none bg-[rgba(217,217,217,0.7)] rounded-[10px] text-black font-medium text-base"
          disabled={pending}
        />
        {state?.errors?.username && <p>{state.errors.username}</p>}
        
        <label htmlFor="password" className="text-white font-medium text-lg block">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mt-1.5 mb-4 border-none bg-[rgba(217,217,217,0.7)] rounded-[10px] text-black font-medium text-base"
          disabled={pending}
        />
        {state?.errors?.password && <p>{state.errors.password}</p>}
        
        
        <hr className="border-white mb-5" />
        
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <button type="submit"
          disabled={pending}
          className="py-2.5 px-2.5 border-none bg-[#915F5F] cursor-pointer rounded-[5px] text-white text-base font-medium float-right disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#a06d6d] transition-colors"
        >
          {pending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
