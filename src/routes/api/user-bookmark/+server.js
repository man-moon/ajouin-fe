export const POST = async (event) => {

    const requestBody = await event.request.json();
    const body = requestBody.bookmark;
    
    const response = await fetch(`${process.env.NOTICE_SERVICE_URL}/api/notice/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}