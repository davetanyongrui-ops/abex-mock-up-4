import Image from "next/image";
import { FaCertificate, FaShieldAlt, FaLeaf, FaCheckCircle } from "react-icons/fa";

export const CERTIFICATION_MAP: Record<string, { label: string; icon: any; color: string; logo: string }> = {
    "ISO 9001": {
        label: "ISO 9001",
        icon: FaCertificate,
        color: "text-blue-600 bg-blue-50 border-blue-100",
        logo: "/images/cert-iso9001.png",
    },
    "Singapore Green Building Council": {
        label: "SGBC",
        icon: FaLeaf,
        color: "text-green-600 bg-green-50 border-green-100",
        logo: "/images/cert-sgbc.png",
    },
    "Setsco": {
        label: "Setsco",
        icon: FaShieldAlt,
        color: "text-slate-600 bg-slate-50 border-slate-200",
        logo: "/images/cert-setsco.png",
    },
};

export function CertificationBadge({ cert }: { cert: string }) {
    const config = CERTIFICATION_MAP[cert];
    if (!config) return null;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm group/badge transition-all hover:bg-white`}>
            <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                    src={config.logo}
                    alt={config.label}
                    width={16}
                    height={16}
                    className="object-contain mix-blend-multiply transition-transform group-hover/badge:scale-110"
                />
            </div>
            {config.label}
        </div>
    );
}

export function CertificationsList({ certifications }: { certifications?: string[] }) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
                <CertificationBadge key={cert} cert={cert} />
            ))}
        </div>
    );
}
