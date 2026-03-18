'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                 style: {
                     background: 'rgba(255, 255, 255, 0.9)',
                     color: '#000',
                     backdropFilter: 'blur(20px)',
                     border: '1px solid rgba(0, 0, 0, 0.05)',
                     borderRadius: '1.5rem',
                     fontSize: '0.75rem',
                     fontWeight: '900',
                     textTransform: 'uppercase',
                     letterSpacing: '0.1em',
                     padding: '1rem 1.5rem',
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                 },
                 success: {
                     iconTheme: {
                         primary: '#000',
                         secondary: '#fff',
                     },
                 },
            }}
        />
    );
}
