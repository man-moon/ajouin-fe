export async function GET({ url }) {
    const title = url.searchParams.get('title');
    const response = await fetch(`http://129.154.51.227:8083/wiki/versions/${title}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}