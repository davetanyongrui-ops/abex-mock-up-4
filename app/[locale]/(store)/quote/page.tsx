"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calculator } from 'lucide-react';

export default function QuotePage() {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('inquiries').insert({
            ...formData,
            type: 'quote'
        });

        // Trigger email routing API
        if (!error) {
            fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: 'quote' })
            }).catch(e => console.error("Email forward failed:", e));
        }

        if (!error) {
            setSuccess(true);
            setFormData({ name: '', email: '', company: '', message: '' });
        } else {
            alert("Failed to submit request: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-900 min-h-screen py-24 text-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full mb-6 ring-8 ring-slate-800/50">
                        <Calculator className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-white mb-6">Request Official Quote</h1>
                    <p className="text-xl text-slate-400 font-light leading-relaxed">
                        Provide details roughly outlining your required scale, target metrics, or bulk requirements, and our precision engineering estimators will provide a formal quotation within 24 hours.
                    </p>
                </div>

                <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
                    {success ? (
                        <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl font-semibold flex flex-col items-center justify-center space-y-4 text-center">
                            <span className="text-xl text-white">Quotation Request Logged Successfully.</span>
                            <p className="text-slate-400 font-normal">A representative will reach out to you shortly to discuss your parameters.</p>
                            <Button variant="secondary" className="mt-4" onClick={() => setSuccess(false)}>Submit Another Request</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Procurement Officer Name</Label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-slate-900 border-slate-700 text-white focus:ring-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Official Email</Label>
                                    <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-slate-900 border-slate-700 text-white focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Organization / Facility Name</Label>
                                <Input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="bg-slate-900 border-slate-700 text-white focus:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Technical Requirements & Volume</Label>
                                <Textarea required rows={8} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="bg-slate-900 border-slate-700 text-white focus:ring-blue-500" placeholder="Please include required GPM, target pressure, motor specs, and deployment timelines if applicable." />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm py-6 text-lg rounded-xl transition-all">
                                {loading ? 'Processing...' : 'Submit to Estimators'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
