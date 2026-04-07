"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { InlineText } from '@/components/admin/InlineText';
import { useAdminEdit } from '@/components/admin/AdminEditProvider';

interface ContactViewProps {
    isEditable?: boolean;
    initialData?: any;
}

export function ContactView({ isEditable = false, initialData }: ContactViewProps) {
    const t = useTranslations('ContactPage');
    const { updateChange, resolveValue } = useAdminEdit();
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const getLabel = (key: string) => {
        const value = resolveValue(`ContactPage:${key}`, initialData?.[key]);
        if (value && typeof value === 'object') return value.content ?? t(key);
        return value || t(key);
    };

    const getClasses = (key: string) => {
        const value = resolveValue(`ContactPage:${key}`, initialData?.[key]);
        if (value && typeof value === 'object') return value.className ?? "";
        return "";
    };

    const handleUpdate = (key: string, data: any) => {
        updateChange(`ContactPage:${key}`, data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('inquiries').insert({
            ...formData,
            type: 'contact'
        });

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
                        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-6">
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
                        <p className="text-lg text-slate-600 mb-12 font-light leading-relaxed">
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

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-blue-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                        {isEditable ? (
                                            <InlineText
                                                as="span"
                                                content={getLabel('infoTitle')}
                                                className={getClasses('infoTitle')}
                                                onUpdate={(data) => handleUpdate('infoTitle', data)}
                                            />
                                        ) : (
                                            <span className={getClasses('infoTitle')}>{getLabel('infoTitle')}</span>
                                        )}
                                    </h3>
                                    <p className="mt-1 text-slate-500 whitespace-pre-line">
                                        {isEditable ? (
                                            <InlineText
                                                as="div"
                                                content={getLabel('address')}
                                                className={getClasses('address')}
                                                onUpdate={(data) => handleUpdate('address', data)}
                                            />
                                        ) : (
                                            <div className={getClasses('address')}>{getLabel('address')}</div>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-slate-900">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                        {isEditable ? (
                                            <InlineText as="span" content={getLabel('generalEnquiries')} className={getClasses('generalEnquiries')} onUpdate={(data) => handleUpdate('generalEnquiries', data)} />
                                        ) : (
                                            <span className={getClasses('generalEnquiries')}>{getLabel('generalEnquiries')}</span>
                                        )}
                                    </h3>
                                    <div className="mt-1 text-slate-500 text-sm">
                                        {isEditable ? (
                                            <div className="space-y-1">
                                                <InlineText as="div" content={getLabel('generalEmail')} className={getClasses('generalEmail')} onUpdate={(data) => handleUpdate('generalEmail', data)} />
                                                <InlineText as="div" content={getLabel('generalTel')} className={getClasses('generalTel')} onUpdate={(data) => handleUpdate('generalTel', data)} />
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className={getClasses('generalEmail')}>{getLabel('generalEmail')}</div>
                                                <div className={getClasses('generalTel')}>{getLabel('generalTel')}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-slate-900">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                        {isEditable ? <InlineText as="span" content={getLabel('hvacEnquiries')} className={getClasses('hvacEnquiries')} onUpdate={d => handleUpdate('hvacEnquiries', d)} /> : <span className={getClasses('hvacEnquiries')}>{getLabel('hvacEnquiries')}</span>}
                                    </h3>
                                    <div className="mt-1 text-slate-500 text-sm space-y-1">
                                        {isEditable ? <InlineText as="div" content={getLabel('hvacEmail')} className={getClasses('hvacEmail')} onUpdate={d => handleUpdate('hvacEmail', d)} /> : <div className={getClasses('hvacEmail')}>{getLabel('hvacEmail')}</div>}
                                        {isEditable ? <InlineText as="div" content={getLabel('hvacMobile')} className={getClasses('hvacMobile')} onUpdate={d => handleUpdate('hvacMobile', d)} /> : <div className={getClasses('hvacMobile')}>{getLabel('hvacMobile')}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-slate-900">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                        {isEditable ? <InlineText as="span" content={getLabel('firePumps')} className={getClasses('firePumps')} onUpdate={d => handleUpdate('firePumps', d)} /> : <span className={getClasses('firePumps')}>{getLabel('firePumps')}</span>}
                                    </h3>
                                    <div className="mt-1 text-slate-500 text-sm space-y-1">
                                        {isEditable ? <InlineText as="div" content={getLabel('fireEmail')} className={getClasses('fireEmail')} onUpdate={d => handleUpdate('fireEmail', d)} /> : <div className={getClasses('fireEmail')}>{getLabel('fireEmail')}</div>}
                                        {isEditable ? <InlineText as="div" content={getLabel('fireMobile')} className={getClasses('fireMobile')} onUpdate={d => handleUpdate('fireMobile', d)} /> : <div className={getClasses('fireMobile')}>{getLabel('fireMobile')}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white p-3 border border-slate-200 shadow-sm rounded-lg text-slate-900 text-opacity-0 border-opacity-0 bg-opacity-0">
                                    <div className="w-6 h-6" />
                                </div>
                                <div className="ml-5 flex flex-col justify-center">
                                    <div className="text-slate-700 text-sm font-medium space-y-1">
                                        {isEditable ? <InlineText as="div" content={getLabel('deliveryEnquiry')} className={getClasses('deliveryEnquiry')} onUpdate={d => handleUpdate('deliveryEnquiry', d)} /> : <div className={getClasses('deliveryEnquiry')}>{getLabel('deliveryEnquiry')}</div>}
                                        {isEditable ? <InlineText as="div" content={getLabel('accountEnquiry')} className={getClasses('accountEnquiry')} onUpdate={d => handleUpdate('accountEnquiry', d)} /> : <div className={getClasses('accountEnquiry')}>{getLabel('accountEnquiry')}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 uppercase">
                            {isEditable ? (
                                <InlineText
                                    as="span"
                                    content={getLabel('formTitle')}
                                    className={getClasses('formTitle')}
                                    onUpdate={(data) => handleUpdate('formTitle', data)}
                                />
                            ) : (
                                <span className={getClasses('formTitle')}>{getLabel('formTitle')}</span>
                            )}
                        </h2>

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
