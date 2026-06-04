import { NavSection as NavSectionType } from "./sidebar-nav-types";
import { NavItem } from "./SidebarNavItem";

interface Props {
  section: NavSectionType;
}

export function NavSection({ section }: Props) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
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
