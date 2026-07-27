import { apiFetchServer } from '@/services/api.server';
import { apiClientFetch } from '@/services/api.client';

const API_URL = import.meta.env.PUBLIC_API_URL;

interface BlogApiResponse {
    success: boolean;
    message: string;
    data: {
        current_page: number;
        data: any[];
        total: number;
        per_page: number;
    };
}

export async function list(request?: Request) {
  
    if (import.meta.env.SSR) {
        const json = await apiFetchServer('/blog', {}, request) as BlogApiResponse;
        return json.data.data;
    }

    const json = await apiClientFetch('/blog') as BlogApiResponse;
    return json.data.data;
}

export async function getBySlug(slug: string,
  request?: Request) {
    if (import.meta.env.SSR) {
        const json = await apiFetchServer(`/post/${slug}`, {},request);
        return json.data;
    }
    const json = await apiClientFetch(`/post/${slug}`);
    return json.data;
}