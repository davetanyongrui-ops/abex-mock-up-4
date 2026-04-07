"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import {
    Mail,
    User,
    Building2,
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    Filter,
    Search,
    Trash2
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("inquiries")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleMarkAsContacted = async (id: string, email: string) => {
        try {
            const { error } = await supabase
                .from("inquiries")
                .update({ status: 'contacted' })
                .eq("id", id);

            if (error) throw error;
            toast.success("Lead marked as contacted", { description: email });
            fetchInquiries();
        } catch (error) {
            console.error("Error updating inquiry:", error);
            toast.error("Failed to update lead status");
        }
    };

    const handleArchiveInquiry = async (id: string) => {
        try {
            const { error } = await supabase
                .from("inquiries")
                .update({ status: 'archived' })
                .eq("id", id);

            if (error) throw error;
            toast.success("Inquiry archived successfully.");
            fetchInquiries();
        } catch (error) {
            console.error("Error archiving inquiry:", error);
            toast.error("Failed to archive inquiry");
        }
    };

    const handleUnarchiveInquiry = async (id: string) => {
        try {
            const { error } = await supabase
                .from("inquiries")
                .update({ status: 'pending' })
                .eq("id", id);

            if (error) throw error;
            toast.success("Inquiry restored to inbox.");
            fetchInquiries();
        } catch (error) {
            console.error("Error unarchiving inquiry:", error);
            toast.error("Failed to unarchive inquiry");
        }
    };

    const handleDeleteInquiry = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this inquiry? This action cannot be undone.")) return;

        try {
            const { error } = await supabase
                .from("inquiries")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Inquiry deleted permanently.");
            fetchInquiries();
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            toast.error("Failed to delete inquiry");
        }
    };


    const filteredInquiries = inquiries.filter(i =>
        (viewMode === 'active' ? i.status !== 'archived' : i.status === 'archived') &&
        (i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.message.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-SG', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Lead Center</h1>
                    <p className="text-slate-500 font-medium">B2B inquiries and technical quotation requests.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 mr-4">
                        <Button onClick={() => setViewMode('active')} variant={viewMode === 'active' ? 'default' : 'ghost'} className="rounded-none font-bold uppercase tracking-widest text-[10px] h-10 shadow-none">
                            Active
                        </Button>
                        <Button onClick={() => setViewMode('archived')} variant={viewMode === 'archived' ? 'default' : 'ghost'} className="rounded-none font-bold uppercase tracking-widest text-[10px] h-10 shadow-none text-slate-500">
                            Archived
                        </Button>
                    </div>
                    <Button onClick={fetchInquiries} variant="outline" className="rounded-none font-bold uppercase tracking-widest text-[10px] border-slate-200 h-10">
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leads</p>
                        <p className="text-xl font-black text-slate-900">{inquiries.filter(i => i.status !== 'archived').length}</p>
                    </div>
                    <Mail className="w-5 h-5 text-slate-300" />
                </div>
                <div className="bg-white border border-slate-200 p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                        <p className="text-xl font-black text-orange-600">
                            {inquiries.filter(i => i.status !== 'contacted' && i.status !== 'archived').length}
                        </p>
                    </div>
                    <Clock className="w-5 h-5 text-orange-300" />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search by company, name, or message..."
                    className="pl-10 rounded-none border-slate-200 bg-white h-12 text-sm"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Data Table */}
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-none">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent border-slate-200">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Timestamp</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Sender Details</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Lead Content</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Type</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Status</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest py-6">Control</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                    Synchronizing Leads...
                                </TableCell>
                            </TableRow>
                        ) : filteredInquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No active leads found.
                                </TableCell>
                            </TableRow>
                        ) : filteredInquiries.map((inquiry) => (
                            <TableRow key={inquiry.id} className="border-slate-100 group transition-colors hover:bg-slate-50/50">
                                <TableCell className="py-6 align-top">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(inquiry.created_at)}
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 align-top">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                                            <User className="w-3 h-3 text-blue-500" />
                                            {inquiry.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-2">
                                            <Building2 className="w-3 h-3" />
                                            {inquiry.company || "Individual"}
                                        </p>
                                        <p className="text-[10px] text-blue-600 font-bold tracking-tight underline">
                                            {inquiry.email}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 max-w-md align-top">
                                    <p className="text-xs text-slate-600 leading-relaxed italic">
                                        "{inquiry.message.length > 100 ? `${inquiry.message.substring(0, 100)}...` : inquiry.message}"
                                    </p>
                                </TableCell>
                                <TableCell className="py-6 align-top">
                                    <Badge variant="outline" className="rounded-none border-slate-200 font-black uppercase tracking-widest text-[9px]">
                                        {inquiry.type || 'General'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-6 align-top">
                                    <Badge className={`rounded-none px-3 font-black uppercase tracking-widest text-[10px] ${inquiry.status === 'contacted' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                        }`}>
                                        {inquiry.status === 'contacted' ? "Contacted" : "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-6 text-right align-top">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none border-slate-200">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lead Response</DropdownMenuLabel>
                                            <DropdownMenuItem asChild className="text-xs font-bold font-sans uppercase tracking-tight py-3 cursor-pointer">
                                                <a href={`mailto:${inquiry.email}?subject=Reply to your inquiry regarding ABEX Systems`}>
                                                    <Mail className="mr-2 h-4 w-4" /> Reply via Email
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-xs font-bold font-sans uppercase tracking-tight py-3 cursor-pointer"
                                                onClick={() => handleMarkAsContacted(inquiry.id, inquiry.email)}
                                                disabled={inquiry.status === 'contacted'}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Contacted
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            {viewMode === 'active' ? (
                                                <DropdownMenuItem
                                                    className="text-xs font-bold font-sans uppercase tracking-tight py-3 text-red-600 cursor-pointer"
                                                    onClick={() => handleArchiveInquiry(inquiry.id)}
                                                >
                                                    Archive Inquiry
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    className="text-xs font-bold font-sans uppercase tracking-tight py-3 text-emerald-600 cursor-pointer"
                                                    onClick={() => handleUnarchiveInquiry(inquiry.id)}
                                                >
                                                    Restore to Inbox
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            <DropdownMenuItem
                                                className="text-xs font-bold font-sans uppercase tracking-tight py-3 text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteInquiry(inquiry.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
