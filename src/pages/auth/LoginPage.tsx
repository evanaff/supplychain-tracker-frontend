import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ExternalLink, Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { authApi } from '@/api/auth.api';
import { getSigner } from '@/lib/ethers';
import { buildSiwePayload } from '@/lib/utils';
import config from '@/config';
import type { AuthActor } from '@/types/auth.types';
import logo from '@/assets/logo.svg';

type LoginStep = 'connect' | 'sign' | 'verifying';

export default function LoginPage() {
    useDocumentTitle(`Log In - ${config.app.name}`);

    const navigate = useNavigate();
    const { setAuth, isAuthenticated, role } = useAuth();
    const wallet = useWallet();

    const [step, setStep] = useState<LoginStep>('connect');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (isAuthenticated) {
        let redirectPath = '/';
        if (redirectPath === '/') {
            if (role === 'ADMIN') {
                redirectPath = '/dashboard';
            } else if (role && ['GROWER', 'DISTRIBUTOR', 'RETAILER'].includes(role)) {
                redirectPath = '/product-lots';
            }
        }
        navigate(redirectPath, { replace: true });
        return null;
    }

    const handleConnectAndSign = async () => {
        setErrorMessage(null);

        try {
            // Connect Wallet
            const address = await wallet.connect();
            if (!address) return;

            // Get SIWE Message
            setStep('sign');
            const payload = buildSiwePayload(address);
            const msgRes = await authApi.getMessage(payload);
            const siweMessage = msgRes.data.data.message;

            // Sign SIWE Message
            const signer = await getSigner();
            const signature = await signer.signMessage(siweMessage);

            // Verify Signature
            setStep('verifying');
            const verifyRes = await authApi.verify({ message: siweMessage, signature });
            const { accessToken, refreshToken, actor } = verifyRes.data.data;

            setAuth(accessToken, refreshToken, actor as AuthActor);
            let redirectPath = '/';
            const userRole = (actor as AuthActor).role;
            if (redirectPath === '/') {
                if (userRole === 'ADMIN') {
                    redirectPath = '/dashboard';
                } else if (['GROWER', 'DISTRIBUTOR', 'RETAILER'].includes(userRole)) {
                    redirectPath = '/product-lots';
                }
            }
            navigate(redirectPath, { replace: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            let message = 'Authentication failed. Please try again.';
            
            if (err?.code === 'ACTION_REJECTED' || err?.message?.includes('user rejected action')) {
                message = 'Signature request was rejected. You must sign the message to authenticate.';
            } else if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            setErrorMessage(message);
            setStep('connect');
        }
    };

    const stepLabel: Record<LoginStep, string> = {
        connect: 'Log In',
        sign: 'Sign the message…',
        verifying: 'Verifying signature…',
    };

    const isLoading = step === 'sign' || step === 'verifying';

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6 animate-slide-up">
                    {/* Brand header */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <img 
                            src={logo} 
                            alt="Logo"
                            className="h-20 w-20 drop-shadow-md" 
                        />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{config.app.name}</h1>
                            <p className="text-muted-foreground text-sm">
                                Fruits & vegetables supply chain traceability
                            </p>
                        </div>
                    </div>

                    {/* Login card */}
                    <Card className="shadow-xl border-border/50">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-xl">Log In</CardTitle>
                            <CardDescription>
                                Connect your wallet to authenticate. Your wallet address must be
                                registered by an administrator.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* MetaMask not installed */}
                            {!wallet.isMetaMaskInstalled && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-2.5 text-sm text-amber-800">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">MetaMask not detected</p>
                                        <a
                                            href="https://metamask.io"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline inline-flex items-center gap-1 mt-0.5"
                                        >
                                            Install MetaMask <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Error state */}
                            {errorMessage && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex gap-2.5 text-sm text-destructive">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            {/* Network info */}
                            <div className="rounded-lg bg-muted p-3 flex items-center gap-2 text-sm">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-muted-foreground">
                                    Network: <span className="font-medium text-foreground">{config.chain.name}</span>
                                    <span className="text-xs ml-1 text-muted-foreground">(Chain ID: {config.chain.id})</span>
                                </span>
                            </div>

                            {/* Log in button */}
                            <Button
                                id="sign-in-button"
                                className="w-full gap-2 h-11"
                                size="lg"
                                onClick={() => void handleConnectAndSign()}
                                disabled={isLoading || !wallet.isMetaMaskInstalled}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <LogIn className="h-4 w-4" />
                                )}
                                {stepLabel[step]}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security note */}
                    <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Authenticated via Sign-In with Ethereum (SIWE)</span>
                    </div>
                </div>
            </div>
        </>
    );
}
