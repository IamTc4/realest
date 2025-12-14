import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Lock, Smartphone, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [loginType, setLoginType] = useState('CLIENT'); // CLIENT, STAFF
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('PHONE'); // PHONE, OTP
  const [otp, setOtp] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSendOtp = (e) => {
      e.preventDefault();
      setStep('OTP');
  }

  const handleVerifyOtp = async (e) => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost:3001/api/auth/otp-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone, otp })
          });
          const data = await res.json();
          if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              router.push('/client');
          } else {
              alert('Login failed: ' + (data.error || 'Unknown error'));
          }
      } catch (e) {
          console.error(e);
          alert('Error logging in');
      }
  }

  const handleStaffLogin = async (e) => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost:3001/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));

              if (data.user.role === 'ADMIN') {
                  router.push('/admin');
              } else if (data.user.role === 'AGENT') {
                  router.push('/agent');
              } else {
                  alert('Unauthorized role');
              }
          } else {
              alert('Login failed: ' + (data.error || 'Unknown error'));
          }
      } catch (e) {
          console.error(e);
          alert('Error logging in');
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 z-0"></div>
      <div className="absolute top-10 left-10 z-10">
          <Link href="/" className="flex items-center text-white space-x-2 group">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Back to Home</span>
          </Link>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl z-10 overflow-hidden relative">
        <div className="bg-slate-900 p-8 text-center border-b border-slate-800">
             <div className="w-12 h-12 bg-emerald-600 mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-900/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
             </div>
             <h2 className="text-2xl font-serif font-bold text-white tracking-wide">DeveloperBee</h2>
             <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Access Portal</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button
                onClick={() => setLoginType('CLIENT')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center ${loginType === 'CLIENT' ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
            >
                <Smartphone className="w-4 h-4 mr-2" /> Client Access
            </button>
            <button
                onClick={() => setLoginType('STAFF')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center ${loginType === 'STAFF' ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
            >
                <Lock className="w-4 h-4 mr-2" /> Staff Portal
            </button>
        </div>

        <div className="p-8">
            {loginType === 'CLIENT' ? (
                step === 'PHONE' ? (
                    <form className="space-y-6" onSubmit={handleSendOtp}>
                    <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mobile Number</label>
                    <input
                        id="phone"
                        type="tel"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder-gray-400 text-slate-800"
                        placeholder="e.g. +1 555 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    </div>
                    <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                    Send One-Time Password
                    </button>
                </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerifyOtp}>
                    <div>
                    <label htmlFor="otp" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Verification Code</label>
                    <input
                        id="otp"
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none transition-all text-center text-2xl tracking-[0.5em] text-slate-900 font-mono"
                        placeholder="0000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    </div>
                    <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                    Verify & Login
                    </button>
                    <div className="text-center">
                        <button type="button" onClick={() => setStep('PHONE')} className="text-xs text-gray-400 hover:text-emerald-600 uppercase tracking-wider font-bold">
                            Incorrect Number?
                        </button>
                    </div>
                </form>
                )
            ) : (
                <form className="space-y-6" onSubmit={handleStaffLogin}>
                    <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Work Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-800"
                        placeholder="name@developerbee.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div>
                    <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-800"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                    Access Dashboard
                    </button>
                </form>
            )}
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
             <p className="text-[10px] text-gray-400 uppercase tracking-widest">Protected by Enterprise Grade Security</p>
        </div>
      </div>
    </div>
  );
}
