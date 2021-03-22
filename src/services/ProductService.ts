import { ApiService } from './ApiService';

interface RegisterProduct {
  image?: File;
  description: string;
  category: string;
  quantity: string;
  provider: string;
  internal_code: string;
  barcode?: string;
  pushase_value: string;
  porcent: string;
  sale_value: string;
}

export interface Product {
  id: string;
  command_id?: string;
  product_id?: string;
  operator_id: string;
  value: number;
  quantity: number;
  description: string;
  label_description: string;
  product?: {
    image_url?: string;
  };
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchProduct {
  id?: string;
  image_url?: string;
  description: string;
  quantity: number;
  internal_code: string;
  sale_value: number;
}

export class ProductService {
  public static async registerProduct({
    image,
    description,
    category,
    quantity,
    provider,
    internal_code,
    barcode,
    pushase_value,
    porcent,
    sale_value,
  }: RegisterProduct): Promise<Product | undefined> {
    const formData = new FormData();

    formData.append('description', description);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('provider', provider);
    formData.append('internal_code', internal_code);
    formData.append('pushase_value', pushase_value);
    formData.append('porcent', porcent);
    formData.append('sale_value', sale_value);
    if (image) formData.append('image', image);
    if (barcode) formData.append('barcode', barcode);

    const response = await ApiService.post<Product>('products', formData);

    return response?.data;
  }

  public static async fetchCategoryProviders(searchCategoryProvider: string): Promise<{ name: string }[]> {
    const response = await ApiService.get<{ name: string }[]>('products/categories/search-provider', {
      params: {
        search: searchCategoryProvider,
      },
    });

    return response.data;
  }

  public static async fetchCategoryProducts(searchCategoryProduct: string): Promise<{ name: string }[]> {
    const response = await ApiService.get<{ name: string }[]>('products/categories/search-product', {
      params: {
        search: searchCategoryProduct,
      },
    });

    return response.data;
  }

  public static async findProductByInternalCode(internal_code: string): Promise<SearchProduct | undefined> {
    const response = await ApiService.get<SearchProduct>('products/find', {
      params: {
        internal_code,
      },
    });

    return response?.data;
  }

  public static async searchProducts(search: string): Promise<SearchProduct[]> {
    const response = await ApiService.get<SearchProduct[]>('products/search', {
      params: {
        search,
      },
    });

    return response?.data;
  }
}
