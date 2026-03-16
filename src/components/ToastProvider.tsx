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
                    background: '#18181b', // zinc-900
                    color: '#fff',
                    border: '1px solid #27272a', // zinc-800
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    padding: '0.75rem 1rem',
                },
                success: {
                    iconTheme: {
                        primary: '#3b82f6', // blue-500 (accent)
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}
