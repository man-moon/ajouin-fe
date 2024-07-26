export async function POST({ request }) {
    const { name, description } = await request.json();
    const accessToken = await request.headers.get('Authorization');

    const response = await fetch('http://localhost:8080/wiki/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
        body: JSON.stringify({name, description})
    });

    return response;
}

export async function GET() {
    const response = await fetch('http://localhost:8080/wiki/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}