"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "@/lib/puck/config";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Home, Info, Droplets, Wrench, Briefcase, Phone, ExternalLink } from "lucide-react";

const PAGE_META: Record<string, { label: string; icon: React.ReactNode; publicPath: string }> = {
    index: { label: "Home", icon: <Home className="w-4 h-4" />, publicPath: "/" },
    about: { label: "About Us", icon: <Info className="w-4 h-4" />, publicPath: "/about" },
    products: { label: "Our Products", icon: <Droplets className="w-4 h-4" />, publicPath: "/products" },
    servicing: { label: "Servicing", icon: <Wrench className="w-4 h-4" />, publicPath: "/servicing" },
    projects: { label: "Projects", icon: <Briefcase className="w-4 h-4" />, publicPath: "/projects" },
    contact: { label: "Contact Us", icon: <Phone className="w-4 h-4" />, publicPath: "/contact" },
};

export function SharedLiveEditor({
    pageSlug,
    initialData,
    initialZhData,
}: {
    pageSlug: string;
    initialData: any;
    initialZhData?: any;
}) {
    const normalizeData = (initial: any) => {
        if (!initial || typeof initial !== "object" || !("content" in initial)) {
            return { content: [], root: {} };
        }

        // Deep copy the initial data
        const clone = JSON.parse(JSON.stringify(initial));
        const seenIds = new Set<string>();

        // Recursive function to sanitize any block or array of blocks, including nested DropZones
        const sanitizeNode = (node: any) => {
            if (Array.isArray(node)) {
                node.forEach(sanitizeNode);
            } else if (node && typeof node === "object") {
                // If this object looks like a Puck block (has a type)
                if (node.type) {
                    if (!node.props) node.props = {};

                    let targetId = node.props.id || node.id;
                    if (!targetId || seenIds.has(targetId)) {
                        targetId = `${node.type.toLowerCase()}-${crypto.randomUUID()}`;
                    }

                    seenIds.add(targetId);
                    node.props.id = targetId;
                    node.id = targetId;
                }

                // Recursively stringify/traverse all properties to catch nested DropZones
                // Puck nested zones are typically objects or arrays inside props
                for (const key in node) {
                    if (typeof node[key] === "object" && node[key] !== null) {
                        sanitizeNode(node[key]);
                    }
                }
            }
        };

        if (Array.isArray(clone.content)) {
            sanitizeNode(clone.content);
        }

        return clone;
    };

    const [data, setData] = useState(() => normalizeData(initialData));
    const [zhData, setZhData] = useState(() => normalizeData(initialZhData));
    const [isZh, setIsZh] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
    const [lastSavedData, setLastSavedData] = useState(data);
    const [lastSavedZhData, setLastSavedZhData] = useState(zhData);
    const [isMounted, setIsMounted] = useState(false);

    const meta = PAGE_META[pageSlug] ?? { label: pageSlug, icon: null, publicPath: `/${pageSlug}` };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSave = useCallback(
        async (currentData: any, targetLocale: "en" | "zh") => {
            setSaveStatus("saving");
            try {
                const payload = {
                    slug: pageSlug,
                    locale: targetLocale,
                    fullData: currentData,
                };
                console.log(`[SharedLiveEditor] Autosaving slug="${pageSlug}" locale="${targetLocale}"`);
                const res = await fetch("/api/save-page", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || `HTTP ${res.status}`);
                }
                setSaveStatus("saved");
                if (targetLocale === "zh") {
                    setLastSavedZhData(JSON.parse(JSON.stringify(currentData)));
                } else {
                    setLastSavedData(JSON.parse(JSON.stringify(currentData)));
                }
            } catch (err: any) {
                console.error("[SharedLiveEditor] Autosave error:", err);
                setSaveStatus("error");
                toast.error(`Autosave failed: ${err.message}`);
            }
        },
        [pageSlug]
    );

    const syncToChinese = useCallback((newEnData: any, oldZhData: any) => {
        const translatedKeys = ['title', 'description', 'heading', 'label', 'value', 'ctaText', 'content', 'subtitle', 'name', 'text'];

        const clone = JSON.parse(JSON.stringify(newEnData));

        const mergeBlocks = (enBlocks: any[], zhBlocks: any[]) => {
            return enBlocks.map(enBlock => {
                const zhBlock = zhBlocks?.find((b: any) => b.id === enBlock.id);
                if (!zhBlock) return enBlock;

                const newProps = { ...enBlock.props };
                for (const key of Object.keys(newProps)) {
                    if (translatedKeys.includes(key) && zhBlock.props?.[key] !== undefined) {
                        newProps[key] = zhBlock.props[key];
                    } else if (Array.isArray(newProps[key]) && Array.isArray(zhBlock.props?.[key])) {
                        if (newProps[key].length === zhBlock.props[key].length) {
                            newProps[key] = newProps[key].map((item: any, i: number) => {
                                const zhItem = zhBlock.props[key][i];
                                const mergedItem = { ...item };
                                for (const k of translatedKeys) {
                                    if (zhItem[k] !== undefined) mergedItem[k] = zhItem[k];
                                }
                                return mergedItem;
                            });
                        }
                    }
                }

                const result = { ...enBlock, props: newProps };

                if (enBlock.zones) {
                    result.zones = {};
                    for (const zoneKey of Object.keys(enBlock.zones)) {
                        result.zones[zoneKey] = mergeBlocks(enBlock.zones[zoneKey], zhBlock.zones?.[zoneKey] || []);
                    }
                }

                return result;
            });
        };

        clone.content = mergeBlocks(clone.content || [], oldZhData?.content || []);
        return clone;
    }, []);

    // Debounced autosave
    useEffect(() => {
        const currentData = isZh ? zhData : data;
        const lastSaved = isZh ? lastSavedZhData : lastSavedData;
        const hasChanged = JSON.stringify(currentData) !== JSON.stringify(lastSaved);

        if (hasChanged) {
            setSaveStatus("unsaved");
            const timer = setTimeout(() => {
                handleSave(currentData, isZh ? "zh" : "en");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [data, zhData, isZh, handleSave, lastSavedData, lastSavedZhData]);

    if (!isMounted) {
        return (
            <div className="h-full bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    <p className="text-slate-500 text-sm font-medium">Loading Editor...</p>
                </div>
            </div>
        );
    }

    const statusDot = {
        saved: "bg-emerald-500",
        saving: "bg-amber-500 animate-pulse",
        unsaved: "bg-blue-400",
        error: "bg-red-500",
    }[saveStatus];

    const statusText = {
        saved: "All Changes Saved",
        saving: "Saving...",
        unsaved: "Unsaved Changes",
        error: "Error Saving",
    }[saveStatus];

    return (
        <div className="h-screen flex flex-col">
            {/* Top bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="text-slate-400">{meta.icon}</div>
                    <span className="font-black text-sm uppercase tracking-widest">{meta.label}</span>
                    <a
                        href={`/en${meta.publicPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-400 transition-colors ml-2"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Preview Live
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    {/* Save status pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                        <div className={`w-2 h-2 rounded-full ${statusDot}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                            {statusText}
                        </span>
                    </div>

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

            {/* Puck Editor */}
            <div className="flex-1 overflow-hidden">
                <Puck
                    key={isZh ? 'zh' : 'en'}
                    config={config as any}
                    data={isZh ? zhData : data}
                    onChange={(newData) => {
                        if (isZh) {
                            setZhData(newData);
                        } else {
                            setData(newData);
                            // Auto-sync structure to Chinese data in state
                            setZhData((prevZh: any) => {
                                const newZh = syncToChinese(newData, prevZh);
                                // Queue a background save for the Chinese version so it hits the DB
                                handleSave(newZh, 'zh');
                                return newZh;
                            });
                        }
                    }}
                    headerPath={`/${isZh ? 'zh' : 'en'}${meta.publicPath}`}
                />
            </div>
        </div>
    );
}
