"use client";

import React, { useRef, useEffect } from "react";
import { useAdminEdit } from "./AdminEditProvider";
import { cn } from "@/lib/utils";

interface EditableTextProps {
    value: string;
    path: string; // e.g. "componentId:title"
    as?: React.ElementType;
    className?: string;
    placeholder?: string;
}

export function EditableText({
    value,
    path,
    as: Tag = "span",
    className,
    placeholder = "Type here...",
}: EditableTextProps) {
    const { isEditing, updateChange, resolveValue } = useAdminEdit();
    const contentRef = useRef<HTMLElement>(null);
    const resolvedValue = resolveValue(path, value);

    // Sync ref with external value if needed, but usually we want to stay in edit state
    useEffect(() => {
        if (contentRef.current && !isEditing) {
            contentRef.current.innerHTML = value || "";
        }
    }, [value, isEditing]);

    const handleBlur = () => {
        if (!contentRef.current) return;
        const newValue = contentRef.current.innerHTML;
        if (newValue !== value) {
            updateChange(path, newValue);
        }
    };

    if (!isEditing) {
        return <Tag className={className} dangerouslySetInnerHTML={{ __html: value || "" }} />;
    }

    return (
        <Tag
            ref={contentRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            className={cn(
                "transition-all outline-none min-h-[1em] block",
                "hover:outline-dashed hover:outline-2 hover:outline-blue-400 hover:cursor-text focus:outline-solid focus:outline-2 focus:outline-blue-600",
                className
            )}
            onBlur={handleBlur}
            placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: resolvedValue || "" }}
        />
    );
}
