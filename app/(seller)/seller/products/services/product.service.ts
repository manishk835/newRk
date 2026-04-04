import { apiFetch } from "@/lib/api/client";

export const getProducts = async () => {
    return apiFetch("/product/my");
};
export const getMyProducts = async () => {
    return apiFetch("/product/my");
};

export const getProductById = async (id: string) => {
    return apiFetch(`/product/${id}`);
};

export const updateProduct = async (id: string, data: any) => {
    return apiFetch(`/product/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

export const deleteProductById = async (id: string) => {
    return apiFetch(`/product/${id}`, {
        method: "DELETE",
    });
};