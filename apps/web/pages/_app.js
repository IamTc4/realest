import '../styles/globals.css'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Basic route protection mock
  useEffect(() => {
    // Check if user is logged in
    // const token = localStorage.getItem('token');
    // if (!token && router.pathname !== '/login') {
    //    router.push('/login');
    // }
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
