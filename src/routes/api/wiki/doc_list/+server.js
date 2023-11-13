export async function GET() {
    const response = await fetch('http://222.251.154.231:8082/wiki', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}