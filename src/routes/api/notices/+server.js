async function getResponse(notices, accessToken) {
    let response;
    if(accessToken == '') {
        response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/notices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notices })
        });
    } else {
        response = await fetch('http://Ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/notices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
            body: JSON.stringify({ notices })
        });
    }
    return response;
}

export async function POST({ request }) {
    const { notices } = await request.json();
    const accessToken = await request.headers.get('Authorization');

    return await getResponse(notices, accessToken);
}