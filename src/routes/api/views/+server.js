export async function POST({ request }) {
    const { noticeId } = await request.json();

    const response = await fetch('http://222.251.154.231:8082/views', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeId)
    });

    return response;
}