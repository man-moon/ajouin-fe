async function getResponse(noticeId, accessToken) {
    const response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/bookmark', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
        body: JSON.stringify(noticeId)
    });
    return response;
}

export async function POST({ request }) {
    const { noticeId } = await request.json();
    const accessToken = await request.headers.get('Authorization')

    const response = await getResponse(noticeId, accessToken);
    return response;
}

export async function GET({ request }) {
    const accessToken = await request.headers.get('Authorization');
    const response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/bookmark', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
    });
    return response;
}