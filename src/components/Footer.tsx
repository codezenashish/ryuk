import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden bg-black border-t border-white/[0.05]">
      <div className="relative max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-12">
          <div className="flex flex-col gap-6" style={{ opacity: 1, transform: 'none' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Dev<span className="text-indigo-500">Nest</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              The ultimate centralized workspace for developers to organize resources, design diagrams, track habits, and take notes.
            </p>
            <div className="flex items-center gap-2">
              <Link href="#" className="w-9 h-9 rounded-md border border-white/10 text-zinc-400 flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-md border border-white/10 text-zinc-400 flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-md border border-white/10 text-zinc-400 flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.78 2.66 4.78 6.12V21h-4v-5.5c0-1.3-.02-3-1.83-3s-2.11 1.43-2.11 2.9V21h-4z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:border-t lg:border-white/10 lg:pt-5" style={{ opacity: 1, transform: 'none' }}>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Features
            </h4>
            <ul className="flex flex-col gap-2 mt-2">
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Resource Vault (Bookmarks)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Dev Notes (Markdown Editor)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Diagrams &amp; Workflows
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Habit Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 lg:border-t lg:border-white/10 lg:pt-5" style={{ opacity: 1, transform: 'none' }}>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Resources
            </h4>
            <ul className="flex flex-col gap-2 mt-2">
              <li>
                <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Product Docs
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 lg:border-t lg:border-white/10 lg:pt-5" style={{ opacity: 1, transform: 'none' }}>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Platform
            </h4>
            <ul className="flex flex-col gap-2 mt-2">
              <li>
                <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Status
                </Link>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium uppercase tracking-wide">
                  All Systems Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div 
          className="relative mt-16 w-full select-none" 
          aria-hidden="true" 
          style={{ 
            fontSize: 'min(14.2vw, 210px)', 
            height: '0.74em', 
            maskImage: 'linear-gradient(rgb(0, 0, 0) 40%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(rgb(0, 0, 0) 40%, transparent 95%)'
          }}
        >
          <div 
            className="absolute inset-0 flex justify-center font-bold uppercase leading-none whitespace-nowrap text-black"
            style={{ 
              fontSize: 'inherit', 
              letterSpacing: '0.12em', 
              paddingLeft: '0.12em', 
              textShadow: 'rgba(255, 255, 255, 0.08) 0px -1.5px 0px, rgba(255, 255, 255, 0.08) 1.5px 0px 0px, rgba(255, 255, 255, 0.08) 0px 1.5px 0px, rgba(255, 255, 255, 0.08) -1.5px 0px 0px' 
            }}
          >
            DevNest
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-zinc-500">
          <p>
            © {new Date().getFullYear()} DevNest. Built for speed and focus.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}