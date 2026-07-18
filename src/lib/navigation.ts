import {
    Crosshair,
    GraduationCap,
    Home,
    Trophy,
    User,
    type LucideIcon,
} from "lucide-react";

export type NavigationSection = "primary" | "secondary";

export interface NavigationItem {
    href: string;
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    section: NavigationSection;
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
    { href: "/", label: "ראשי", shortLabel: "ראשי", icon: Home, section: "primary" },
    { href: "/courses", label: "למידה", shortLabel: "למידה", icon: GraduationCap, section: "primary" },
    { href: "/practice", label: "תרגול", shortLabel: "תרגול", icon: Crosshair, section: "primary" },
    { href: "/leaderboard", label: "דירוג עולמי", shortLabel: "דירוג", icon: Trophy, section: "secondary" },
    { href: "/profile", label: "פרופיל", shortLabel: "פרופיל", icon: User, section: "secondary" },
] as const;

export const NAVIGATION_ROUTES = NAVIGATION_ITEMS.map((item) => item.href);

export function isNavigationItemActive(pathname: string | null, href: string) {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}
