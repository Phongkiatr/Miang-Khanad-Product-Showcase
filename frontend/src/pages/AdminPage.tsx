import { useState } from 'react';
import { Link } from 'react-router-dom';
import ItemsPanel from '../components/admin/ItemsPanel';
import VariantsPanel from '../components/admin/VariantsPanel';
import InquiryLogsPanel from '../components/admin/InquiryLogsPanel';
import DatabaseBrowserPanel from '../components/admin/DatabaseBrowserPanel';
import SettingsPanel from '../components/admin/SettingsPanel';
import MediaPanel from '../components/admin/MediaPanel';
import { LIcon } from '../components/admin/AdminUI';
import { api } from '../lib/api';

// ─── Config ───────────────────────────────────────────────────────────────────
const SESSION_KEY = 'mk_admin_token';

type Tab = 'items' | 'variants' | 'media' | 'logs' | 'database' | 'settings';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'items', label: 'สินค้า', icon: 'package' },
  { key: 'variants', label: 'หมวดหมู่สินค้า', icon: 'grid-alt' },
  { key: 'media', label: 'จัดการรูปภาพ', icon: 'image' },
  { key: 'logs', label: 'Inquiry Logs', icon: 'customer' },
  { key: 'database', label: 'Database Browser', icon: 'database' },
  { key: 'settings', label: 'Settings', icon: 'cog' },
];

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShake] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.auth.login(value);
      sessionStorage.setItem(SESSION_KEY, res.data.token);
      onUnlock();
    } catch {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className={`w-full max-w-sm ${shaking ? 'animate-[shake_0.4s_ease]' : ''}`}>

        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-3xl font-bold text-white tracking-wide mb-1">เมียงขนาด</div>
          <div className="text-[10px] text-gold tracking-[0.3em] uppercase font-light">ADMIN PANEL</div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.2em] uppercase text-white/50 font-normal">
              Admin Key
            </label>
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              className={`w-full px-4 py-3 bg-white/10 text-white text-sm
                           border ${error ? 'border-vermillion' : 'border-white/20'}
                           focus:outline-none focus:border-white/60 transition-colors font-sans
                           placeholder:text-white/25`}
              placeholder="Enter Key"
            />
            {error && (
              <p className="text-xs text-vermillion font-light">Key is not valid.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gold text-charcoal text-sm font-bold tracking-wide
                       border-none cursor-pointer hover:bg-gold/80 transition-colors font-sans"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-[11px] text-white/25 mt-8 font-light">
          หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────
function AdminLayout() {
  const [tab, setTab] = useState<Tab>('items');
  const [sidebarOpen, setSidebar] = useState(false);

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal flex flex-col
                     transition-transform duration-300
                     ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                     lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <Link 
          to="/"
          className="px-6 py-7 border-b border-white/10 block no-underline hover:bg-white/5 transition-colors cursor-pointer"
          title="กลับหน้าหลัก"
        >
          <div className="text-xl font-bold text-white tracking-wide">เมียงขนาด</div>
          <div className="text-[10px] text-gold tracking-[0.3em] uppercase font-light mt-0.5">
            ADMIN PANEL
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSidebar(false); }}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-sans text-left
                           border-none cursor-pointer transition-all duration-200
                           ${tab === t.key
                  ? 'bg-white/10 text-white font-semibold'
                  : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <LIcon name={t.icon} className="text-base" />
              {t.label}
              {tab === t.key && (
                <span className="ml-auto w-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full py-2 text-xs text-white/40 hover:text-white/80 bg-transparent
                       border border-white/15 cursor-pointer transition-colors font-sans tracking-wide"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-cream border-b border-black/10 px-10 py-4
                            flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setSidebar(true)}
              className="lg:hidden bg-transparent border-none cursor-pointer p-1 flex flex-col gap-1"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="block w-5 bg-charcoal" style={{ height: '1.5px' }} />
              ))}
            </button>

            <div>
              <h1 className="text-sm font-bold text-charcoal">
                {TABS.find((t) => t.key === tab)?.label}
              </h1>
            </div>
          </div>

          {/* Quick link back to store */}
          <Link
            to="/"
            className="text-xs text-muted font-light hover:text-charcoal transition-colors no-underline"
          >
            ← กลับหน้าเว็บ
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 px-10 py-8 max-w-[1400px] w-full mx-auto">
          {tab === 'items' && <ItemsPanel />}
          {tab === 'variants' && <VariantsPanel />}
          {tab === 'media' && <MediaPanel />}
          {tab === 'settings' && <SettingsPanel />}
          {tab === 'logs' && <InquiryLogsPanel />}
          {tab === 'database' && <DatabaseBrowserPanel />}
        </main>
      </div>
    </div>
  );
}

// ─── Page: check session → gate or dashboard ──────────────────────────────────
export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => !!sessionStorage.getItem(SESSION_KEY)
  );

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <AdminLayout />;
}
