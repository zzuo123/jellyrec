import { json } from '@sveltejs/kit';

export async function GET() {
    let result = await fetch("http://backend:4001/Movie/GetFavorite", {
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
        return json({ success: false, message: result.message});
    }
}

