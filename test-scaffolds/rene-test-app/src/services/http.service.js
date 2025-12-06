export default {
    name: 'http',

    async get(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`GET ${url} failed: ${res.status}`);
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
            throw new Error(`POST ${url} failed: ${res.status}`);
        }

        return await res.json();
    }
}