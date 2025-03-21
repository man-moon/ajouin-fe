export const POST = async (event) => {
    const session = await event.locals.auth();

    let email = '';
    if (session?.user) {
        email = session.user.email;
    } else {
        return new Response(null, {
            status: 401
        });
    }

    const noticeId = event.url.searchParams.get('noticeId');

    const headers = {
        'Content-Type': 'application/json',
        'User-Email': email
    };
    
    const response = await fetch(`${process.env.MEMBER_SERVICE_URL}/api/bookmark?noticeId=${noticeId}`, {
        method: 'POST',
        headers: headers,
    });

    return new Response();
}

export const GET = async (event) => {
    const session = await event.locals.auth();

    let email = session.user.email;

    const headers = {
        'Content-Type': 'application/json',
        'User-Email': email
    };
    
    const response = await fetch(`${process.env.MEMBER_SERVICE_URL}/api/bookmark`, {
        method: 'GET',
        headers: headers,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DELETE = async (event) => {
    const session = await event.locals.auth();
    const noticeId = event.url.searchParams.get('noticeId');
    
    let email = session.user.email;

    const headers = {
        'Content-Type': 'application/json',
        'User-Email': email
    };
    
    const response = await fetch(`${process.env.MEMBER_SERVICE_URL}/api/reminder?noticeId=${noticeId}`, {
        method: 'DELETE',
        headers: headers,
    });

    return new Response();
}