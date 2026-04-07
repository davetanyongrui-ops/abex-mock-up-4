"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

interface AdminEditContextType {
    isEditing: boolean;
    pendingChanges: Record<string, any>;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    updateChange: (path: string, value: any) => void;
    resolveValue: (path: string, defaultValue: any) => any;
    saveChanges: (isAutosave?: boolean) => Promise<void>;
}

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export function AdminEditProvider({ children, initialData, slug, locale: propLocale }: { children: React.ReactNode; initialData: any; slug: string; locale?: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const supabase = createClient();
    const params = useParams();
    const router = useRouter();
    const locale = propLocale || (params.locale as string) || 'en';

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role === 'admin') {
                    setIsEditing(true);
                }
            }
        };
        checkAuth();
    }, []);

    // 🚀 Debounced Autosave
    useEffect(() => {
        if (!isEditing || Object.keys(pendingChanges).length === 0) return;

        const timer = setTimeout(() => {
            saveChanges(true); // Call as autosave
        }, 3000); // 3 second debounce

        return () => clearTimeout(timer);
    }, [pendingChanges, isEditing]);

    const updateChange = (path: string, value: any) => {
        setPendingChanges((prev) => {
            const existing = prev[path];
            let newValue = value;

            // If both are objects, merge them
            if (existing && typeof existing === 'object' && typeof value === 'object') {
                newValue = { ...existing, ...value };
            }

            return {
                ...prev,
                [path]: newValue,
            };
        });
        setSaveStatus('idle'); // Reset status when new changes occur
    };

    const resolveValue = (path: string, defaultValue: any) => {
        const pending = pendingChanges[path];
        if (pending !== undefined) {
            // If it's an object, we should merge it with defaultValue if defaultValue is an object
            if (pending && typeof pending === 'object' && defaultValue && typeof defaultValue === 'object') {
                return { ...defaultValue, ...pending };
            }
            return pending;
        }
        return defaultValue;
    };

    const saveChanges = async (isAutosave: boolean = false) => {
        if (Object.keys(pendingChanges).length === 0) {
            if (!isAutosave) toast.info("No changes to save");
            return;
        }

        setSaveStatus('saving');

        try {
            console.log(`[AdminEditProvider] Initiating save for slug: "${slug}", locale: "${locale}"`);
            console.log(`[AdminEditProvider] Changes summary:`, Object.keys(pendingChanges));

            const response = await fetch('/api/save-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, locale, changes: pendingChanges }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || `HTTP ${response.status}`);
            }

            setSaveStatus('saved');
            if (!isAutosave) {
                toast.success("Changes saved successfully!");
                // Clear pending changes now that they are persisted
                setPendingChanges({});
                // Tell Next.js to refresh server components
                router.refresh();
            } else {
                // For autosave, we keep pending changes for now to avoid flicker
                // In a more complex app, we'd merge them into a local 'published' state
                console.log("Autosave successful");
            }
        } catch (error: any) {
            console.error("Save error:", error);
            setSaveStatus('error');
            if (!isAutosave) toast.error(`Failed to save: ${error.message}`);
        }
    };

    return (
        <AdminEditContext.Provider value={{ isEditing, pendingChanges, saveStatus, updateChange, resolveValue, saveChanges }}>
            {children}
        </AdminEditContext.Provider>
    );
}

export const useAdminEdit = () => {
    const context = useContext(AdminEditContext);
    if (!context) {
        // Safe default for components rendered outside the provider (e.g. public pages)
        return {
            isEditing: false,
            pendingChanges: {},
            saveStatus: 'idle' as const,
            updateChange: () => { },
            resolveValue: (path: string, defaultValue: any) => defaultValue,
            saveChanges: async () => { },
        };
    }
    return context;
};
