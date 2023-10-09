async function getResponse(request) {
    const response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/auth/email/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    return response;
}

export async function POST({ request }) {
    const { id, code } = await request.json();
    const response = await getResponse({ id, code });
    return response;
}