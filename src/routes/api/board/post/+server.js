export async function POST({ request }) {
    const { tag, title, content, isAnonymous } = await request.json();
    const accessToken = await request.headers.get('Authorization')

    const response = await fetch(`http://129.154.51.227:8083/board/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
        body: JSON.stringify({
            tagName: tag,
            title,
            content,
            isAnonymous,
        }),
    });
    return response;
}

export async function GET({ url, request }) {
    const id = url.searchParams.get('id');
    const accessToken = await request.headers.get('Authorization');

    const response = await fetch(`http://129.154.51.227:8083/board/post/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return response;
}

export async function DELETE({ url, request }) {
    const postId = url.searchParams.get('id');
    const accessToken = await request.headers.get('Authorization');

    const response = await fetch(`http://129.154.51.227:8083/board/post/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return response;
}