export async function GET() {
    const response = await fetch('http://localhost:8080/wiki', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}