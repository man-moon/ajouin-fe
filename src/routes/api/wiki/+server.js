export async function POST({ request }) {
    const { categoryName, title, content } = await request.json();
    const accessToken = await request.headers.get('Authorization')

    const response = await fetch('http://222.251.154.231:8082/wiki', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        },
        body: JSON.stringify({ categoryName, title, content })
    });

    return response;
}


export async function GET({ url }) {
    const doc = url.searchParams.get('doc');
    const ver = url.searchParams.get('ver');

    if(ver) {
        const response = await fetch(`http://222.251.154.231:8082/wiki/document?doc=${doc}&ver=${ver}`);
        return response;
    } else {
        const response = await fetch(`http://222.251.154.231:8082/wiki/document?doc=${doc}`);
        return response;
    }
}

export async function PATCH({ request }) {
    const { title, content } = await request.json();
    const accessToken = await request.headers.get('Authorization')

    const response = await fetch('http://222.251.154.231:8082/wiki', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        },
        body: JSON.stringify({ title, content })
    });

    return response;
}