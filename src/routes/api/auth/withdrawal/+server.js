async function getResponse(accessToken) {
    const response = await fetch('http://222.251.154.231:8080/auth/withdrawal', {
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