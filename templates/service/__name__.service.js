export default {
    name: '__name__',
    inject: [],

    state: () => ({

    }),

    onInit(ctx) {
        // called once when service is first created
    },

    async get(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`[__name__] GET ${url} failed: ${res.status}`);
        }

        return await res.json();
    },

    async post(url, body) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`[__name__] POST ${url} failed: ${res.status}`);
        }

        return await res.json();
    }
}