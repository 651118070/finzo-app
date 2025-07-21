import React from 'react';
import { Phone } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="shadow-sm mt-10 w-full">
        <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          © 2025 Finzo. Tous droits réservés. Fait par{" "}
          <a
            href="https://techsprint.cm"
            className="underline hover:text-emerald-500"
          >
            Techsprint.cm
          </a>
        </div>
      </footer>

      {/* Floating Phone Button */}
      <a
        href="https://wa.me/237651118070"       
         className="fixed bottom-5 right-5 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition"
        aria-label="Contact Support"
        title="Contact Support"
      >
        <Phone size={24} strokeWidth={2} />
      </a>
    </>
  );
}
