import React, { useState, useEffect } from 'react';

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

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({
      msg,
      type,
    });
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  const Toast = () => {
    if (!toast) {
      return null;
    }

    return React.createElement(
      'div',
      {
        className: `toast toast-${toast.type}`,
        style: toastStyle,
        role: 'alert',
        'aria-live': 'assertive',
      },
      toast.msg
    );
  };

  return {
    showToast,
    Toast,
  };
};