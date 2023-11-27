export async function GET({ url }) {
    const title = url.searchParams.get('title');
    const response = await fetch(`http://222.251.154.231:8082/wiki/versions/${title}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}