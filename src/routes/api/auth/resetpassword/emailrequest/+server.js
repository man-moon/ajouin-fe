async function getResponse(request) {
    const response = await fetch('http://129.154.51.227:8083/auth/email/resetpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: request })
    });
    return response;
}

export async function POST({ request }) {
    const { emailRequest } = await request.json();
    const response = await getResponse(emailRequest);
    return response;
}