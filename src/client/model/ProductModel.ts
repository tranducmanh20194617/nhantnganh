export interface DataItem {
    product_id: string;
    name: string;
    images: string[] | null;
    description: string;
    price: string;
    sale: boolean;
    href: string;
    tag: string;
}

export class ProductModel {
     raw : Record<string, any>

    constructor(data: Record<string, any>) {
        this.raw = data
    }
    copyFrom(merge?: Record<string, any>) {
        return new ProductModel({
            ...this.raw,
            ...(
                !!merge && merge
            )
        })
    }
}
