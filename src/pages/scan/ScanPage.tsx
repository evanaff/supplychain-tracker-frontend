import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Html5Qrcode } from 'html5-qrcode';

import { ScanLine, SwitchCamera, AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import config from '@/config';

type CameraDevice = Awaited<
    ReturnType<typeof Html5Qrcode.getCameras>
>[number];

export default function ScanPage() {
    useDocumentTitle(`Scan - ${config.app.name}`);

    const navigate = useNavigate();

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    const scannerOperationRef = useRef<Promise<void>>(Promise.resolve());
    const hasScannedRef = useRef(false);
    const containerId = 'qr-reader';
    const camerasRequestRef = useRef<
        ReturnType<typeof Html5Qrcode.getCameras> | null
    >(null);
    
    const queueScannerOperation = useCallback(
        (operation: () => Promise<void>) => {
            const nextOperation = scannerOperationRef.current.catch(() => undefined).then(operation);
            scannerOperationRef.current = nextOperation.catch(() => undefined);
            return nextOperation;
        },
        [],
    );

    const stopScanner = useCallback(() => {
        const scanner = scannerRef.current;

        if (!scanner) {
            return Promise.resolve();
        }

        return queueScannerOperation(async () => {
            if (scanner.isScanning) {
                await scanner.stop();
            }
        });
    }, [queueScannerOperation]);

    const getCameraErrorMessage = (err: unknown) => {
        const errorMessage = err instanceof Error
            ? `${err.name}: ${err.message}`
            : String(err);

        if (errorMessage.includes('NotAllowedError') || errorMessage.toLowerCase().includes('permission')) {
            return 'Camera permission was denied. Please allow camera access in your browser settings.';
        }
        if (errorMessage.includes('NotReadableError') || errorMessage.includes('Could not start video source')) {
            return 'Camera could not be started. Make sure it is not being used by another application.';
        }
        if (errorMessage.includes('NotFoundError')) {
            return 'No camera was found on this device.';
        }

        return 'Failed to start camera.';
    };

    useEffect(() => {
        let cancelled = false;

        if (!camerasRequestRef.current) {
            camerasRequestRef.current = Html5Qrcode.getCameras();
        }

        camerasRequestRef.current.then((devices) => {
            if (cancelled) {
                return;
            }

            if (devices.length > 0) {
                setHasPermission(true);
                setCameras(devices);
                const backCamera = devices.find(
                    (camera) =>
                        camera.label.toLowerCase().includes('back') ||
                        camera.label.toLowerCase().includes('environment'),
                );

                setCurrentCameraId(backCamera ? backCamera.id : devices[0].id);
            } else {
                setHasPermission(false);
                setError('No cameras found on your device.');
            }
        }).catch((err) => {
            if (cancelled) {
                return;
            }

            setHasPermission(false);
            setError('Camera permission denied or camera not accessible');
            console.error('Failed to get cameras', err);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleScan = useCallback(
        async (decodedText: string) => {
            if (hasScannedRef.current) {
                return;
            }

            try {
                const url = new URL(decodedText);

                if (url.origin === window.location.origin && url.pathname.startsWith('/product-history/')) {
                    const id = url.pathname.replace(
                        '/product-history/',
                        '',
                    );

                    if (id) {
                        hasScannedRef.current = true;

                        try {
                            await stopScanner();
                        } catch (err) {
                            console.error('Failed to stop scanner after scan', err);
                        }

                        navigate(`/product-lots/${id}`);
                    } else {
                        setError('Invalid QR code: Missing product ID');
                    }
                } else {
                    setError('Invalid QR code: Not a valid URL for this system');
                }
            } catch {
                setError('Invalid QR code: Not a valid URL');
            }
        },
        [navigate, stopScanner],
    );

    useEffect(() => {
        if (!currentCameraId) {
            return;
        }

        let cancelled = false;

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(containerId);
        }

        const scanner = scannerRef.current;
        hasScannedRef.current = false;

        const startScanner = async () => {
            try {
                await queueScannerOperation(async () => {
                    if (scanner.isScanning) {
                        await scanner.stop();
                    }

                    if (cancelled) {
                        return;
                    }

                    await scanner.start(
                        currentCameraId,
                        {
                            fps: 10,
                            qrbox: {
                                width: 250,
                                height: 250,
                            },
                            aspectRatio: 1.0,
                        },
                        (decodedText) => {
                            void handleScan(decodedText);
                        },
                        () => {
                            // Ignore scan errors
                        },
                    );

                    if (!cancelled) {
                        setError(null);
                    }
                });
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error('Failed to start scanner', err);
                setError(getCameraErrorMessage(err));
            }
        };

        void startScanner();

        return () => {
            cancelled = true;
            void stopScanner().catch((err) => {
                console.error('Failed to stop scanner', err);
            });
        };
    }, [
        currentCameraId,
        handleScan,
        queueScannerOperation,
        stopScanner,
    ]);

    const handleSwitchCamera = () => {
        if (cameras.length < 2) {
            return;
        }

        setCurrentCameraId((currentId) => {
            const currentIndex = cameras.findIndex(
                (camera) => camera.id === currentId,
            );

            const nextIndex = (currentIndex + 1) % cameras.length;

            return cameras[nextIndex].id;
        });
    };

    let currentCameraName = 'Unknown Camera';

    if (hasPermission !== null) {
        if (cameras.length === 0) {
            currentCameraName = 'No camera available';
        } else {
            const active = cameras.find(
                (camera) => camera.id === currentCameraId,
            );
            currentCameraName = active?.label || 'Unknown Camera';
        }
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Scan QR Code
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        Scan a product&apos;s QR code to view its details
                    </p>
                </div>

                <Card className="overflow-hidden border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <ScanLine className="h-5 w-5" />
                                Camera
                            </span>

                            {cameras.length > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSwitchCamera}
                                >
                                    <SwitchCamera className="h-4 w-4 mr-2" />
                                    Switch
                                </Button>
                            )}
                        </CardTitle>

                        <CardDescription>
                            Center the QR code within the highlighted area
                        </CardDescription>

                        <div className="pt-2">
                            <p className="text-xs font-medium text-muted-foreground">
                                Current Camera
                            </p>

                            <p
                                className="text-sm truncate"
                                title={currentCameraName}
                            >
                                {currentCameraName}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 relative bg-black flex items-center justify-center min-h-[300px]">
                        {hasPermission === null && (
                            <div className="flex flex-col items-center text-muted-foreground gap-3 absolute z-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />

                                <p className="text-sm">
                                    Requesting camera access...
                                </p>
                            </div>
                        )}

                        {hasPermission === false && (
                            <div className="flex flex-col items-center text-muted-foreground gap-3 p-6 text-center absolute z-10">
                                <AlertTriangle className="h-10 w-10 text-destructive" />

                                <p className="text-sm font-medium text-destructive">
                                    {error}
                                </p>

                                <p className="text-xs">
                                    Please allow camera access in your
                                    browser settings to use this feature.
                                </p>
                            </div>
                        )}

                        <div
                            id={containerId}
                            className={`w-full h-full ${
                                hasPermission ? 'block' : 'hidden'
                            }`}
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