import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  // Props removed to use hooks instead
}

const LineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/products', label: 'สินค้า' },
  ];

  const isCurrentPage = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-cream/95 backdrop-blur-md border-b border-black/[0.08] py-4'
          : 'bg-transparent border-b border-transparent py-6'}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="flex flex-col items-start gap-0.5 border-none bg-transparent cursor-pointer no-underline"
        >
          <span className="text-[22px] font-bold text-charcoal tracking-wide leading-none">
            เมียงขนาด
          </span>
          <span className="text-[10px] font-light text-gold tracking-[0.3em] uppercase">
            MIANG KHANAD
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative pb-1 text-[15px] tracking-wide no-underline
                          transition-colors duration-200
                          ${isCurrentPage(link.href)
                            ? 'text-vermillion font-semibold'
                            : 'text-charcoal font-light hover:text-vermillion'}`}
            >
              {link.label}
              {isCurrentPage(link.href) && (
                <span className="absolute bottom-0 inset-x-0 h-px bg-vermillion" />
              )}
            </Link>
          ))}

          <a
            href="https://line.me/R/ti/p/@miang-khanad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-charcoal text-white text-[13px]
                       tracking-widest no-underline transition-colors duration-200 hover:bg-vermillion"
          >
            <LineIcon />
            ติดต่อ Line
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-1 border-none bg-transparent cursor-pointer"
          aria-label="เมนู"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 bg-charcoal transition-all duration-300"
              style={{
                height: '1.5px',
                transform:
                  menuOpen && i === 0 ? 'translateY(6.5px) rotate(45deg)'
                  : menuOpen && i === 2 ? 'translateY(-6.5px) rotate(-45deg)'
                  : menuOpen && i === 1 ? 'scaleX(0)'
                  : 'none',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-black/10 px-6 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-left text-lg no-underline
                          ${isCurrentPage(link.href)
                            ? 'text-vermillion font-semibold'
                            : 'text-charcoal font-light'}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://line.me/R/ti/p/@miang-khanad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-light text-[#06C755] no-underline"
          >
            <LineIcon />
            Line OA: @miang-khanad
          </a>
        </div>
      )}
    </nav>
  );
}
