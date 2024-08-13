export async function POST({ request }) {
    const { noticeId } = await request.json();

    const response = await fetch('http://129.154.51.227:8083/views', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeId)
    });

    return response;
}