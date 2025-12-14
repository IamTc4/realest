import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, MapPin, Menu, X, User, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [properties, setProperties] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch properties
    fetch('http://localhost:3001/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data.slice(0, 6))) // Show top 6
      .catch(console.error);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-gray-100 py-4 shadow-sm' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center group cursor-pointer">
             <div className={`w-10 h-10 rounded-none flex items-center justify-center mr-3 transition-colors ${scrolled ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
             </div>
             <span className={`text-2xl font-serif font-bold tracking-tight uppercase ${scrolled ? 'text-slate-900' : 'text-white'}`}>DeveloperBee</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/client/search" className={`text-xs font-semibold uppercase tracking-widest hover:text-emerald-500 transition-colors ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>Properties</Link>
            <Link href="#" className={`text-xs font-semibold uppercase tracking-widest hover:text-emerald-500 transition-colors ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>Agents</Link>
            <Link href="#" className={`text-xs font-semibold uppercase tracking-widest hover:text-emerald-500 transition-colors ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>Journal</Link>
            <Link href="/login" className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border ${scrolled ? 'bg-slate-900 text-white border-slate-900 hover:bg-emerald-600 hover:border-emerald-600' : 'bg-white text-slate-900 border-white hover:bg-emerald-600 hover:text-white hover:border-emerald-600'} flex items-center`}>
                <User className="w-4 h-4 mr-2" /> Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-slate-900 shadow-xl border-t border-slate-800 p-8 flex flex-col space-y-6 md:hidden h-screen">
                <Link href="/client/search" className="text-white text-lg font-serif">Properties</Link>
                <Link href="#" className="text-slate-400 text-lg font-serif">Agents</Link>
                <Link href="#" className="text-slate-400 text-lg font-serif">Journal</Link>
                <Link href="/login" className="text-emerald-500 text-lg font-serif font-bold">Login to Portal</Link>
            </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-900">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-900/90 z-10"></div>
             <img
               src="https://images.unsplash.com/photo-1600596542815-2a14729816e8?auto=format&fit=crop&w=1920&q=80"
               alt="Luxury Real Estate"
               className="w-full h-full object-cover opacity-80 animate-slow-zoom"
             />
         </div>

         <div className="relative z-20 text-center max-w-5xl px-6 mt-16">
             <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase mb-6 text-sm animate-fade-in-up">The Future of Real Estate</p>
             <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight animate-fade-in-up delay-100">
                 Architecture <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white italic font-light">meets</span> Ambition
             </h1>
             <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                 Curating the world's finest properties for the discerning investor. Experience seamless transactions and automated excellence.
             </p>

             {/* Search Bar */}
             <div className="bg-white/5 backdrop-blur-md p-2 border border-white/10 max-w-2xl mx-auto flex items-center animate-fade-in-up delay-300 shadow-2xl">
                 <div className="flex-1 flex items-center px-6">
                     <MapPin className="text-white/50 w-5 h-5 mr-4" />
                     <input
                       type="text"
                       placeholder="Search residence, city or reference..."
                       className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-base py-4 font-light tracking-wide"
                     />
                 </div>
                 <button className="bg-emerald-600 hover:bg-emerald-500 text-white w-16 h-16 flex items-center justify-center transition-all">
                     <Search className="w-6 h-6" />
                 </button>
             </div>
         </div>

         {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/30 animate-bounce">
             <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/50 mx-auto mb-2"></div>
             <span className="text-[10px] uppercase tracking-widest">Scroll</span>
         </div>
      </header>

      {/* Featured Properties Grid */}
      <section className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Curated Residences</h2>
                      <p className="text-slate-500 max-w-md">Handpicked properties that define luxury living and architectural brilliance.</p>
                  </div>
                  <Link href="/client/search" className="inline-flex items-center px-6 py-3 border border-slate-200 hover:border-slate-900 text-slate-900 font-semibold uppercase text-xs tracking-widest transition-all group">
                      Explore All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {properties.map((property) => {
                      const images = JSON.parse(property.images || '[]');
                      return (
                          <Link href={`/client/properties/${property.id}`} key={property.id} className="group block">
                              <div className="relative h-[400px] overflow-hidden bg-slate-200 mb-6">
                                  <img
                                    src={images[0] || 'https://via.placeholder.com/800x600'}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                  />
                                  <div className="absolute top-6 left-6">
                                      <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-4 py-2 uppercase tracking-widest">
                                          {property.type}
                                      </span>
                                  </div>
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-500"></div>
                              </div>

                              <div>
                                  <div className="flex justify-between items-start mb-2">
                                      <h3 className="text-2xl font-serif font-medium text-slate-900 group-hover:text-emerald-700 transition-colors truncate pr-4">{property.title}</h3>
                                      <p className="font-sans font-bold text-slate-900 whitespace-nowrap">${(property.price/1000000).toFixed(2)}M</p>
                                  </div>
                                  <div className="flex items-center text-slate-500 text-sm mb-4 font-light">
                                      <MapPin className="w-4 h-4 mr-2" />
                                      {property.location}
                                  </div>
                                  <div className="flex items-center space-x-6 text-xs text-slate-400 uppercase tracking-wider font-medium">
                                      <span>{property.bedrooms} Beds</span>
                                      <span>{property.bathrooms} Baths</span>
                                      <span>{property.areaSqFt} Sq Ft</span>
                                  </div>
                              </div>
                          </Link>
                      );
                  })}
              </div>
          </div>
      </section>

      {/* Corporate/Industrial Banner */}
      <section className="bg-slate-900 py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
               <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Built for Developers & Agencies</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                      Our platform integrates seamless lead generation, CRM automation, and property management into one robust ecosystem. Scale your real estate business with industrial-grade efficiency.
                  </p>
                  <div className="flex flex-wrap gap-4">
                      <div className="bg-slate-800 p-4 border border-slate-700 min-w-[150px]">
                          <div className="text-3xl font-bold text-emerald-500 mb-1">98%</div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest">Satisfaction</div>
                      </div>
                      <div className="bg-slate-800 p-4 border border-slate-700 min-w-[150px]">
                          <div className="text-3xl font-bold text-emerald-500 mb-1">$500M+</div>
                          <div className="text-xs text-slate-400 uppercase tracking-widest">Transactions</div>
                      </div>
                  </div>
              </div>
              <div>
                  <Link href="/login" className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/50">
                      Partner With Us <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                  <div className="col-span-1 md:col-span-1">
                      <div className="flex items-center mb-8">
                         <div className="w-10 h-10 bg-slate-900 flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                         </div>
                         <span className="text-xl font-serif font-bold text-slate-900 uppercase tracking-widest">DeveloperBee</span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8">
                          The premier digital ecosystem for modern real estate. We combine aesthetic excellence with powerful technology to drive conversions.
                      </p>
                      <div className="flex space-x-4">
                          {/* Social Icons Mock */}
                          <div className="w-8 h-8 bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center cursor-pointer"><span className="text-xs font-bold">IG</span></div>
                          <div className="w-8 h-8 bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center cursor-pointer"><span className="text-xs font-bold">LI</span></div>
                          <div className="w-8 h-8 bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center cursor-pointer"><span className="text-xs font-bold">TW</span></div>
                      </div>
                  </div>

                  <div>
                      <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Company</h4>
                      <ul className="space-y-4 text-sm text-slate-500 font-medium">
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Our Team</Link></li>
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Careers</Link></li>
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Support</h4>
                      <ul className="space-y-4 text-sm text-slate-500 font-medium">
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                          <li><Link href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</Link></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Newsletter</h4>
                      <p className="text-slate-500 text-sm mb-6">Join our exclusive network for market insights.</p>
                      <div className="flex flex-col space-y-3">
                          <input type="email" placeholder="Email Address" className="bg-white border-b border-gray-300 py-3 text-sm outline-none w-full focus:border-slate-900 transition-colors placeholder-slate-400" />
                          <button className="text-left text-slate-900 text-xs font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center">
                              Subscribe <ArrowRight className="w-3 h-3 ml-2" />
                          </button>
                      </div>
                  </div>
              </div>

              <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-medium uppercase tracking-wider">
                  <div>&copy; 2025 DeveloperBee Inc.</div>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                      <span>Made with precision</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}
