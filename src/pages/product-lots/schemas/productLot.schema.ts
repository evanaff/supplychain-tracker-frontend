import { z } from 'zod';

export const CreateProductLotSchema = z.object({
    gtin: z.string().min(1, 'Product (GTIN) is required'),
    quantity: z
        .number({ invalid_type_error: 'Quantity must be a number' })
        .positive('Quantity must be greater than 0')
        .int('Quantity must be a whole number'),
});

export const shippingEventSchema = z.object({
    destinationLocationGln: z.string().min(1, 'Destination location is required'),
});

export type CreateProductLotFormValues = z.infer<typeof CreateProductLotSchema>;
export type ShippingEventFormValues = z.infer<typeof shippingEventSchema>;
