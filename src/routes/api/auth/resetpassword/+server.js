async function getResponse(request) {
    const response = await fetch('http://localhost:8080/auth/resetpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    return response;
}

export async function POST({ request }) {
    const { id, email, password } = await request.json();
    const response = await getResponse({ id, email, password });
    return response;
}