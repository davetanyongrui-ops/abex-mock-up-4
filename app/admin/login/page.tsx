"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Check if already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push("/admin/dashboard");
            }
        };
        checkUser();
    }, [supabase, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log("Attempting login for:", email);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error("Supabase Error:", signInError);
                setError(signInError.message);
                return;
            }

            console.log("Login successful:", data.user?.email);

            if (data.user) {
                router.push("/admin/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            console.error("Unexpected Error:", err);
            setError(err.message || "An unexpected error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] rounded-full -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-slate-900/5 blur-[100px] rounded-full -ml-16 -mb-16" />

            <Card className="w-full max-w-md border-slate-200 shadow-2xl rounded-none border-t-8 border-t-blue-600 z-10">
                <CardHeader className="space-y-4 text-center pt-8">
                    <div className="flex justify-center">
                        <div className="bg-slate-900 p-4 rounded-xl shadow-lg">
                            <ShieldCheck className="w-10 h-10 text-blue-500" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                            ABEX ADMIN PANEL
                        </CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                            Secure Management Command Center
                        </CardDescription>

                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="rounded-none border-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Access Denied</AlertTitle>
                                <AlertDescription className="text-xs">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Admin Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@abex.com.sg"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-none border-slate-200 focus-visible:ring-blue-600 h-12 text-sm font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Secure Password
                                </Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-none border-slate-200 focus-visible:ring-blue-600 h-12 text-sm font-semibold"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-none font-black uppercase tracking-widest transition-all shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Initialize System Access"
                            )}
                        </Button>
                        {error && (
                            <p className="text-red-600 text-[10px] font-black uppercase tracking-widest text-center mt-4">
                                Authentication Failed: {error}
                            </p>
                        )}
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pb-8">
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-loose">
                        Authorized Personnel Only. <br />
                        Unauthorized access attempts are monitored and logged.
                    </p>
                    <div className="w-12 h-1 bg-slate-100 mx-auto" />
                </CardFooter>
            </Card>
        </div>
    );
}
