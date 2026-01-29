'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // This metadata can be used by our SQL trigger
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert('Registration successful! You can now log in.');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <ShieldCheck className="text-red-600 w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-extrabold text-slate-900 uppercase">Create Inspector Account</h1>
      </div>

      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 p-4 text-gray-600 bg-slate-50 border border-slate-200 rounded-2xl focus:border-red-600 outline-none"
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
            <input
              type="email"
              placeholder="inspector@mae.com"
              className="w-full mt-1 p-4 text-gray-600 bg-slate-50 border border-slate-200 rounded-2xl focus:border-red-600 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-4 text-gray-600 bg-slate-50 border border-slate-200 rounded-2xl focus:border-red-600 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-8 w-full flex items-center justify-between bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-black transition-all"
        >
          <span>{loading ? 'Creating Account...' : 'Register'}</span>
          <UserPlus className="w-5 h-5" />
        </button>
        <Link 
            href="/login"
            className="w-full mt-6 block text-center text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-wider transition-colors"
            >
          Already have an account? / Sign In
        </Link>
      </form>
    </div>
  );
}