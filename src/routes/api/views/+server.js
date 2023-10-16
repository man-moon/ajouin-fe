export async function POST({ request }) {
    const { noticeId } = await request.json();

    const response = await fetch('http://localhost:8082/views', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeId)
    });

    return response;
}