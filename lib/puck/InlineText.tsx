"use client";

import { usePuck } from "@measured/puck";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

function ActiveInlineText({
    value,
    propName,
    componentId,
    as: Tag = "span",
    className = "",
    placeholder = "Type text...",
}: any) {
    const { dispatch } = usePuck();
    const [isAdmin, setIsAdmin] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setIsAdmin(true);
        };
        checkAuth();
    }, []);

    if (!isAdmin || !componentId) {
        return <Tag className={className} dangerouslySetInnerHTML={{ __html: value || "" }} />;
    }

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        const newText = e.currentTarget.innerText || "";
        if (newText === value) return;

        dispatch({
            type: "setData",
            data: (prev: any) => {
                const nextData = JSON.parse(JSON.stringify(prev));

                const traverse = (items: any[]) => {
                    for (const item of items) {
                        if (item.props.id === componentId) {
                            const keys = propName.split('.');
                            let current = item.props;
                            for (let i = 0; i < keys.length - 1; i++) {
                                current = current[keys[i]];
                            }
                            current[keys[keys.length - 1]] = newText;
                            return true;
                        }
                        if (item.zones) {
                            for (const zoneKey in item.zones) {
                                if (traverse(item.zones[zoneKey])) return true;
                            }
                        }
                    }
                    return false;
                };

                if (nextData.content) traverse(nextData.content);
                if (nextData.zones) {
                    for (const zoneKey in nextData.zones) {
                        traverse(nextData.zones[zoneKey]);
                    }
                }

                return nextData;
            }
        });
    };

    return (
        <Tag
            ref={contentRef}
            className={`cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-500/50 focus:outline-blue-600 hover:bg-black/5 transition-all outline-none empty:before:content-[attr(placeholder)] empty:before:text-inherit empty:before:opacity-50 relative z-50 ${className}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: value || "" }}
        />
    );
}

export function InlineText({ isEditing, value, as: Tag = "span", className = "", ...props }: any) {
    if (isEditing) {
        return <ActiveInlineText value={value} as={Tag} className={className} {...props} />;
    }
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: value || "" }} />;
}
