"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Mail,
    FileCode,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    User,
    Edit3,
    Home,
    Info,
    Droplets,
    Wrench,
    Briefcase,
    Phone
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children, user: initialUser }: { children: React.ReactNode, user?: any }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(initialUser?.email || null);
    const supabase = createClient();

    useEffect(() => {
        if (pathname === "/admin/login") return;

        if (!initialUser) {
            router.push("/admin/login");
        } else {
            setUserEmail(initialUser.email || "Admin");
        }
    }, [router, initialUser, pathname]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const primaryLinks = [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Inquiries", href: "/admin/inquiries", icon: Mail },
    ];

    const editorLinks = [
        { label: "Home - Live Editor", href: "/admin/editor/home", icon: Home },
        { label: "About Us - Live Editor", href: "/admin/editor/about", icon: Info },
        { label: "Our Pumps - Live Editor", href: "/admin/editor/products", icon: Package },
        { label: "Servicing - Live Editor", href: "/admin/editor/servicing", icon: Wrench },
        { label: "Projects - Live Editor", href: "/admin/editor/projects", icon: Briefcase },
        { label: "Contact Us - Live Editor", href: "/admin/editor/contact", icon: Phone },
    ];

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // The live editor needs to fill the full viewport — bypass the admin wrapper
    if (pathname.startsWith("/admin/editor")) {
        return (
            <div className="h-screen overflow-hidden">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-72" : "w-20"
                    } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50`}
            >
                {/* Sidebar Header */}
                <div className="h-20 flex items-center px-6 gap-4 border-b border-slate-800">
                    <div className="bg-blue-600 p-2 rounded-lg shrink-0">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <div className="overflow-hidden whitespace-nowrap text-left">
                            <h1 className="text-sm font-black text-white tracking-widest uppercase">ABEX</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">System Admin</p>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-10 px-4 space-y-6 overflow-y-auto">
                    {/* Primary Links */}
                    <div className="space-y-2">
                        {primaryLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href || (link.href === '/admin/products' && pathname.startsWith('/admin/products'));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-none transition-all group ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-blue-400"}`} />
                                    {isSidebarOpen && (
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">
                                            {link.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Editor Links */}
                    <div className="space-y-2">
                        {isSidebarOpen && (
                            <div className="px-4 py-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Page Editors
                                </h3>
                            </div>
                        )}
                        {editorLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-none transition-all group ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-blue-400"}`} />
                                    {isSidebarOpen && (
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">
                                            {link.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User Info & Sign Out */}
                <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                    {isSidebarOpen && (
                        <div className="mb-4 flex items-center gap-3 px-2">
                            <div className="bg-slate-800 p-2 rounded-full">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="overflow-hidden text-left">
                                <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{userEmail}</p>
                            </div>
                        </div>
                    )}
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-none h-12 gap-4 px-4"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && (
                            <span className="text-xs font-black uppercase tracking-widest leading-none">
                                Sign Out
                            </span>
                        )}
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-500 hover:text-slate-900"
                        >
                            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest pl-4 border-l border-slate-200">
                            {[...primaryLinks, ...editorLinks].find(l => l.href === pathname)?.label || "Administration"}
                        </h2>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto text-left">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
