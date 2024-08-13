async function getResponse(request) {
    const response = await fetch('http://129.154.51.227:8083/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    return response;
}

export async function POST({ request }) {
    const { email, password } = await request.json();
    console.timeLog()
    const response = await getResponse({ email, password });
    return response;
}