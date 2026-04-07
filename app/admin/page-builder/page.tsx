import Link from "next/link";
import {
    Home,
    Info,
    Droplets,
    Wrench,
    Briefcase,
    Phone,
    ArrowRight,
    Edit3,
    Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pages = [
    { name: "Home", slug: "home", icon: Home, description: "Manage the main storefront and hero sections.", status: "Live" },
    { name: "About Us", slug: "about", icon: Info, description: "Edit company history, mission, and certifications.", status: "Live" },
    { name: "Our Pumps", slug: "products", icon: Droplets, description: "Customize the pump catalog landing page.", status: "Draft" },
    { name: "Servicing", slug: "servicing", icon: Wrench, description: "Update industrial pump service details.", status: "Live" },
    { name: "Projects", slug: "projects", icon: Briefcase, description: "Manage project excellence and case studies.", status: "Live" },
    { name: "Contact Us", slug: "contact", icon: Phone, description: "Edit contact info and consultation details.", status: "Live" },
];

export default function PageBuilderHub() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Page Builder Hub</h1>
                <p className="text-slate-500 max-w-2xl font-medium">
                    Select a page below to enter the Live Editor. Changes made here will be visible to the public after saving.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <Card key={page.slug} className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg group-hover:bg-blue-600 transition-colors">
                                    <page.icon className="w-5 h-5" />
                                </div>
                                <Badge variant={page.status === 'Live' ? 'outline' : 'secondary'} className="uppercase text-[10px] tracking-widest font-bold">
                                    {page.status}
                                </Badge>
                            </div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">{page.name}</CardTitle>
                            <CardDescription className="text-xs font-medium leading-relaxed">{page.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex gap-2">
                            <Button asChild className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest h-10 rounded-none shadow-md">
                                <Link href={`/admin/page-builder/en/${page.slug}`}>
                                    <Edit3 className="w-3 h-3 mr-2" />
                                    Launch Editor
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-10 w-10 border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50">
                                <Link href={`/en/${page.slug}`} target="_blank">
                                    <Eye className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center gap-6">
                <div className="bg-blue-600 p-4 rounded-full text-white shadow-lg">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Secure Editor Engine</h3>
                    <p className="text-xs text-blue-700 font-medium">
                        All edits are tracked and validated server-side. Ensure you have saved your changes before leaving the editor.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
