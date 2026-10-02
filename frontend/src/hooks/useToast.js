import { useState, useEffect } from 'react';

/**
 * Simple toast hook for transient notifications.
 * Usage:
 *   const { showToast, Toast } = useToast();
 *   showToast('Message', 'info');
 *   // place <Toast /> somewhere in the component tree.
 */
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const Toast = () =>
    toast ? (
      <div className={`toast toast-${toast.type}`} style={toastStyle} role="alert" aria-live="assertive">
        {toast.msg}
      </div>
    ) : null;

  const toastStyle = {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return { showToast, Toast };
};
