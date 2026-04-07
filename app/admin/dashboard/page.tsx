"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    Package,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        pendingInquiries: 0,
        totalInquiries: 0,
        todayInquiries: 0,
        inquiryChange: "+12.5%"
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Open (Pending) Inquiries
                const { count: pendingCount } = await supabase
                    .from("inquiries")
                    .select("*", { count: 'exact', head: true })
                    .eq('status', 'pending');

                // 2. Fetch Total Inquiries
                const { count: totalCount } = await supabase
                    .from("inquiries")
                    .select("*", { count: 'exact', head: true });

                // 3. Fetch Inquiries Received Today
                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);

                const { count: todayCount } = await supabase
                    .from("inquiries")
                    .select("*", { count: 'exact', head: true })
                    .gte('created_at', startOfToday.toISOString());

                setStats({
                    pendingInquiries: pendingCount || 0,
                    totalInquiries: totalCount || 0,
                    todayInquiries: todayCount || 0,
                    inquiryChange: "+5.2%"
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const metricCards = [
        {
            title: "Open Inquiries",
            value: stats.pendingInquiries.toString(),
            change: "Action Required",
            isPositive: false,
            icon: MessageSquare,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Today's Inquiries",
            value: stats.todayInquiries.toString(),
            change: "New Leads",
            isPositive: true,
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Total Inquiries",
            value: stats.totalInquiries.toString(),
            change: "Lifetime Count",
            isPositive: true,
            icon: Package,
            color: "text-slate-600",
            bg: "bg-slate-50"
        }
    ];

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse text-left">
                <div className="h-10 w-64 bg-slate-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200 rounded-none" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 text-left">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Operations Overview</h1>
                <p className="text-slate-500 font-medium">Real-time performance metrics and industrial leads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {metricCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title} className="border-slate-200 bg-white rounded-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    {card.title}
                                </CardTitle>
                                <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
                                    {card.value}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${card.isPositive ? "text-blue-600" : "text-orange-400"}`}>
                                        {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {card.change}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
