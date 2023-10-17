async function getResponse(notices, accessToken) {
    let response;
    if(accessToken == '') {
        response = await fetch('http://222.251.154.231:8082/notices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notices })
        });
    } else {
        response = await fetch('http://222.251.154.231:8082/notices', {
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

export async function GET({ url }) {
    const type = url.searchParams.get('type');
    const offset = url.searchParams.get('offset');
    const response = await fetch(`http://222.251.154.231:8082/notices?type=${type}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
}