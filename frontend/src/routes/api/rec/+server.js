import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const count = url.searchParams.get("count") || 10;
    let result = await fetch(`http://backend:4001/Movie/GetRecommendation/${count}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (result.ok) {
        result = await result.json();
        return json({ success: true, data: result });
    } else {
        result = await result.json();
        return json({ success: false, message: result.message });
    }
}
