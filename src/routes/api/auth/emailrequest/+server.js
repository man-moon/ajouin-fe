async function getResponse(request) {
    const response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/auth/email/request', {
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