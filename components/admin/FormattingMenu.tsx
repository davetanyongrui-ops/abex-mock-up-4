"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Type,
    Palette,
    CaseSensitive,
    ChevronRight,
    Bold,
    Italic,
    Maximize2,
    Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormattingMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onApplyClass: (className: string) => void;
    currentClasses: string;
}

const TEXT_SIZES = [
    { label: "Small", class: "text-sm" },
    { label: "Base", class: "text-base" },
    { label: "Large", class: "text-lg" },
    { label: "Extra Large", class: "text-xl" },
    { label: "2XL", class: "text-2xl" },
    { label: "3XL", class: "text-3xl" },
    { label: "4XL", class: "text-4xl" },
    { label: "5XL", class: "text-5xl" },
];

const COLORS = [
    { label: "Slate (Default)", class: "text-slate-900" },
    { label: "Blue", class: "text-blue-600" },
    { label: "Orange", class: "text-[#FF7E1A]" },
    { label: "Red", class: "text-red-600" },
    { label: "White", class: "text-white" },
    { label: "Grey", class: "text-slate-500" },
];

const WEIGHTS = [
    { label: "Light", class: "font-light" },
    { label: "Regular", class: "font-normal" },
    { label: "Medium", class: "font-medium" },
    { label: "Bold", class: "font-bold" },
    { label: "Extrabold", class: "font-extrabold" },
    { label: "Black", class: "font-black" },
];

export function FormattingMenu({ x, y, onClose, onApplyClass, currentClasses }: FormattingMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed z-[9999] bg-white border border-slate-200 shadow-2xl rounded-xl py-2 min-w-[200px] animate-in zoom-in-95 duration-100"
            style={{
                left: Math.min(x, typeof window !== 'undefined' ? window.innerWidth - 220 : x),
                top: Math.min(y, typeof window !== 'undefined' ? window.innerHeight - 300 : y)
            }}
        >
            <div className="px-3 py-1 mb-1 border-b border-slate-100 flex items-center gap-2">
                <CaseSensitive className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Typography</span>
            </div>

            {/* Sizes */}
            <div
                className="relative group px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                onMouseEnter={() => setActiveSubmenu("size")}
            >
                <div className="flex items-center gap-3">
                    <Maximize2 className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Size</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />

                {activeSubmenu === "size" && (
                    <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 shadow-xl rounded-xl py-2 min-w-[150px]">
                        {TEXT_SIZES.map(s => (
                            <div
                                key={s.class}
                                onClick={() => onApplyClass(s.class)}
                                className={cn(
                                    "px-4 py-1.5 hover:bg-blue-50 text-sm cursor-pointer transition-colors",
                                    currentClasses.includes(s.class) ? "text-blue-600 font-bold bg-blue-50/50" : "text-slate-600"
                                )}
                            >
                                {s.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Colors */}
            <div
                className="relative group px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                onMouseEnter={() => setActiveSubmenu("color")}
            >
                <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Color</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />

                {activeSubmenu === "color" && (
                    <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 shadow-xl rounded-xl py-2 min-w-[150px]">
                        {COLORS.map(c => (
                            <div
                                key={c.class}
                                onClick={() => onApplyClass(c.class)}
                                className={cn(
                                    "px-4 py-1.5 hover:bg-blue-50 text-sm flex items-center gap-2 cursor-pointer",
                                    currentClasses.includes(c.class) ? "text-blue-600 font-bold" : "text-slate-600"
                                )}
                            >
                                <div className={cn("w-3 h-3 rounded-full border border-slate-100", c.class.replace('text-', 'bg-'))} />
                                {c.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Weights */}
            <div
                className="relative group px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                onMouseEnter={() => setActiveSubmenu("weight")}
            >
                <div className="flex items-center gap-3">
                    <Bold className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Weight</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />

                {activeSubmenu === "weight" && (
                    <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 shadow-xl rounded-xl py-2 min-w-[150px]">
                        {WEIGHTS.map(w => (
                            <div
                                key={w.class}
                                onClick={() => onApplyClass(w.class)}
                                className={cn(
                                    "px-4 py-1.5 hover:bg-blue-50 text-sm cursor-pointer transition-colors",
                                    currentClasses.includes(w.class) ? "text-blue-600 font-bold" : "text-slate-600",
                                    w.class
                                )}
                            >
                                {w.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mx-2 my-1 border-t border-slate-100" />
            <div
                onClick={onClose}
                className="px-3 py-2 hover:bg-red-50 text-red-600 text-sm font-medium cursor-pointer transition-colors flex items-center gap-3"
            >
                <Minimize2 className="w-4 h-4" />
                Close Menu
            </div>
        </div>
    );
}
