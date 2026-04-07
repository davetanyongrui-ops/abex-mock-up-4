import React from 'react';
import Image from 'next/image';
import { FaCertificate, FaShieldAlt, FaLeaf, FaCheckCircle } from "react-icons/fa";
import { useTranslations } from 'next-intl';

export function CompanyCertifications() {
    const t = useTranslations('Certifications');

    const certifications = [
        {
            name: t("iso9001Name"),
            description: t("iso9001Desc"),
            logo: "/images/cert-iso9001.png",
        },
        {
            name: t("sgbcName"),
            description: t("sgbcDesc"),
            logo: "/images/cert-sgbc.png",
        },
        {
            name: t("setscoName"),
            description: t("setscoDesc"),
            logo: "/images/cert-setsco.png",
        }
    ];

    return (
        <section className="py-24 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">{t('titleLabel')}</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-heading section-heading-center">
                        {t('title')}
                    </h2>
                    <p className="mt-8 text-lg md:text-xl text-slate-600 font-sans leading-relaxed max-w-3xl mx-auto opacity-90">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {certifications.map((cert) => (
                        <div key={cert.name} className="flex flex-col p-10 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group items-center text-center">
                            <div className="h-24 w-full relative mb-10 flex items-center justify-center transition-all duration-500">
                                <Image
                                    src={cert.logo}
                                    alt={cert.name}
                                    width={120}
                                    height={120}
                                    className="object-contain h-16 w-auto mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">{cert.name}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-sans opacity-90">{cert.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
