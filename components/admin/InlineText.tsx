"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminEdit } from "./AdminEditProvider";
import { cn } from "@/lib/utils";
import { FormattingMenu } from "./FormattingMenu";

interface InlineTextProps {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    content: string;
    className?: string;
    onUpdate: (data: { content?: string; className?: string }) => void;
    id?: string;
}

/**
 * A highly reusable inline text editing component with right-click formatting support.
 */
export function InlineText({
    as: Tag = "p",
    content: initialContent,
    className: initialClassName = "",
    onUpdate,
    id,
}: InlineTextProps) {
    const { isEditing } = useAdminEdit();
    const [isMounted, setIsMounted] = useState(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const [localClassName, setLocalClassName] = useState(initialClassName);
    const textRef = useRef<HTMLElement>(null);

    // Sync local state if prop changes externally (e.g. after save)
    useEffect(() => {
        setIsMounted(true);
        setLocalClassName(initialClassName);
    }, [initialClassName]);

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        const newText = e.currentTarget.textContent || "";
        if (newText !== initialContent) {
            onUpdate({ content: newText });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (Tag !== "p" && Tag !== "div" && e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        if (!isEditing) return;
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
    };

    const applyClass = (newClass: string) => {
        // Simple logic to toggle or replace specific categories
        // (Improving this to handle mutually exclusive Tailwind classes)
        const sizePrefixes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'];
        const weightPrefixes = ['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'];
        const colorPrefixes = ['text-slate-', 'text-blue-', 'text-red-', 'text-white', 'text-[#'];

        let classes = localClassName.split(' ');

        if (sizePrefixes.includes(newClass)) {
            classes = classes.filter(c => !sizePrefixes.includes(c));
        } else if (weightPrefixes.includes(newClass)) {
            classes = classes.filter(c => !weightPrefixes.includes(c));
        } else if (colorPrefixes.some(p => newClass.startsWith(p))) {
            classes = classes.filter(c => !colorPrefixes.some(p => c.startsWith(p)));
        }

        const updatedClasses = cn(classes, newClass);
        setLocalClassName(updatedClasses);
        onUpdate({ className: updatedClasses });
        setMenuPos(null);
    };

    if (!isMounted || !isEditing) {
        return <Tag id={id} className={initialClassName}>{initialContent}</Tag>;
    }

    return (
        <>
            <Tag
                id={id}
                ref={textRef as any}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onContextMenu={handleContextMenu}
                className={cn(
                    "transition-all duration-200 min-h-[1em] min-w-[20px] inline-block",
                    "outline-none cursor-text",
                    "hover:outline-dashed hover:outline-2 hover:outline-blue-400 hover:outline-offset-4",
                    "focus:outline-solid focus:outline-2 focus:outline-blue-600 focus:outline-offset-4 focus:bg-blue-50/20",
                    localClassName
                )}
            >
                {initialContent}
            </Tag>

            {menuPos && (
                <FormattingMenu
                    x={menuPos.x}
                    y={menuPos.y}
                    onClose={() => setMenuPos(null)}
                    onApplyClass={applyClass}
                    currentClasses={localClassName}
                />
            )}
        </>
    );
}
