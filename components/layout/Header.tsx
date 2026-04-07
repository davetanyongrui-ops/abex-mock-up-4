"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAdminEdit } from "@/components/admin/AdminEditProvider";
import { InlineText } from "@/components/admin/InlineText";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('Header');

    const [dynamicPages, setDynamicPages] = useState<any[]>([]);
    const [scrolled, setScrolled] = useState(false);
    const [layoutData, setLayoutData] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch layout data
            const { data: layout } = await supabase
                .from('layout_content')
                .select('*')
                .eq('key', 'header')
                .single();

            if (layout) setLayoutData(layout);

            // Fetch dynamic pages
            const { data, error } = await supabase
                .from('pages')
                .select('slug, title, title_zh')
                .order('created_at', { ascending: true });

            if (!error && data) {
                setDynamicPages(data);
            }
        };
        fetchData();
    }, []);

    const { updateChange, resolveValue } = useAdminEdit();

    const getLabel = (key: string, defaultValue: string) => {
        const value = resolveValue(`layout:header:${key}`, layoutData ? (locale === 'zh' ? layoutData.content_zh_json : layoutData.content_json)?.[key] : null);

        if (value && typeof value === 'object') return value.content ?? defaultValue;
        return value || defaultValue;
    };

    const getClasses = (key: string, defaultClasses: string) => {
        const value = resolveValue(`layout:header:${key}`, layoutData ? (locale === 'zh' ? layoutData.content_zh_json : layoutData.content_json)?.[key] : null);

        if (value && typeof value === 'object') return value.className ?? defaultClasses;
        return defaultClasses;
    };

    const handleUpdate = (key: string, data: any) => {
        updateChange(`layout:header:${key}`, data);
    };

    const staticLinks = [
        { labelKey: 'Home', href: "/", default: t('Home') },
        { labelKey: 'AboutUs', href: "/about", default: t('AboutUs') },
        { labelKey: 'Products', href: "/products", default: t('Products') },
        { labelKey: 'Servicing', href: "/servicing", default: t('Servicing') },
        { labelKey: 'Projects', href: "/projects", default: t('Projects') },
        { labelKey: 'ContactUs', href: "/contact", default: t('ContactUs') },
    ];

    const staticSlugs = ['index', 'about', 'products', 'projects', 'contact', 'servicing'];

    const dynamicLinks = dynamicPages
        .filter(page => !staticSlugs.includes(page.slug))
        .map(page => ({
            label: (locale === 'zh' && page.title_zh) ? page.title_zh : page.title,
            href: `/${page.slug}`,
            isDynamic: true
        }));

    const navLinks = [
        ...staticLinks.map(link => ({
            label: (
                <InlineText
                    as="span"
                    content={getLabel(link.labelKey, link.default)}
                    className={getClasses(link.labelKey, "")}
                    onUpdate={(data) => handleUpdate(link.labelKey, data)}
                />
            ),
            href: link.href
        })),
        ...dynamicLinks
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500 bg-white shadow-sm",
                scrolled ? "h-[70px]" : "h-[80px]"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">

                    <div className="flex items-center shrink-0">
                        <Link href="/" className="flex items-center transition-transform hover:scale-105">
                            <Image
                                src="/abex-logo.png"
                                alt="ABEX Logo"
                                width={180}
                                height={90}
                                className="h-[70px] sm:h-20 md:h-24 lg:h-[85px] w-auto object-contain transition-all duration-300 origin-left"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={`${link.href}-${idx}`}
                                href={link.href}
                                className={cn(
                                    "text-[20px] font-bold tracking-tight transition-all duration-300 relative group font-heading",
                                    pathname === link.href
                                        ? "text-[#FF7E1A]"
                                        : "text-black hover:text-[#FF7E1A]"
                                )}
                            >
                                {link.label}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF7E1A] transition-all duration-300 group-hover:w-full",
                                    pathname === link.href && "w-full"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">

                        {/* Language switcher — always visible */}
                        <div className="flex items-center gap-1 text-[11px] font-extrabold tracking-widest transition-colors duration-300 font-sans text-slate-400">
                            <button
                                onClick={() => router.replace(pathname, { locale: 'en' })}
                                className={cn(
                                    "px-2 py-1 transition-all hover:scale-110 font-bold",
                                    locale === 'en' ? "text-[#1E3A8A]" : "hover:text-[#1E3A8A]"
                                )}
                            >
                                EN
                            </button>
                            <span className="w-px h-3 bg-current opacity-20" />
                            <button
                                onClick={() => router.replace(pathname, { locale: 'zh' })}
                                className={cn(
                                    "px-2 py-1 transition-all hover:scale-110 font-bold",
                                    locale === 'zh' ? "text-[#1E3A8A]" : "hover:text-[#1E3A8A]"
                                )}
                            >
                                中文
                            </button>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-8 h-8" />
                        </Button>
                    </div>

                </div>
            </div>

            {/* Mobile Navigation Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col">

                        {/* Menu Header */}
                        <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
                            <Image
                                src="/abex-logo.png"
                                alt="ABEX Logo"
                                width={140}
                                height={70}
                                className="h-12 w-auto object-contain"
                            />
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="h-10 w-10 text-slate-600 hover:bg-slate-100">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Nav Links */}
                        <div className="flex-1 overflow-y-auto py-6 px-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Navigation</p>
                            <nav className="flex flex-col">
                                {navLinks.map((link, idx) => (
                                    <Link
                                        key={`mobile-${link.href}-${idx}`}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between py-4 border-b border-slate-100 text-[22px] font-bold tracking-tight transition-all font-heading group",
                                            pathname === link.href
                                                ? "text-[#FF7E1A]"
                                                : "text-slate-800 hover:text-[#FF7E1A]"
                                        )}
                                    >
                                        <span>{link.label}</span>
                                        <span className={cn(
                                            "text-slate-300 group-hover:text-[#FF7E1A] transition-colors text-lg",
                                            pathname === link.href && "text-[#FF7E1A]"
                                        )}>›</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Menu Footer */}
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Contact</p>
                            <p className="text-sm text-slate-500 font-sans">sales@abex-engrg.com</p>
                            <p className="text-sm text-slate-500 font-sans">+65 6841 2818</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
