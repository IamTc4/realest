import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">DeveloperBee</h2>
            <p className="mt-2 text-sm text-gray-500">Premium Real Estate Experience</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => setLoginType('CLIENT')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === 'CLIENT' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Client Login
            </button>
            <button
                onClick={() => setLoginType('STAFF')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === 'STAFF' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Staff Login
            </button>
        </div>

        {loginType === 'CLIENT' ? (
             step === 'PHONE' ? (
                 <form className="space-y-6" onSubmit={handleSendOtp}>
                 <div>
                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                   <input
                     id="phone"
                     type="tel"
                     required
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                     placeholder="Enter your mobile number"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                   />
                 </div>
                 <button
                   type="submit"
                   className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
                 >
                   Continue
                 </button>
               </form>
            ) : (
                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input
                    id="otp"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center text-2xl tracking-widest"
                    placeholder="0000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
                >
                  Verify & Login
                </button>
                <div className="text-center">
                    <button type="button" onClick={() => setStep('PHONE')} className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">
                        Change Phone Number
                    </button>
                </div>
              </form>
            )
        ) : (
            <form className="space-y-6" onSubmit={handleStaffLogin}>
                 <div>
                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                   <input
                     id="email"
                     type="email"
                     required
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                     placeholder="admin@developerbee.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
                 </div>
                 <div>
                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                   <input
                     id="password"
                     type="password"
                     required
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                   />
                 </div>
                 <button
                   type="submit"
                   className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-200 transition-all transform active:scale-95"
                 >
                   Login
                 </button>
            </form>
        )}

        <div className="text-center pt-2">
             <p className="text-xs text-gray-400">By continuing, you agree to our Terms & Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
