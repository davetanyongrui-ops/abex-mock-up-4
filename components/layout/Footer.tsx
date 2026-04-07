"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Instagram, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminEdit } from "@/components/admin/AdminEditProvider";
import { InlineText } from "@/components/admin/InlineText";

export function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Header');
    const locale = useLocale();
    const { updateChange, resolveValue } = useAdminEdit();
    const currentYear = new Date().getFullYear();
    const [layoutData, setLayoutData] = useState<any>(null);

    useEffect(() => {
        const fetchLayout = async () => {
            const { data } = await supabase
                .from('layout_content')
                .select('*')
                .eq('key', 'footer')
                .single();
            if (data) setLayoutData(data);
        };
        fetchLayout();
    }, []);

    const getLabel = (key: string, defaultValue: string) => {
        const value = resolveValue(`layout:footer:${key}`, layoutData ? (locale === 'zh' ? layoutData.content_zh_json : layoutData.content_json)?.[key] : null);

        if (value && typeof value === 'object') return value.content ?? defaultValue;
        return value || defaultValue;
    };

    const getClasses = (key: string, defaultClasses: string) => {
        const value = resolveValue(`layout:footer:${key}`, layoutData ? (locale === 'zh' ? layoutData.content_zh_json : layoutData.content_json)?.[key] : null);

        if (value && typeof value === 'object') return value.className ?? defaultClasses;
        return defaultClasses;
    };

    const handleUpdate = (key: string, data: any) => {
        updateChange(`layout:footer:${key}`, data);
    };

    return (
        <footer className="bg-gray-900 text-white font-sans border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-extrabold mb-2 tracking-tight">
                                ABEX <span className="text-orange-500">{locale === 'zh' ? '工程' : 'Engineering'}</span>
                            </h3>
                            <div className="h-1 w-20 bg-orange-500 rounded-full" />
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-sm">
                            {t("description")}
                        </p>
                        <div className="flex space-x-5 pt-2">
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wider text-gray-200">{t("quickLinks")}</h3>
                            <div className="h-1 w-12 bg-orange-500 rounded-full" />
                        </div>
                        <nav className="flex flex-col space-y-3">
                            {[
                                { label: tNav("Home"), href: "/" },
                                { label: tNav("AboutUs"), href: "/about" },
                                { label: tNav("Products"), href: "/products" },
                                { label: tNav("Projects"), href: "/projects" },
                                { label: tNav("ContactUs"), href: "/contact" },
                            ].map((link, idx) => (
                                <Link
                                    key={`${link.href}-${idx}`}
                                    href={link.href}
                                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 text-sm md:text-base flex items-center group"
                                >
                                    <ChevronRight size={14} className="mr-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wider text-gray-200">{t("contactInfo")}</h3>
                            <div className="h-1 w-12 bg-orange-500 rounded-full" />
                        </div>
                        <div className="space-y-5 text-gray-400 text-sm md:text-base">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-orange-500 shrink-0 mt-1" size={20} />
                                <p className="leading-relaxed">
                                    {locale === 'zh' ? (
                                        <>
                                            新加坡 Kallang Pudding 路 30 号 #06-02<br />
                                            Valiant 工业大厦<br />
                                            邮编 349312
                                        </>
                                    ) : (
                                        <>
                                            30 Kallang Pudding Road #06-02<br />
                                            Valiant Industrial Building<br />
                                            Singapore 349312
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="text-orange-500 shrink-0" size={20} />
                                <p>+65 6841 2818</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="text-orange-500 shrink-0" size={20} />
                                <p>sales@abex-engrg.com</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-500">
                    <p>{t("copyright", { year: currentYear })}</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white transition-colors">{t("privacy")}</a>
                        <a href="#" className="hover:text-white transition-colors">{t("terms")}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
