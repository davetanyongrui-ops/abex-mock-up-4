"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Loader2, FileText, CheckCircle, ChevronDown, GripVertical, Image as ImageIcon, Heading, LayoutGrid } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Block Types matching the frontend [slug]/page.tsx engine
type BlockType = 'hero' | 'text_block' | 'feature_grid';

interface PageBlock {
    id: string;
    type: BlockType;
    title?: string;
    subtitle?: string;
    heading?: string;
    content?: string;
    features?: { title: string; description: string }[];
}

export default function AdminPagesPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const [title, setTitle] = useState("");
    const [blocks, setBlocks] = useState<PageBlock[]>([]);
    const [titleZh, setTitleZh] = useState("");
    const [blocksZh, setBlocksZh] = useState<PageBlock[]>([]);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("pages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPages(data || []);
        } catch (error) {
            console.error("Error fetching pages:", error);
            toast.error("Failed to fetch pages.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setBlocks([]);
        setTitleZh("");
        setBlocksZh([]);
        setActiveTab('en');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Page title is required.");
            return;
        }

        setIsSaving(true);
        try {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Clean up block data before saving
            const cleanedBlocks = blocks.map(b => {
                const { id, ...rest } = b;
                return rest;
            });

            const cleanedBlocksZh = blocksZh.map(b => {
                const { id, ...rest } = b;
                return rest;
            });

            const pageData = {
                title,
                title_zh: titleZh,
                slug,
                content_json: cleanedBlocks,
                content_zh_json: cleanedBlocksZh
            };

            if (editingId) {
                // Do not update slug if editing to prevent broken links
                const { slug: _ignore, ...updateData } = pageData;
                const { error } = await supabase.from("pages").update(updateData).eq("id", editingId);
                if (error) throw error;
                toast.success("Page published successfully!", { description: title });
            } else {
                const { error } = await supabase.from("pages").insert([pageData]);
                if (error) throw error;
                toast.success("New page created!", { description: title });
            }

            setIsDialogOpen(false);
            resetForm();
            fetchPages();
        } catch (error: any) {
            console.error("Error saving page:", error);
            toast.error("Failed to commit page to database.", { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        setIsDeleting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("No active authentication session found locally. Please refresh or re-login.");
            }

            const { data, error } = await supabase.from("pages").delete().eq("id", deleteConfirm.id).select();
            if (error) {
                console.error("Supabase DELETION ERROR:", error);
                throw error;
            }
            if (!data || data.length === 0) {
                throw new Error("Deletion silently failed. Check permissions.");
            }
            toast.success("Page deleted successfully.");
            fetchPages();
            setDeleteConfirm(null);
        } catch (error: any) {
            console.error("Error deleting page:", error);
            toast.error("Failed to delete page.", { description: error.message });
            setDeleteConfirm(null);
        } finally {
            setIsDeleting(false);
        }
    };

    // Block Management
    const addBlock = (type: BlockType) => {
        const newBlock: PageBlock = { id: uuidv4(), type };
        if (type === 'feature_grid') newBlock.features = [];
        if (activeTab === 'en') {
            setBlocks([...blocks, newBlock]);
        } else {
            setBlocksZh([...blocksZh, newBlock]);
        }
    };

    const removeBlock = (id: string) => {
        if (activeTab === 'en') {
            setBlocks(blocks.filter(b => b.id !== id));
        } else {
            setBlocksZh(blocksZh.filter(b => b.id !== id));
        }
    };

    const updateBlock = (id: string, updates: Partial<PageBlock>) => {
        if (activeTab === 'en') {
            setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
        } else {
            setBlocksZh(blocksZh.map(b => b.id === id ? { ...b, ...updates } : b));
        }
    };

    const addFeature = (blockId: string) => {
        const targetBlocks = activeTab === 'en' ? blocks : blocksZh;
        const setter = activeTab === 'en' ? setBlocks : setBlocksZh;
        setter(targetBlocks.map(b => {
            if (b.id !== blockId) return b;
            return {
                ...b,
                features: [...(b.features || []), { title: '', description: '' }]
            };
        }));
    };

    const updateFeature = (blockId: string, featureIndex: number, key: 'title' | 'description', value: string) => {
        const targetBlocks = activeTab === 'en' ? blocks : blocksZh;
        const setter = activeTab === 'en' ? setBlocks : setBlocksZh;
        setter(targetBlocks.map(b => {
            if (b.id !== blockId || !b.features) return b;
            const newFeatures = [...b.features];
            newFeatures[featureIndex] = { ...newFeatures[featureIndex], [key]: value };
            return { ...b, features: newFeatures };
        }));
    };

    const removeFeature = (blockId: string, featureIndex: number) => {
        const targetBlocks = activeTab === 'en' ? blocks : blocksZh;
        const setter = activeTab === 'en' ? setBlocks : setBlocksZh;
        setter(targetBlocks.map(b => {
            if (b.id !== blockId || !b.features) return b;
            return {
                ...b,
                features: b.features.filter((_, idx) => idx !== featureIndex)
            };
        }));
    };

    const renderBlockEditor = (block: PageBlock, index: number) => {
        return (
            <div key={block.id} className="border border-slate-200 bg-slate-50 relative p-4 group">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-700 bg-white px-2 py-1 border border-slate-200 rounded">
                            Section {index + 1}: {block.type.replace('_', ' ')}
                        </span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeBlock(block.id)} className="text-red-500 h-8 px-2 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {block.type === 'hero' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Main Title overriding Page Title (Optional)</Label>
                            <Input value={block.title || ''} onChange={e => updateBlock(block.id, { title: e.target.value })} className="rounded-none border-slate-200 bg-white" placeholder="e.g. Industrial Pumping Solutions" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtitle Text</Label>
                            <textarea value={block.subtitle || ''} onChange={e => updateBlock(block.id, { subtitle: e.target.value })} className="flex w-full border border-slate-200 bg-white px-3 py-2 text-sm rounded-none min-h-[60px]" placeholder="Powering the world's industries..." />
                        </div>
                    </div>
                )}

                {block.type === 'text_block' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Section Header (Optional)</Label>
                            <Input value={block.heading || ''} onChange={e => updateBlock(block.id, { heading: e.target.value })} className="rounded-none border-slate-200 bg-white" placeholder="Our Mission" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Paragraph Content</Label>
                            <textarea value={block.content || ''} onChange={e => updateBlock(block.id, { content: e.target.value })} className="flex w-full border border-slate-200 bg-white px-3 py-2 text-sm rounded-none min-h-[120px]" placeholder="Write your full markdown/text content here..." />
                        </div>
                    </div>
                )}

                {block.type === 'feature_grid' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Grid Title Header</Label>
                            <Input value={block.heading || ''} onChange={e => updateBlock(block.id, { heading: e.target.value })} className="rounded-none border-slate-200 bg-white" placeholder="Why Choose ABEX?" />
                        </div>

                        <div className="pt-2 border-t border-slate-200 space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Grid Cards</Label>
                            {(block.features || []).map((feat, fidx) => (
                                <div key={`${block.id}-feat-${fidx}`} className="flex gap-2 items-start bg-white p-3 border border-slate-200 shadow-sm relative pr-10">
                                    <div className="flex-1 space-y-2">
                                        <Input value={feat.title} onChange={e => updateFeature(block.id, fidx, 'title', e.target.value)} className="rounded-none border-slate-200 h-8 text-sm placeholder:text-slate-400" placeholder="Card Title" />
                                        <textarea value={feat.description} onChange={e => updateFeature(block.id, fidx, 'description', e.target.value)} className="flex w-full border border-slate-200 bg-white px-3 py-2 text-xs rounded-none min-h-[60px] placeholder:text-slate-400" placeholder="Card details..." />
                                    </div>
                                    <button type="button" onClick={() => removeFeature(block.id, fidx)} className="absolute right-3 top-3 text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addFeature(block.id)} className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50 text-xs font-bold uppercase tracking-widest mt-2">
                                <Plus className="w-3 h-3 mr-2" /> Add Grid Card
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Page Builder</h1>
                    <p className="text-slate-500 font-medium">Design and structure standard dynamic website pages visually.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-none font-black uppercase tracking-widest h-12 shadow-xl shadow-blue-600/20"
                            onClick={resetForm}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Create Draft Page
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col rounded-none border-0 shadow-2xl p-0 overflow-hidden bg-white">
                        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 shrink-0 flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-xl font-black text-white uppercase tracking-widest">
                                    {editingId ? "Edit Page Structure" : "New Dynamic Page"}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    Classic Builder Mode
                                </DialogDescription>
                            </div>
                            {editingId && (
                                <Link href={`/admin/editor/${editingId}`}>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-none">
                                        <LayoutGrid className="w-3 h-3 mr-2" /> Open Visual Editor (Puck)
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white relative">
                            {/* Tab Switcher */}
                            <div className="flex border-b border-slate-200 mb-6 shrink-0">
                                <button
                                    onClick={() => setActiveTab('en')}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'en' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    English Content
                                </button>
                                <button
                                    onClick={() => setActiveTab('zh')}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'zh' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    中文内容 (Chinese)
                                </button>
                            </div>

                            {/* Page Meta */}
                            <div className="space-y-4 bg-slate-50 p-4 border border-slate-200 border-l-4 border-l-blue-500">
                                {activeTab === 'en' ? (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Internal Page Title (English)</Label>
                                        <Input
                                            required
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            className="rounded-none border-slate-300 font-bold text-lg h-12"
                                            placeholder="e.g. Terms of Service, About Us"
                                        />
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                                            <FileText className="w-3 h-3" /> Published Route:
                                            <span className="text-blue-600 lowercase bg-blue-50 px-2 py-0.5 rounded ml-1">/en/{title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '...'}</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Page Title (Chinese)</Label>
                                        <Input
                                            value={titleZh}
                                            onChange={e => setTitleZh(e.target.value)}
                                            className="rounded-none border-slate-300 font-bold text-lg h-12"
                                            placeholder="例如：服务条款，关于我们"
                                        />
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-1 italic">
                                            Note: Slug remains fixed to English for SEO consistency.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Canvas */}
                            <div className="space-y-4 min-h-[300px]">
                                {(activeTab === 'en' ? blocks : blocksZh).map((block, i) => renderBlockEditor(block, i))}
                                {(activeTab === 'en' ? blocks : blocksZh).length === 0 && (
                                    <div className="text-center py-20 border-2 border-dashed border-slate-200 bg-slate-50/50">
                                        <LayoutGrid className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500 font-medium">This {activeTab === 'en' ? 'English' : 'Chinese'} layout is currently empty.</p>
                                        <p className="text-xs text-slate-400 mt-1">Add a structural block below to begin.</p>
                                    </div>
                                )}
                            </div>

                            {/* Block Palette */}
                            <div className="grid grid-cols-3 gap-3 sticky bottom-0 pt-4 pb-2 bg-white/90 backdrop-blur border-t border-slate-100">
                                <Button type="button" variant="outline" onClick={() => addBlock('hero')} className="rounded-none border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 h-10">
                                    <ImageIcon className="w-4 h-4 mr-2 text-slate-400" /> + Hero Banner
                                </Button>
                                <Button type="button" variant="outline" onClick={() => addBlock('text_block')} className="rounded-none border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 h-10">
                                    <Heading className="w-4 h-4 mr-2 text-slate-400" /> + Text Area
                                </Button>
                                <Button type="button" variant="outline" onClick={() => addBlock('feature_grid')} className="rounded-none border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 h-10">
                                    <LayoutGrid className="w-4 h-4 mr-2 text-slate-400" /> + Feature Grid
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !title.trim()}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-none h-14"
                            >
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
                                Publish Page Render
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                    <DialogContent className="sm:max-w-[400px] rounded-none border-0 shadow-2xl p-0 overflow-hidden">
                        <div className="bg-red-600 px-6 py-6 border-b border-red-700">
                            <DialogTitle className="text-xl font-black text-white uppercase tracking-widest">
                                Confirm Deletion
                            </DialogTitle>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-semibold text-slate-700">
                                Are you sure you want to permanently delete the "{deleteConfirm?.title}" page? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-none font-bold uppercase tracking-widest text-xs h-12">Cancel</Button>
                                <Button onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white rounded-none font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-red-600/20">
                                    {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />} Destroy
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-none">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent border-slate-200">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Target Route</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Internal Layout Name</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Visual Design</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest py-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                    Loading Registered Routes...
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No dynamic pages found in the routing engine.
                                </TableCell>
                            </TableRow>
                        ) : pages.map((page) => (
                            <TableRow key={page.id} className="border-slate-100 group transition-colors hover:bg-slate-50/50">
                                <TableCell className="py-6">
                                    <a
                                        href={`/en/${page.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-mono text-sm underline decoration-blue-200 underline-offset-4 flex items-center gap-1 group/link"
                                    >
                                        /en/{page.slug}
                                        <div className="opacity-0 group-hover/link:opacity-100 transition-opacity">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </div>
                                    </a>
                                </TableCell>
                                <TableCell className="py-6">
                                    <span className="font-bold text-slate-900 tracking-tight">{page.title}</span>
                                </TableCell>
                                <TableCell className="py-6">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                                        <LayoutGrid className="w-3 h-3" />
                                        {(Array.isArray(page.content_json) ? page.content_json.length : 0)} Render Blocks
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/editor/${page.id}`}>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="h-8 rounded uppercase text-[10px] font-black tracking-widest text-white bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                            >
                                                <LayoutGrid className="w-3 h-3 mr-1.5" /> Visual Editor
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded uppercase text-[10px] font-bold tracking-widest text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors"
                                            onClick={() => {
                                                setEditingId(page.id);
                                                setTitle(page.title);
                                                setTitleZh(page.title_zh || "");
                                                // Convert DB JSON blocks back to internal state format by adding IDs
                                                const dbBlocks = Array.isArray(page.content_json) ? page.content_json : [];
                                                const dbBlocksZh = Array.isArray(page.content_zh_json) ? page.content_zh_json : [];
                                                setBlocks(dbBlocks.map((b: any) => ({ ...b, id: uuidv4() })));
                                                setBlocksZh(dbBlocksZh.map((b: any) => ({ ...b, id: uuidv4() })));
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="w-3 h-3 mr-1.5" /> Modify
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded text-slate-400 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                            onClick={() => setDeleteConfirm({ id: page.id, title: page.title })}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
