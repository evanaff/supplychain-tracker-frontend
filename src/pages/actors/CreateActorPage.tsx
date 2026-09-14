import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LocationCombobox } from '@/components/shared/LocationCombobox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    createActorSchema,
    type CreateActorFormValues,
} from './schemas/actor.schema';
import config from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetch';

const ROLE_OPTIONS = ['GROWER', 'DISTRIBUTOR', 'RETAILER'] as const;

export default function CreateActorPage() {
    useDocumentTitle(`Add Actor - ${config.app.name}`);

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateActorFormValues>({
        resolver: zodResolver(createActorSchema),
    });

    const onSubmit = async (
        values: CreateActorFormValues,
    ) => {
        setSubmitError(null);

        try {
            const response = await fetchWithAuth(
                `${config.api.baseUrl}/api/actors`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                },
            );

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message ?? 'Failed to create actor');
            }

            navigate('/actors');
        } catch (err) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Failed to create actor');
            }
        }
    };

    if (!isAdmin) {
        return <Navigate to="/product-lots" replace />;
    }

    return (
        <>
            
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon-sm" onClick={() => navigate('/actors')} className="shrink-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Actor</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Register a new supply chain actor
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="blockchainAddress">Blockchain Address <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="blockchainAddress"
                                        placeholder="0x..."
                                        {...register('blockchainAddress')}
                                    />
                                    {errors.blockchainAddress && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.blockchainAddress.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                    <Input id="name" placeholder="John Doe" {...register('name')} />
                                    {errors.name && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locationGln">Location <span className="text-destructive">*</span></Label>
                                    <Controller
                                        name="locationGln"
                                        control={control}
                                        render={({ field }) => (
                                            <LocationCombobox
                                                id="locationGln"
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={!!errors.locationGln}
                                            />
                                        )}
                                    />
                                    {errors.locationGln && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.locationGln.message}</p>
                                    )}
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="role-select">Role <span className="text-destructive">*</span></Label>
                                    <Select
                                        onValueChange={(v) =>
                                            setValue('role', v as CreateActorFormValues['role'], { shouldValidate: true })
                                        }
                                    >
                                        <SelectTrigger id="role-select">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLE_OPTIONS.map((r) => (
                                                <SelectItem key={r} value={r}>
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.role.message}</p>
                                    )}
                                </div>
                            </div>

                            {submitError && (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                    {submitError}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting…' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

