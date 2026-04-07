import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CertificationsList } from '@/lib/utils/certification-mapping';
import { getTranslations } from 'next-intl/server';

// Revalidate on demand or hourly
export const revalidate = 3600;

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations('ProductDetail');

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !product) {
        notFound();
    }

    // Determine which language content to use
    const isZh = locale === 'zh';
    const productName = (isZh && (product as any).name_zh)
        ? (product as any).name_zh
        : (isZh && product.specs_json?.name_zh)
            ? product.specs_json.name_zh
            : product.name;

    const productDescription = isZh
        ? ((product as any).description_zh || product.specs_json?.description_zh || product.specs_text || product.specs_json?.description || product.specs_json?.Description || "No detailed technical specifications provided.")
        : (product.specs_text || product.specs_json?.description || product.specs_json?.Description || "No detailed technical specifications provided.");

    // Fallback for specs_json if specs_zh_json is missing
    const productSpecs = (isZh && (product as any).specs_zh_json)
        ? (product as any).specs_zh_json
        : (isZh && product.specs_json?.specs_zh)
            ? product.specs_json.specs_zh
            : product.specs_json;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/products" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('backToSystems')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={productName}
                                fill
                                className="object-contain p-8"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                <span className="font-semibold tracking-widest uppercase text-sm">{t('imageComingSoon')}</span>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-sm text-xs font-bold uppercase tracking-wider border border-blue-100">
                                {productSpecs?.brand || "ABEX"}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">
                            {productName}
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed whitespace-pre-wrap">
                            {productDescription}
                        </p>

                        {/* Technical Specs Table */}
                        {productSpecs && Object.keys(productSpecs).filter(k => !['description', 'Description', 'brand', 'Brand', 'name_zh', 'specs_zh', 'description_zh', 'certifications'].includes(k)).length > 0 && (
                            <div className="mb-8 overflow-hidden rounded-xl border border-slate-200">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{t('technicalData')}</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {Object.entries(productSpecs)
                                        .filter(([key]) => !['description', 'Description', 'brand', 'Brand', 'name_zh', 'specs_zh', 'description_zh', 'certifications'].includes(key))
                                        .map(([key, value]) => (
                                            <div key={key} className="grid grid-cols-2 px-6 py-4 text-sm">
                                                <span className="font-bold text-slate-500 uppercase tracking-tight">{key}</span>
                                                <span className="text-slate-900 font-medium">{String(value)}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {/* Certifications Section */}
                        {product.certifications?.length > 0 && (
                            <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">{t('engineeringCertifications')}</h3>
                                <CertificationsList certifications={product.certifications} />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-slate-700" />
                                <span className="text-sm font-semibold text-slate-900">
                                    {t('warranty', { years: productSpecs?.brand === 'Weinman' ? 5 : 1 })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                                <Zap className="w-6 h-6 text-blue-600" />
                                <span className="text-sm font-semibold text-slate-900">{t('highEfficiency')}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href="/contact"
                                className="flex-1 py-4 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black tracking-widest uppercase transition-all shadow-premium hover:shadow-hover flex items-center justify-center"
                            >
                                {t('requestQuotation')}
                            </Link>
                            {product.pdf_manual_url && (
                                <a
                                    href={product.pdf_manual_url}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center px-6 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-sm font-semibold"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    {t('pdfSpecs')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
