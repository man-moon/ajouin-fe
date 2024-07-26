export async function GET({ url }) {
    const title = url.searchParams.get('title');
    const response = await fetch(`http://localhost:8080/wiki/versions/${title}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}