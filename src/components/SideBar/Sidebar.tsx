import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Wallet,
  Package,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuthStore } from "../ZustandShare/AuthZuts";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    roles: ["STAFF", "HOD", "STORES", "AUDIT", "FINANCE", "ADMIN", "IT_ADMIN"],
  },
  {
    label: "Requisitions",
    icon: ClipboardList,
    roles: ["STAFF", "HOD", "STORES", "AUDIT", "FINANCE", "ADMIN", "IT_ADMIN"],
    children: [
      {
        label: "All Requisitions",
        to: "/requisitions-list",
      },
      {
        label: "Create Requisition",
        to: "/create-request",
      },
    ],
  },

  // {
  //   label: "Audit",
  //   to: "/audit",
  //   icon: ShieldCheck,
  //   roles: ["AUDIT", "ADMIN"],
  // },

  {
    label: "Audit",
    to: "/audit",
    icon: ShieldCheck,
    roles: ["AUDIT", "ADMIN", "IT_ADMIN"],
  },
  {
    label: "Finance",
    to: "/finance",
    icon: Wallet,
    roles: ["FINANCE", "ADMIN", "IT_ADMIN"],
  },
  {
    label: "Stores",
    to: "/stores",
    icon: Package,
    roles: ["STORES", "ADMIN", "IT_ADMIN"],
  },

  {
    label: "Users",
    icon: Users,
    roles: ["ADMIN", "IT_ADMIN"],
    children: [
      {
        label: "All Users",
        to: "/staff-list",
      },
      {
        label: "Create User",
        to: "/staff-information",
      },
    ],
  },

  // Reports are currently restricted to administrators.
  {
    label: "Reports",
    to: "/reports",
    icon: BarChart3,
    roles: ["STAFF", "HOD", "STORES", "AUDIT", "FINANCE", "ADMIN", "IT_ADMIN"],
  },

  // Settings are currently restricted to administrators.
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    roles: ["ADMIN", "IT_ADMIN"],
  },
];

function SidebarComponent({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const { currentUser } = useAuthStore();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuToggle = (label: string) => {
    setOpenMenu((current) => (current === label ? null : label));
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  // Only show navigation items allowed for the logged-in user's role.
  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(currentUser?.role ?? "")
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        h-screen w-56
        overflow-y-auto
        border-r border-slate-200
        bg-white
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <div>
          <div className="flex flex-col gap-1">
            <h1 className="mt-2 text-base font-bold tracking-tight text-blue-900">
              {[
                currentUser?.firstname,
                currentUser?.middlename,
                currentUser?.lastname,
              ]
                .filter(Boolean)
                .join(" ")}
            </h1>

            <span className="w-fit rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
              {currentUser?.role}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={closeMobileSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-3">
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const isOpen = openMenu === item.label;

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => handleMenuToggle(item.label)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </span>

                  {isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.to!}
                  end
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "border-l-4 border-blue-900 bg-blue-50 text-blue-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              )}

              {/* Dropdown Items */}
              {hasChildren && isOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l border-slate-200 pl-3">
                  {item.children?.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        `block rounded-md px-3 py-1.5 text-xs transition ${
                          isActive
                            ? "font-semibold text-blue-900"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default SidebarComponent;