export async function GET() {
    const response = await fetch('http://129.154.51.227:8083/wiki', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}