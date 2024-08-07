import * as jose from "jose"

export async function authFetch(input: string | URL | globalThis.Request, init: RequestInit): Promise<Response> {
    let access_token = localStorage.getItem('access_token')!;

    if (access_token && isTokenExpired(access_token)) {
        if ((await refreshToken()).ok) {
            access_token = localStorage.getItem('access_token')!;
        } else {
            throw new Error('Failed to refresh token');
        }
    }

    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${access_token}`);
    init.headers = headers;
    return fetch(input, init);
}

export async function login(username: FormDataEntryValue, password: FormDataEntryValue): Promise<Response> {
    const response = await fetch(`//${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const { access_token, refresh_token } = await response.json()
        access_token && localStorage.setItem('access_token', access_token)
        refresh_token && localStorage.setItem('refresh_token', refresh_token)
    } else {
        // Handle errors
    }
    return response
}

export async function refreshToken(): Promise<Response> {
    const refresh_token = localStorage.getItem('refresh_token')!;
    const response = await fetch(`//${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-tokens`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${refresh_token}` },
    });

    if (response.ok) {
        const { access_token, refresh_token } = await response.json()
        access_token && localStorage.setItem('access_token', access_token)
        refresh_token && localStorage.setItem('refresh_token', refresh_token)
    } else {
        // Handle errors
    }
    return response
}

export function isTokenExpired(token: string): boolean {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        const payload = jose.decodeJwt(token);

        if (payload.exp && payload.exp < currentTime) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token verification failed:', error);
        return true;
    }
}
