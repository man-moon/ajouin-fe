export async function POST({ request, url }) {

    const id = url.searchParams.get('id');
    const { parent, content, isAnonymous } = await request.json();
    const accessToken = await request.headers.get('Authorization');

    const response = await fetch(`http://222.251.154.231:8082/board/post/${id}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
        body: JSON.stringify({
            parent,
            content,
            isAnonymous,
        }),
    });
    return response;
}

export async function DELETE({ url, request }) {
    const commentId = url.searchParams.get('id');
    const accessToken = await request.headers.get('Authorization');

    const response = await fetch(`http://222.251.154.231:8082/board/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
    });
    return response;
}