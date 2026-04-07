"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Plus,
    MoreHorizontal,
    Search,
    Trash2,
    Edit,
    Loader2,
    CheckCircle,
    FileText
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";

const CERT_OPTIONS = ["ISO 9001", "Singapore Green Building Council", "Setsco", "UL Listed"];

// Default form reseter
const defaultFormData = {
    name: "",
    image_url: "",
    description: "",
    specs_json: {} as any,
    certifications: [] as string[],
    image_file: null as File | null
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [formData, setFormData] = useState(defaultFormData);
    const [newSpecKey, setNewSpecKey] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalImageUrl = formData.image_url;

            // Upload image if a new file was selected
            if (formData.image_file) {
                const uploadData = new FormData();
                uploadData.append("file", formData.image_file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Failed to upload image");
                }

                const resData = await response.json();
                finalImageUrl = resData.url;
            }

            // Auto-generate slug from name
            const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const productData = {
                name: formData.name,
                slug: generatedSlug,
                image_url: finalImageUrl,
                certifications: formData.certifications,
                specs_json: { ...formData.specs_json, description: formData.description },
                price_sgd: 0 // Default price to satisfy database constraint
            };

            if (editingId) {
                // Ignore slug on update to prevent breaking existing links
                const { slug, ...updateData } = productData;
                const { error } = await supabase.from("products").update(updateData).eq("id", editingId);
                if (error) throw error;
                toast.success("Product updated successfully", { description: formData.name });
            } else {
                const { error } = await supabase.from("products").insert([productData]);
                if (error) throw error;
                toast.success("Product added successfully", { description: formData.name });
            }

            setIsDialogOpen(false);
            setEditingId(null);
            fetchProducts();
            setFormData(defaultFormData);
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product", { description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);
        try {
            // Verify session is active
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("No active authentication session found locally. Please refresh or re-login.");
            }

            const { data, error } = await supabase.from("products").delete().eq("id", deleteConfirmId).select();
            if (error) {
                console.error("Supabase DELETION ERROR:", error);
                throw error;
            }
            if (!data || data.length === 0) {
                console.error("Delete returned no data. Possible RLS issue.");
                throw new Error("Deletion silently failed. Check permissions.");
            }
            toast.success("Product deleted successfully");
            fetchProducts();
            setDeleteConfirmId(null);
        } catch (error: any) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product", { description: error.message || "Unknown error occurred" });
            setDeleteConfirmId(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Inventory Manager</h1>
                    <p className="text-slate-500 font-medium">Manage your industrial pump catalog and specifications.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingId(null);
                        setFormData(defaultFormData);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-none font-black uppercase tracking-widest h-12 shadow-xl shadow-blue-600/20"
                            onClick={() => {
                                setEditingId(null);
                                setFormData(defaultFormData);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Pump
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-none border-0 shadow-2xl p-0 overflow-hidden">
                        <div className="bg-slate-900 px-6 py-6 border-b border-slate-800">
                            <DialogTitle className="text-xl font-black text-white uppercase tracking-widest">
                                {editingId ? "Update Asset" : "Register New Asset"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-tight mt-1">Industrial Equipment Entry Form</DialogDescription>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Equipment Name</Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="rounded-none border-slate-200"
                                        placeholder="e.g. Paragon P-Series"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Image Upload</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setFormData({ ...formData, image_file: e.target.files?.[0] || null })}
                                        className="rounded-none border-slate-200 file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-semibold hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {formData.image_url && !formData.image_file && (
                                        <p className="text-xs text-slate-500 mt-1">Leave empty to keep current image</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Industry Certifications</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {CERT_OPTIONS.map((cert) => (
                                            <div key={cert} className="flex items-center space-x-2 bg-slate-50 p-3 border border-slate-100">
                                                <input
                                                    type="checkbox"
                                                    id={cert}
                                                    checked={formData.certifications.includes(cert)}
                                                    onChange={(e) => {
                                                        const newCerts = e.target.checked
                                                            ? [...formData.certifications, cert]
                                                            : formData.certifications.filter(c => c !== cert);
                                                        setFormData({ ...formData, certifications: newCerts });
                                                    }}
                                                    className="w-4 h-4 rounded-none border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={cert} className="text-[10px] font-bold uppercase tracking-tight text-slate-700 cursor-pointer">
                                                    {cert}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</Label>
                                    <textarea
                                        className="flex min-h-[100px] w-full border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none font-sans"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the product details and specifications..."
                                    />
                                </div>

                                <div className="space-y-4 border-t border-slate-100 pt-6">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Technical Specifications</Label>

                                    <div className="space-y-2">
                                        {Object.entries(formData.specs_json || {})
                                            .filter(([k]) => !['description', 'Description'].includes(k))
                                            .map(([key, value]) => (
                                                <div key={key} className="flex items-center gap-2 bg-slate-50 p-2 border border-slate-100 group">
                                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                                        <span className="text-[10px] font-bold uppercase truncate">{key}</span>
                                                        <span className="text-[10px] text-slate-500 truncate">{String(value)}</span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            const newSpecs = { ...formData.specs_json };
                                                            delete newSpecs[key];
                                                            setFormData({ ...formData, specs_json: newSpecs });
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Key (e.g. Max Head)"
                                                value={newSpecKey}
                                                onChange={e => setNewSpecKey(e.target.value)}
                                                className="h-8 text-[10px] rounded-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Value (e.g. 50m)"
                                                value={newSpecValue}
                                                onChange={e => setNewSpecValue(e.target.value)}
                                                className="h-8 text-[10px] rounded-none"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-8 text-[10px] font-bold uppercase tracking-widest rounded-none border-dashed border-slate-300"
                                        onClick={() => {
                                            if (newSpecKey && newSpecValue) {
                                                setFormData({
                                                    ...formData,
                                                    specs_json: {
                                                        ...formData.specs_json,
                                                        [newSpecKey]: newSpecValue
                                                    }
                                                });
                                                setNewSpecKey("");
                                                setNewSpecValue("");
                                            }
                                        }}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add technical detail
                                    </Button>
                                </div>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-none h-14"
                                >
                                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
                                    Commit Entry to DB
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                    <DialogContent className="sm:max-w-[400px] rounded-none border-0 shadow-2xl p-0 overflow-hidden">
                        <div className="bg-red-600 px-6 py-6 border-b border-red-700">
                            <DialogTitle className="text-xl font-black text-white uppercase tracking-widest">
                                Confirm Deletion
                            </DialogTitle>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-semibold text-slate-700">Are you sure you want to decommission this asset? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="rounded-none font-bold uppercase tracking-widest text-xs h-12">Cancel</Button>
                                <Button onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white rounded-none font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-red-600/20">
                                    {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />} Destroy
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search by equipment name or reference..."
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
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6 w-[100px]">Asset</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Product Details</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Specs</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest py-6">Control</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                    Synchronizing with Central Database...
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No assets found in current inventory.
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.map((product) => (
                            <TableRow key={product.id} className="border-slate-100 group transition-colors hover:bg-slate-50/50">
                                <TableCell className="py-6">
                                    <div className="relative w-16 h-16 border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <FileText className="w-6 h-6 text-slate-300" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-6">
                                    <p className="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                        ID: {product.slug}
                                    </p>
                                </TableCell>
                                <TableCell className="py-6">
                                    <div className="text-xs text-slate-600 line-clamp-2 max-w-[200px]">
                                        {product.specs_json?.description || product.specs_json?.Description || "No description provided."}
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none border-slate-200">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Management</DropdownMenuLabel>
                                            <DropdownMenuItem className="text-xs font-bold font-sans uppercase tracking-tight py-3" onClick={() => {
                                                setEditingId(product.id);
                                                setFormData({
                                                    name: product.name,
                                                    image_url: product.image_url || "",
                                                    description: product.specs_json?.description || product.specs_json?.Description || "",
                                                    specs_json: product.specs_json || {},
                                                    certifications: product.certifications || [],
                                                    image_file: null
                                                });
                                                setIsDialogOpen(true);
                                            }}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-xs font-bold font-sans uppercase tracking-tight py-3"
                                                onClick={() => {
                                                    alert(`Product Creation Log:\nCreated At: ${new Date(product.created_at).toLocaleString()}`);
                                                }}
                                            >
                                                <FileText className="mr-2 h-4 w-4" /> View Logs
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            <DropdownMenuItem
                                                className="text-xs font-bold font-sans uppercase tracking-tight py-3 text-red-600"
                                                onClick={() => setDeleteConfirmId(product.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Decommission Asset
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
