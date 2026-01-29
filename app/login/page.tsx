'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Account created! You can now log in.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-2">
           <ShieldCheck className="text-red-600 w-12 h-12" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          MAE <span className="text-red-600">COMPLIANCE</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Secure Inspector Access</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 w-full max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@maecompliance.com"
              className="w-full mt-1 p-4 text-gray-600 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-red-600 transition-colors"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-4 text-gray-600 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-red-600 transition-colors"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="group mt-8 w-full flex items-center justify-between bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-red-100 disabled:opacity-50"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <Link 
            href="/register"
            className="w-full mt-6 block text-center text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-wider transition-colors"
            >
            Request Access / Create Account
        </Link>
      </form>

      <footer className="mt-12 text-center">
        <p className="text-slate-400 text-[10px] font-medium tracking-wide">
          INTERNAL SYSTEM &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}