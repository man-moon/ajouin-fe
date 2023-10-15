export async function POST({ request }) {
    const { classification, content } = await request.json();
    const accessToken = await request.headers.get('Authorization')

    const response = await fetch('http://222.251.154.231:8080/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
        body: JSON.stringify({ classification, content })
    });

    return response;
}