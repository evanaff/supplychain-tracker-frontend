import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { locationsApi } from '@/api/locations.api';
import {
    createLocationSchema,
    type CreateLocationFormValues,
} from './schemas/location.schema';
import config from '@/config';
import { useAuth } from '@/hooks/useAuth';

const ROLE_OPTIONS = ['GROWER', 'DISTRIBUTOR', 'RETAILER'] as const;

export default function CreateLocationPage() {
    useDocumentTitle(`Add Location - ${config.app.name}`);

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateLocationFormValues>({
        resolver: zodResolver(createLocationSchema),
    });

    const createMutation = useMutation({
        mutationFn: (values: CreateLocationFormValues) => locationsApi.create(values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['locations'] });
            navigate('/locations');
        },
    });

    const onSubmit = (values: CreateLocationFormValues) => {
        createMutation.mutate(values);
    };

    if (!isAdmin) {
        return <Navigate to="/product-lots" replace />;
    }

    return (
        <>
            
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon-sm" onClick={() => navigate('/locations')} className="shrink-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Location</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Register a new location
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="gln">GLN (13 digits) <span className="text-destructive">*</span></Label>
                                    <Input id="gln" placeholder="1234567890123" {...register('gln')} />
                                    {errors.gln && <p className="text-[13px] text-destructive font-medium">{errors.gln.message}</p>}
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="loc-name">Name <span className="text-destructive">*</span></Label>
                                    <Input id="loc-name" placeholder="Central Warehouse" {...register('name')} />
                                    {errors.name && <p className="text-[13px] text-destructive font-medium">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                                    <Input id="province" {...register('province')} />
                                    {errors.province && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.province.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                                    <Input id="city" {...register('city')} />
                                    {errors.city && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.city.message}</p>
                                    )}
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                                    <Input id="address" {...register('address')} />
                                    {errors.address && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.address.message}</p>
                                    )}
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="allowedRole-select">Allowed Role <span className="text-destructive">*</span></Label>
                                    <Select
                                        onValueChange={(v) =>
                                            setValue('allowedRole', v as CreateLocationFormValues['allowedRole'], {
                                                shouldValidate: true,
                                            })
                                        }
                                    >
                                        <SelectTrigger id="allowedRole-select">
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
                                    {errors.allowedRole && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.allowedRole.message}</p>
                                    )}
                                </div>
                            </div>

                            {createMutation.isError && (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                    {createMutation.error.message}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/locations')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating…' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

