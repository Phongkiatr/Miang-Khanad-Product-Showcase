import { useEffect } from 'react';

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}
export function Modal({ title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
          <h2 className="text-base font-semibold text-charcoal tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-charcoal transition-colors bg-transparent border-none cursor-pointer text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
interface ConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export function Confirm({ message, onConfirm, onCancel }: ConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white max-w-sm w-full p-6">
        <p className="text-sm text-charcoal mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-black/15 text-charcoal bg-transparent cursor-pointer
                       hover:bg-black/5 transition-colors font-sans"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-vermillion text-white border-none cursor-pointer
                       hover:bg-vermillion-dark transition-colors font-sans"
          >
            ยืนยันลบ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form field ────────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}
export function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold tracking-[0.1em] uppercase text-charcoal">
        {label}{required && <span className="text-vermillion ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] text-muted font-light">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm text-charcoal
                 focus:outline-none focus:border-charcoal transition-colors font-sans"
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm text-charcoal
                 focus:outline-none focus:border-charcoal transition-colors font-sans resize-none"
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <select
      {...rest}
      className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm text-charcoal
                 focus:outline-none focus:border-charcoal transition-colors font-sans appearance-none cursor-pointer"
    >
      {children}
    </select>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────
interface SubmitBtnProps {
  loading?: boolean;
  label?: string;
}
export function SubmitBtn({ loading, label = 'บันทึก' }: SubmitBtnProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-charcoal text-white text-sm tracking-wide font-sans
                 hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                 border-none cursor-pointer mt-2"
    >
      {loading ? 'กำลังบันทึก...' : label}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDone: () => void;
}
export function Toast({ message, type, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] px-5 py-3 text-sm text-white tracking-wide
                   ${type === 'success' ? 'bg-[#1C7A50]' : 'bg-vermillion'}`}
    >
      {message}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-muted">
      <p className="text-3xl mb-3">✦</p>
      <p className="text-sm font-light">{label}</p>
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-cream-dark px-5 py-4 flex flex-col gap-1">
      <p className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-vermillion' : 'text-charcoal'}`}>{value}</p>
    </div>
  );
}

// ── Icon ──────────────────────────────────────────────────────────────────────
interface LIconProps {
  name: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  className?: string;
}
export function LIcon({ name, size = 'base', className = '' }: LIconProps) {
  const sizeMap = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  return <i className={`lni lni-${name} ${sizeMap[size] || sizeMap.base} ${className}`} />;
}
