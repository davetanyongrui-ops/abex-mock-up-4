"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Download, Droplet, Search, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { CertificationsList } from '@/lib/utils/certification-mapping';

export function ProductCatalog() {
    const t = useTranslations('ProductsPage');
    const locale = useLocale();
    const isZh = locale === 'zh';
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            const ORDER: string[] = [
                "pa series",
                "pa series - fire pump",
                "paz series",
                "p-iso series",
                "ps series",
                "pil series",
                "pv series",
                "pm series",
                "cp series",
                "sp series",
                "pbs series",
                "pem series",
            ];

            const getOrder = (product: any): number => {
                const name = (product.name || "").toLowerCase();
                const brand = (product.specs_json?.brand || "").toLowerCase();
                const isWeinman = name.includes("weinman") || brand.includes("weinman");
                if (isWeinman) return ORDER.length + 1; // Weinman always last

                // Find the most specific (longest) matching key to avoid "pa series"
                // swallowing "pa series - fire pump"
                const bestIdx = ORDER.reduce((best, key, i) => {
                    if (name.includes(key)) {
                        if (best === -1 || key.length > ORDER[best].length) return i;
                    }
                    return best;
                }, -1);

                return bestIdx === -1 ? ORDER.length : bestIdx;
            };

            const sortedData = (data || []).sort((a: any, b: any) => getOrder(a) - getOrder(b));


            setProducts(sortedData);
            setIsLoading(false);
        };
        fetchProducts();
    }, [supabase]);

    const filteredCatalog = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="bg-slate-50 py-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="max-w-3xl">
                        <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">{t('productInventory')}</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-heading section-heading leading-tight">
                            {t('heroTitle')}
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 font-sans leading-relaxed opacity-90">
                            {t('heroSubtitle')}
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder={t('searchPlaceholder')}
                            className="pl-12 h-14 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-primary/10 focus:border-primary transition-all font-sans text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6" />
                        <span className="text-base font-bold tracking-widest uppercase font-sans">{t('loading')}</span>
                    </div>
                ) : filteredCatalog.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-2xl border border-slate-100 shadow-lg max-w-2xl mx-auto">
                        <Droplet className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">{t('noMatches')}</h3>
                        <p className="text-slate-500 text-base font-sans leading-relaxed">{t('adjustSearch')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCatalog.map((product) => (
                            <div key={product.id} className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">

                                <Link href={`/products/${product.slug}`} className="relative h-48 w-full overflow-hidden bg-gray-50 block p-4 border-b border-slate-100">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 transform transition-transform duration-700 ease-in-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <Droplet className="w-12 h-12" />
                                        </div>
                                    )}
                                </Link>

                                <div className="flex flex-col flex-grow p-5">
                                    <div className="mb-3 flex-grow">
                                        <Link href={`/products/${product.slug}`} className="block mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
                                                {(isZh && product.specs_json?.name_zh) ? product.specs_json.name_zh : product.name}
                                            </h3>
                                        </Link>
                                        <div className="mb-3">
                                            <CertificationsList certifications={product.certifications} />
                                        </div>

                                        {/* Technical Specs Summary */}
                                        {product.specs_json && (
                                            <div className="space-y-1.5 mt-4">
                                                {Object.entries(product.specs_json)
                                                    .filter(([key]) => ['Flow', 'Head', 'Size', 'Power'].includes(key))
                                                    .slice(0, 3)
                                                    .map(([key, value]) => (
                                                        <div key={key} className="flex justify-between text-sm text-gray-600">
                                                            <span className="font-medium">{key}:</span>
                                                            <span className="font-semibold text-slate-900">{String(value)}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-100">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="text-sm py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-bold flex items-center shadow-sm"
                                        >
                                            {t('viewDetails')}
                                            <ChevronRight className="ml-1 w-4 h-4" />
                                        </Link>
                                        {product.pdf_manual_url && (
                                            <Link
                                                href={product.pdf_manual_url}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all border border-slate-100 hover:border-primary/10 shadow-sm"
                                                title={t('technicalSpecs')}
                                                target="_blank" rel="noopener noreferrer"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
