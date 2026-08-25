import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { productsApi } from '@/api/products.api';
import { createProductSchema, type CreateProductFormValues } from './schemas/product.schema';
import config from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function CreateProductPage() {
    useDocumentTitle(`Add Product - ${config.app.name}`);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isAdmin } = useAuth();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductFormValues>({
        resolver: zodResolver(createProductSchema),
    });

    const createMutation = useMutation({
        mutationFn: (values: CreateProductFormValues) => {
            const formData = new FormData();
            formData.append('gtin', values.gtin);
            formData.append('varietyName', values.varietyName);
            formData.append('unitOfMeasure', values.unitOfMeasure);
            formData.append('image', values.image[0]);
            return productsApi.create(formData);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate('/products');
        },
    });

    const onSubmit = (values: CreateProductFormValues) => {
        createMutation.mutate(values);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    if (!isAdmin) {
        return <Navigate to="/products" replace />;
    }

    return (
        <>
            
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon-sm" onClick={() => navigate('/products')} className="shrink-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create a new traceable product.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1 space-y-2">
                                    <Label htmlFor="gtin">GTIN <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="gtin"
                                        placeholder="1234567890123"
                                        {...register('gtin')}
                                    />
                                    {errors.gtin && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.gtin.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2 sm:col-span-1 space-y-2">
                                    <Label htmlFor="unitOfMeasure">Unit of Measure <span className="text-destructive">*</span></Label>
                                    <Input id="unitOfMeasure" placeholder="kg" {...register('unitOfMeasure')} />
                                    {errors.unitOfMeasure && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.unitOfMeasure.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="varietyName">Variety Name <span className="text-destructive">*</span></Label>
                                    <Input id="varietyName" placeholder="Fuji Apple" {...register('varietyName')} />
                                    {errors.varietyName && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.varietyName.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="image">Product Image <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        {...register('image')}
                                        onChange={(e) => {
                                            register('image').onChange(e); 
                                            handleImageChange(e);
                                        }}
                                    />
                                    {errors.image && (
                                        <p className="text-[13px] text-destructive font-medium">{errors.image.message as string}</p>
                                    )}
                                    {imagePreview && (
                                        <div className="mt-4 w-full max-w-sm rounded-lg overflow-hidden border">
                                            <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" />
                                        </div>
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
                                    onClick={() => navigate('/products')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating…' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

