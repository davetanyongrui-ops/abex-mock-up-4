"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Droplets, Wrench, Briefcase, Phone, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const editorPages = [
    { label: "Home", href: "/admin/editor/home", icon: Home, slug: "index" },
    { label: "About Us", href: "/admin/editor/about", icon: Info, slug: "about" },
    { label: "Our Products", href: "/admin/editor/products", icon: Droplets, slug: "products" },
    { label: "Servicing", href: "/admin/editor/servicing", icon: Wrench, slug: "servicing" },
    { label: "Projects", href: "/admin/editor/projects", icon: Briefcase, slug: "projects" },
    { label: "Contact Us", href: "/admin/editor/contact", icon: Phone, slug: "contact" },
];

export default function EditorSidebar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <Link
                        href="/admin/page-builder"
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Page Builder
                    </Link>
                    <h2 className="text-white font-black text-xs uppercase tracking-widest mt-3">
                        Live Editor
                    </h2>
                    <p className="text-slate-500 text-[10px] mt-0.5">Select a page to edit</p>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {editorPages.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "group-hover:text-blue-400")} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-900/30 border border-emerald-800/50 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Autosave On</span>
                    </div>
                </div>
            </aside>

            {/* Editor Content */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
