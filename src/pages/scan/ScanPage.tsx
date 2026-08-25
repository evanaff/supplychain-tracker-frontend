import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, SwitchCamera, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';

export default function ScanPage() {
    useDocumentTitle(`Scan - ${config.app.name}`);

    const navigate = useNavigate();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cameras, setCameras] = useState<any[]>([]);
    const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const containerId = 'qr-reader';
    
    useEffect(() => {
        // Request permission and get cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length > 0) {
                    setHasPermission(true);
                    setCameras(devices);
                    const backCamera = devices.find(
                        (c) => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('environment')
                    );
                    setCurrentCameraId(backCamera ? backCamera.id : devices[0].id);
                } else {
                    setHasPermission(false);
                    setError('No cameras found on your device.');
                }
            })
            .catch((err) => {
                setHasPermission(false);
                setError('Camera permission denied or camera not accessible.');
                console.error(err);
            });
    }, []);

    const handleScan = useCallback((decodedText: string) => {
        try {
            const url = new URL(decodedText);
            if (url.origin === window.location.origin && url.pathname.startsWith('/trace-history/')) {
                const id = url.pathname.replace('/trace-history/', '');
                if (id) {
                    if (scannerRef.current?.isScanning) {
                        scannerRef.current.stop().catch(console.error);
                    }
                    navigate(`/trace-products/${id}`);
                } else {
                    setError('Invalid QR code: Missing product ID.');
                }
            } else {
                setError('Invalid QR code: Not a valid trace URL for this system.');
            }
        // eslint-disable-next-line
        } catch (e) {
            setError('Invalid QR code: Not a valid URL');
        }
    }, [navigate]);

    useEffect(() => {
        if (!currentCameraId) return;

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(containerId);
        }

        const scanner = scannerRef.current;

        const startScanner = async () => {
            if (scanner.isScanning) {
                await scanner.stop();
            }
            try {
                await scanner.start(
                    currentCameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        handleScan(decodedText);
                    },
                    () => {
                        // Ignore scan errors
                    }
                );
            } catch (err) {
                console.error('Failed to start scanner', err);
                setError('Failed to start camera. It might be in use by another application.');
            }
        };

        startScanner();

        return () => {
            if (scanner.isScanning) {
                scanner.stop().catch(console.error);
            }
        };
    }, [currentCameraId, handleScan]);

    const handleSwitchCamera = () => {
        if (cameras.length < 2) return;
        const currentIndex = cameras.findIndex((c) => c.id === currentCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setCurrentCameraId(cameras[nextIndex].id);
    };

    let currentCameraName = 'Unknown Camera';
    if (hasPermission !== null) {
        if (cameras.length === 0) {
            currentCameraName = 'No camera available';
        } else {
            const active = cameras.find((c) => c.id === currentCameraId);
            currentCameraName = active?.label || 'Unknown Camera';
        }
    }

    return (
        <>
            
            <div className="max-w-md mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Scan QR Code</h1>
                    <p className="text-muted-foreground text-sm">
                        Scan a product's QR code to view its trace details.
                    </p>
                </div>

                <Card className="overflow-hidden border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <ScanLine className="h-5 w-5" /> Camera
                            </span>
                            {cameras.length > 1 && (
                                <Button variant="outline" size="sm" onClick={handleSwitchCamera}>
                                    <SwitchCamera className="h-4 w-4 mr-2" /> Switch
                                </Button>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Center the QR code within the highlighted area
                        </CardDescription>
                        <div className="pt-2">
                            <p className="text-xs font-medium text-muted-foreground">Current Camera</p>
                            <p className="text-sm truncate" title={currentCameraName}>{currentCameraName}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative bg-black flex items-center justify-center min-h-[300px]">
                        {hasPermission === null && (
                            <div className="flex flex-col items-center text-muted-foreground gap-3 absolute z-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm">Requesting camera access...</p>
                            </div>
                        )}
                        
                        {hasPermission === false && (
                            <div className="flex flex-col items-center text-muted-foreground gap-3 p-6 text-center absolute z-10">
                                <AlertTriangle className="h-10 w-10 text-destructive" />
                                <p className="text-sm font-medium text-destructive">{error}</p>
                                <p className="text-xs">Please allow camera access in your browser settings to use this feature.</p>
                            </div>
                        )}

                        <div 
                            id={containerId} 
                            className={`w-full h-full ${hasPermission ? 'block' : 'hidden'}`}
                        />
                    </CardContent>
                </Card>

                {error && hasPermission !== false && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex gap-2.5 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </>
    );
}

