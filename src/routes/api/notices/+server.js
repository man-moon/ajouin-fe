import { json } from 'stream/consumers';

async function getResponse(notices) {
    const response = await fetch('http://ajou-community-env.eba-z2tgagdq.ap-northeast-2.elasticbeanstalk.com/notices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notices })
    });
    if (response.ok) {
        return response;
    } else {
        console.log("response error");
    }
}

export async function POST({ request }) {
    const { notices } = await request.json();

    const response = await getResponse(notices);
    return response;
}