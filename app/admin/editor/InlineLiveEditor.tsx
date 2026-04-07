"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AdminEditProvider } from "@/components/admin/AdminEditProvider";
import { AdminControlBar } from "@/components/admin/AdminControlBar";
import { Home, Info, Droplets, Wrench, Briefcase, Phone, ExternalLink } from "lucide-react";

const PAGE_META: Record<string, { label: string; icon: React.ReactNode; publicPath: string }> = {
    index: { label: "Home", icon: <Home className="w-4 h-4" />, publicPath: "/" },
    about: { label: "About Us", icon: <Info className="w-4 h-4" />, publicPath: "/about" },
    products: { label: "Our Products", icon: <Droplets className="w-4 h-4" />, publicPath: "/products" },
    servicing: { label: "Servicing", icon: <Wrench className="w-4 h-4" />, publicPath: "/servicing" },
    projects: { label: "Projects", icon: <Briefcase className="w-4 h-4" />, publicPath: "/projects" },
    contact: { label: "Contact Us", icon: <Phone className="w-4 h-4" />, publicPath: "/contact" },
};

export function InlineLiveEditor({
    pageSlug,
    initialData,
    initialZhData,
    renderView
}: {
    pageSlug: string;
    initialData: any;
    initialZhData?: any;
    renderView: (isZh: boolean, data: any) => React.ReactNode;
}) {
    const [data, setData] = useState(initialData || {});
    const [zhData, setZhData] = useState(initialZhData || {});
    const [isZh, setIsZh] = useState(false);

    const meta = PAGE_META[pageSlug] ?? { label: pageSlug, icon: null, publicPath: `/${pageSlug}` };

    const currentData = isZh ? zhData : data;

    // We pass a custom update strategy to AdminEditProvider that also updates our local state
    // so the view re-renders immediately. We don't save immediately here, AdminEditProvider handles the save button.

    return (
        <div className="h-screen flex flex-col">
            {/* Top bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="text-slate-400">{meta.icon}</div>
                    <span className="font-black text-sm uppercase tracking-widest">{meta.label}</span>
                    <a
                        href={`/${isZh ? 'zh' : 'en'}${meta.publicPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-400 transition-colors ml-2"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Preview Live
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    {/* Language toggle */}
                    <div className="bg-slate-800 rounded-lg p-1 flex border border-slate-700">
                        <button
                            onClick={() => setIsZh(false)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!isZh ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setIsZh(true)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${isZh ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                        >
                            中文
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white relative">
                <AdminEditProvider
                    key={`provider-${isZh ? 'zh' : 'en'}`}
                    slug={pageSlug}
                    initialData={isZh ? zhData : data}
                    locale={isZh ? 'zh' : 'en'}
                >
                    {renderView(isZh, currentData)}
                    <AdminControlBar />
                </AdminEditProvider>
            </div>
        </div>
    );
}
