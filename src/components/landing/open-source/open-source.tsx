import {
  LuGitBranch,
  LuShieldAlert,
  LuServer,
  LuGithub,
  LuArrowRight,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import OpenSourceMockup from "./open-source-mockup";

export default function OpenSourceSection() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-28"
      id="open-source"
    >
      <div className="pointer-events-none absolute top-1/2 right-0 h-150 w-150 -translate-y-1/2 bg-[radial-gradient(circle,rgba(61,202,191,0.03)_0%,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-800/60 to-transparent" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Open Source &amp; Auditable
            </div>
            <h2 className="font-inter text-3xl leading-tight  tracking-tight text-zinc-100 sm:text-5xl">
              Privacy by design, <br />
              <span className="text-zinc-500 font-serif">not by promise.</span>
            </h2>

            <div className="mt-4 flex flex-col gap-6">
              <Bullet
                icon={<LuGitBranch size={15} />}
                title="Fully open source"
                desc="Every single line of backend and interface code lives transparently on GitHub — read it, fork it, or audit it freely."
              />
              <Bullet
                icon={<LuShieldAlert size={15} />}
                title="Client-side AES-256 encryption"
                desc="Notes and raw configuration snippets undergo cryptographic transforms before escaping your client runtime environment. Passphrases never visit database instances."
              />
              <Bullet
                icon={<LuServer size={15} />}
                title="Self-hostable architecture"
                desc="Spin up dedicated containers locally or on private clouds in minutes for uncompromised personal data sovereignty."
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button
                render={
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-zinc-800 bg-zinc-900 px-4 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <LuGithub size={14} />
                View on GitHub
              </Button>
              <span className="font-mono text-xs text-zinc-600">
                MIT License
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <OpenSourceMockup />

            <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-4 transition-all hover:border-zinc-700/60">
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-semibold text-zinc-300 transition-colors group-hover:text-white">
                  Review Cryptographic Audits
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Inspect mathematical proof reports and build configurations.
                </p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:bg-zinc-200 group-hover:text-black">
                <LuArrowRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface BulletProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function Bullet({ icon, title, desc }: BulletProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
        <p className="text-xs leading-relaxed font-normal text-zinc-500">
          {desc}
        </p>
      </div>
    </div>
  );
}
