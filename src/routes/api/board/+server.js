// export async function POST({ request }) {
//     const { noticeId } = await request.json();
//     const accessToken = await request.headers.get('Authorization')

//     const response = await getResponse(noticeId, accessToken);
//     return response;
// }

export async function GET({ url }) {
    const page = url.searchParams.get('page');
    const tag = url.searchParams.get('tag');
    let response;
    if(tag == '전체글') {
        response = await fetch(`http://222.251.154.231:8082/board?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        response = await fetch(`http://222.251.154.231:8082/board/post?tag=${tag}&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return response;
}