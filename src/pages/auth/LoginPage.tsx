import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ExternalLink, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { getSigner } from '@/lib/ethers';
import { buildSiwePayload } from '@/lib/utils';
import config from '@/config';
import type { AuthActor } from '@/types';
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

            const messageResponse = await fetch(
                `${config.api.baseUrl}/api/auth/message`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                },
            );
            if (!messageResponse.ok) {
                const errorResult = await messageResponse.json();
                throw new Error(errorResult.message ?? 'Failed to create SIWE message');
            }
            const messageResult = await messageResponse.json();
            const siweMessage = messageResult.data.message;

            // Sign SIWE Message
            const signer = await getSigner();
            const signature = await signer.signMessage(siweMessage);

            // Verify Signature
            setStep('verifying');

            const verifyResponse = await fetch(
                `${config.api.baseUrl}/api/auth/verify`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: siweMessage,
                        signature,
                    }),
                },
            );
            if (!verifyResponse.ok) {
                const errorResult = await verifyResponse.json();
                throw new Error(errorResult.message ?? 'Failed to verify signature');
            }
            const verifyResult = await verifyResponse.json();

            const { accessToken, refreshToken, actor } = verifyResult.data;
            setAuth(accessToken, refreshToken, actor as AuthActor);
            let redirectPath = '/';
            const userRole = actor.role;
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
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 animate-slide-up">
                {/* Brand header */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-20 w-20 drop-shadow-md"
                    />

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {config.app.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Fruits supply chain traceability
                        </p>
                    </div>
                </div>

                {/* Login card */}
                <Card className="border-border/50 shadow-xl">
                    <CardHeader className="items-center space-y-2 pb-3 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Log In
                        </CardTitle>

                        <CardDescription className="max-w-sm leading-relaxed">
                            Connect your wallet to authenticate. Your wallet address must be
                            registered by an administrator.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-2">
                        {/* MetaMask not installed */}
                        {!wallet.isMetaMaskInstalled && (
                            <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                                <div>
                                    <p className="font-medium">
                                        MetaMask not detected
                                    </p>

                                    <a
                                        href="https://metamask.io"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-0.5 inline-flex items-center gap-1 underline"
                                    >
                                        Install MetaMask
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {errorMessage && (
                            <div className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {/* Network info */}
                        <div className="flex items-center    gap-2 rounded-lg bg-muted/80 px-3 py-3 text-sm">
                            <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />

                            <span className="text-muted-foreground">
                                Network:{' '}
                                <span className="font-semibold text-foreground">
                                    {config.chain.name}
                                </span>

                                <span className="ml-1 text-xs">
                                    (Chain ID: {config.chain.id})
                                </span>
                            </span>
                        </div>

                        {/* Log in button */}
                        <Button
                            id="sign-in-button"
                            className="h-11 w-full gap-2 font-semibold"
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
            </div>
        </div>
    );
}
