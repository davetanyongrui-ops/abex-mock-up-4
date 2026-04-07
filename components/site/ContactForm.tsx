"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

export function ContactForm() {
    const t = useTranslations('ContactPage');
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('inquiries').insert({
            ...formData,
            type: 'contact'
        });

        // Trigger email routing API (non-blocking for UI success but awaited for reliability)
        if (!error) {
            fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: 'contact' })
            }).catch(e => console.error("Email forward failed:", e));
        }

        if (!error) {
            setSuccess(true);
            setFormData({ name: '', email: '', company: '', message: '' });
        } else {
            alert(t('submitError') + ": " + error.message);
        }
        setLoading(false);
    };

    return (
        <section className="bg-slate-50 py-20 text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-6">{t('heroTitle')}</h1>
                        <p className="text-lg text-slate-600 mb-12 font-light leading-relaxed">
                            {t('heroSubtitle')}
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-blue-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('infoTitle')}</h3>
                                    <p className="mt-1 text-slate-500">{t('address')}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-slate-900">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('phone')}</h3>
                                    <p className="mt-1 text-slate-500">{t('hours')}</p>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{t('closedDays')}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-slate-900">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('email')}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 uppercase">{t('formTitle')}</h2>

                        {success ? (
                            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl font-semibold flex flex-col items-center justify-center space-y-3">
                                <div className="bg-white p-2 rounded-full border border-green-200">
                                    <Send className="w-6 h-6 text-green-600" />
                                </div>
                                <span>{t('submitButton')} - {t('submitSuccess')}</span>
                                <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>{t('sendAnother')}</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-600 px-1">{t('nameLabel')}</Label>
                                        <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-600 px-1">{t('emailLabel')}</Label>
                                        <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600 px-1">{t('companyLabel')}</Label>
                                    <Input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600 px-1">{t('messageLabel')}</Label>
                                    <Textarea required rows={6} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="bg-slate-50 border-slate-200 rounded-none resize-none" placeholder={t('messagePlaceholder')} />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest h-14 rounded-none shadow-xl shadow-blue-600/10">
                                    {loading ? t('submitLoading') : t('submitButton')}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
