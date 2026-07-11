import {
  LuBookmark,
  LuFileText,
  LuCode,
  LuCircleCheck,
  LuLock,
  LuArrowRight,
} from "react-icons/lu";
import {
  BookmarkPreview,
  NotePreview,
  SnippetPreview,
  HabitPreview,
} from "./features-frid";

const features = [
  {
    id: "bookmarks",
    title: "Bookmarks",
    description:
      "Save and organize links with custom tags. Filter by project, topic, or timeline — your personal reference catalog, always accessible.",
    icon: <LuBookmark size={16} />,
    wide: true,
    preview: <BookmarkPreview />,
  },
  {
    id: "notes",
    title: "Notes",
    description:
      "Free-form writing with premium client-side AES-256 encryption layer. Your architecture blueprints remain fully private.",
    icon: <LuFileText size={16} />,
    wide: false,
    preview: <NotePreview />,
  },
  {
    id: "snippets",
    title: "Code Snippets",
    description:
      "Store reusable production code blocks with semantic syntax highlighting and global multi-indexed layout search.",
    icon: <LuCode size={16} />,
    wide: false,
    preview: <SnippetPreview />,
  },
  {
    id: "habits",
    title: "Habit Tracker",
    description:
      "Daily developer momentum tracking, lightweight and visual. Maintain deep work consistency on core engineering components.",
    icon: <LuCircleCheck size={16} />,
    wide: true,
    preview: <HabitPreview />,
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-24 sm:py-28"
      id="features"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-800/60 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="mb-10 flex max-w-2xl flex-col items-center gap-y-3 text-center">
          <div className="mb-3 max-w-fit rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-1 backdrop-blur-sm">
            <span className="text-sm font-medium tracking-wide text-violet-200">
              No sign-up needed
            </span>
          </div>
          <h2 className="text-4xl text-white sm:text-5xl md:text-6xl">
            Your full{" "}
            <span className="bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text font-serif text-transparent">
              developer workspace
            </span>
          </h2>
          <p className="text-sm text-zinc-400 md:text-base">
            Sign in once to unlock your personal nest — all tools synced,
            searchable, and private.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.id}
              className={`group/card relative flex min-w-0 flex-col gap-6 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/10 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-zinc-700/80 ${
                f.wide ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-700/40 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />

              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors group-hover/card:text-zinc-200">
                  {f.icon}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-zinc-600">
                  <LuLock size={9} />
                  <span>auth active</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-zinc-200 transition-colors group-hover/card:text-white">
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed font-normal text-zinc-500">
                  {f.description}
                </p>
              </div>

              <div className="mt-auto w-full pt-2">{f.preview}</div>
            </div>
          ))}
        </div>

        <div className="group mt-8 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-5 transition-colors hover:border-zinc-700/60">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-semibold text-zinc-300 transition-colors group-hover:text-white">
              Explore Core Local Tools Without Registering
            </h4>
            <p className="text-[11px] text-zinc-500">
              Access scratchpads, generators, and offline document parsers
              directly.
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:bg-zinc-200 group-hover:text-black">
            <LuArrowRight size={14} />
          </div>
        </div>
      </div>
    </section>
  );
}
