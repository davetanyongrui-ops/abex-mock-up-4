"use client";

import React from "react";
import { useAdminEdit } from "./AdminEditProvider";
import { Button } from "@/components/ui/button";
import { Save, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminControlBar() {
    const { isEditing, saveChanges, pendingChanges, saveStatus } = useAdminEdit();
    const hasChanges = Object.keys(pendingChanges).length > 0;

    if (!isEditing) return null;

    const getStatusInfo = () => {
        switch (saveStatus) {
            case 'saving':
                return {
                    icon: <ShieldCheck className="w-5 h-5 text-blue-400 animate-spin" />,
                    text: 'Saving changes...',
                    color: 'text-blue-400'
                };
            case 'saved':
                return {
                    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
                    text: 'All changes saved',
                    color: 'text-emerald-400'
                };
            case 'error':
                return {
                    icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
                    text: 'Save failed',
                    color: 'text-red-500'
                };
            default:
                return {
                    icon: <ShieldCheck className="w-5 h-5 text-blue-400 animate-pulse" />,
                    text: hasChanges ? `${Object.keys(pendingChanges).length} unsaved changes` : "Live Editor Active",
                    color: 'text-slate-200'
                };
        }
    };

    const status = getStatusInfo();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 text-white min-w-[320px] justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        {status.icon}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</span>
                        <span className={cn("text-xs font-semibold tracking-tight transition-colors duration-300", status.color)}>
                            {status.text}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={() => saveChanges(false)}
                    disabled={!hasChanges || saveStatus === 'saving'}
                    size="sm"
                    className={cn(
                        "rounded-full px-5 h-9 font-bold text-xs transition-all active:scale-95 shadow-lg",
                        saveStatus === 'saved' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {saveStatus === 'saving' ? (
                        <span className="flex items-center">
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Saving...
                        </span>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Sync Now
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
