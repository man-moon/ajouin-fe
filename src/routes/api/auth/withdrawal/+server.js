async function getResponse(accessToken) {
    const response = await fetch('http://129.154.51.227:8083/auth/withdrawal', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
        });
    return response;
}

export async function DELETE({ request }) {
    const accessToken = await request.headers.get('Authorization');
    const response = await getResponse(accessToken);
    return response;
}