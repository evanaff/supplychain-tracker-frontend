import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import config from '@/config';

export default function NotFoundPage() {
    useDocumentTitle(`404 Not Found - ${config.app.name}`);

    return (
        <>
            
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-4">
                <PackageSearch className="h-16 w-16 text-muted-foreground/30" />
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
                </div>
                <Button>
                    <Link to="/">Go to Dashboard</Link>
                </Button>
            </div>
        </>
    );
}

