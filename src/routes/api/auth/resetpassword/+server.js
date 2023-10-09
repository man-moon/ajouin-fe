async function getResponse(request) {
    const response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/auth/resetpassword', {
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