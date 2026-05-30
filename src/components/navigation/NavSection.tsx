import { NavSection as NavSectionType } from "./types";
import { NavItem } from "./NavItem";

interface Props {
  section: NavSectionType;
}

export function NavSection({ section }: Props) {
  return (
    <div>
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
        {section.title}
      </p>

      <div className="space-y-1">
        {section.items.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}