"use client";

import { useTranslations } from 'next-intl';
import {
    Wrench,
    ShieldCheck,
    Clock,
    Settings,
    ArrowRight,
    CheckCircle2,
    Search,
    Activity,
    PenTool,
    Award
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { InlineText } from '@/components/admin/InlineText';
import { useAdminEdit } from '@/components/admin/AdminEditProvider';

interface ServicingViewProps {
    isEditable?: boolean;
    initialData?: any;
}

export function ServicingView({ isEditable = false, initialData }: ServicingViewProps) {
    const t = useTranslations('ServicingPage');
    const { updateChange, resolveValue } = useAdminEdit();

    const getLabel = (key: string) => {
        const value = resolveValue(`ServicingPage:${key}`, initialData?.[key]);
        if (value && typeof value === 'object') return value.content ?? t(key);
        return value || t(key);
    };

    const getClasses = (key: string) => {
        const value = resolveValue(`ServicingPage:${key}`, initialData?.[key]);
        if (value && typeof value === 'object') return value.className ?? "";
        return "";
    };

    const handleUpdate = (key: string, data: any) => {
        updateChange(`ServicingPage:${key}`, data);
    };

    const pillars = [
        {
            titleKey: 'pillar1Title',
            descKey: 'pillar1Desc',
            icon: Wrench,
        },
        {
            titleKey: 'pillar2Title',
            descKey: 'pillar2Desc',
            icon: ShieldCheck,
        },
        {
            titleKey: 'pillar3Title',
            descKey: 'pillar3Desc',
            icon: Clock,
        },
        {
            titleKey: 'pillar4Title',
            descKey: 'pillar4Desc',
            icon: Settings,
        }
    ];

    const steps = [
        {
            titleKey: 'processStep1Title',
            descKey: 'processStep1Desc',
            icon: Search,
        },
        {
            titleKey: 'processStep2Title',
            descKey: 'processStep2Desc',
            icon: Activity,
        },
        {
            titleKey: 'processStep3Title',
            descKey: 'processStep3Desc',
            icon: PenTool,
        },
        {
            titleKey: 'processStep4Title',
            descKey: 'processStep4Desc',
            icon: Award,
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[500px] md:min-h-[750px] py-32 flex items-center overflow-hidden bg-slate-900 border-b border-white/5">
                <div className="absolute inset-x-0 inset-y-0 z-0">
                    <Image
                        src="/images/abex-servicing.jpeg"
                        alt="Abex Engineering Servicing"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full pt-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-0 py-1 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                            <span className="w-8 h-[2px] bg-primary" />
                            {t('abexServices')}
                        </div>
                        <h1 className="text-[2.2rem] md:text-[2.5rem] font-semibold tracking-[1px] text-white mb-6 leading-tight font-heading animate-in fade-in slide-in-from-left-6 duration-1000 delay-100">
                            {isEditable ? (
                                <InlineText
                                    as="span"
                                    content={getLabel('heroTitle')}
                                    className={getClasses('heroTitle')}
                                    onUpdate={(data) => handleUpdate('heroTitle', data)}
                                />
                            ) : (
                                <span className={getClasses('heroTitle')}>{getLabel('heroTitle')}</span>
                            )}
                        </h1>
                        <p className="text-[1.1rem] md:text-[1.2rem] font-normal text-white leading-relaxed font-sans max-w-2xl opacity-90 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
                            {isEditable ? (
                                <InlineText
                                    as="span"
                                    content={getLabel('heroSubtitle')}
                                    className={getClasses('heroSubtitle')}
                                    onUpdate={(data) => handleUpdate('heroSubtitle', data)}
                                />
                            ) : (
                                <span className={getClasses('heroSubtitle')}>{getLabel('heroSubtitle')}</span>
                            )}
                        </p>
                        <div className="mt-10 flex gap-4 animate-in fade-in slide-in-from-left-10 duration-1000 delay-500">
                            <Link
                                href="/contact"
                                className="h-12 inline-flex items-center px-8 bg-[#FF7E1A] text-white font-medium text-[0.9rem] rounded hover:opacity-90 transition-all shadow-lg"
                            >
                                {t('getSupport')}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Pillars Grid */}
            <section className="py-24 relative -mt-16 z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((pillar, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
                                <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm relative z-10">
                                    <pillar.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading leading-tight group-hover:text-primary transition-colors relative z-10">
                                    {isEditable ? (
                                        <InlineText
                                            as="span"
                                            content={getLabel(pillar.titleKey)}
                                            className={getClasses(pillar.titleKey)}
                                            onUpdate={(data) => handleUpdate(pillar.titleKey, data)}
                                        />
                                    ) : (
                                        <span className={getClasses(pillar.titleKey)}>{getLabel(pillar.titleKey)}</span>
                                    )}
                                </h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed font-sans opacity-90 relative z-10">
                                    {isEditable ? (
                                        <InlineText
                                            as="span"
                                            content={getLabel(pillar.descKey)}
                                            className={getClasses(pillar.descKey)}
                                            onUpdate={(data) => handleUpdate(pillar.descKey, data)}
                                        />
                                    ) : (
                                        <span className={getClasses(pillar.descKey)}>{getLabel(pillar.descKey)}</span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Process Section */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '48px 48px' }} />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-heading">
                            {isEditable ? (
                                <InlineText
                                    as="span"
                                    content={getLabel('processTitle')}
                                    className={getClasses('processTitle')}
                                    onUpdate={(data) => handleUpdate('processTitle', data)}
                                />
                            ) : (
                                <span className={getClasses('processTitle')}>{getLabel('processTitle')}</span>
                            )}
                        </h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-8 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-500 relative shadow-2xl">
                                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg border-4 border-slate-900 shadow-lg">
                                            {idx + 1}
                                        </div>
                                        <step.icon className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-heading">
                                        {isEditable ? (
                                            <InlineText
                                                as="span"
                                                content={getLabel(step.titleKey)}
                                                className={getClasses(step.titleKey)}
                                                onUpdate={(data) => handleUpdate(step.titleKey, data)}
                                            />
                                        ) : (
                                            <span className={getClasses(step.titleKey)}>{getLabel(step.titleKey)}</span>
                                        )}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-sans max-w-[240px] px-4">
                                        {isEditable ? (
                                            <InlineText
                                                as="span"
                                                content={getLabel(step.descKey)}
                                                className={getClasses(step.descKey)}
                                                onUpdate={(data) => handleUpdate(step.descKey, data)}
                                            />
                                        ) : (
                                            <span className={getClasses(step.descKey)}>{getLabel(step.descKey)}</span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -ml-32 -mb-32" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight text-white mb-10 font-heading leading-tight italic">
                                {isEditable ? (
                                    <InlineText
                                        as="span"
                                        content={getLabel('ctaTitle')}
                                        className={getClasses('ctaTitle')}
                                        onUpdate={(data) => handleUpdate('ctaTitle', data)}
                                    />
                                ) : (
                                    <span className={getClasses('ctaTitle')}>{getLabel('ctaTitle')}</span>
                                )}
                            </h2>
                            <div className="flex justify-center">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center px-10 py-5 bg-[#FF7E1A] text-white font-medium text-[1rem] rounded hover:opacity-90 transition-all shadow-xl group uppercase tracking-[0.1em]"
                                >
                                    {t('ctaButton')}
                                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
