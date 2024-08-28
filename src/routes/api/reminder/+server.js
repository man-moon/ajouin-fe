
export const POST = async (event) => {
    const session = await event.locals.auth();
    
    let email = null;
    if (session?.user) {
        email = session.user.email;
    } else {
        return new Response(null, {
            status: 401
        });
    }

    const headers = {
        'Content-Type': 'application/json',
        'User-Email': email
    };
    
    const requestBody = await event.request.json();

    const remindAtDate = new Date(requestBody.remindAt);
    const remindAtKST = new Date(remindAtDate.getTime() + (9 * 60 * 60 * 1000));
    const remindAt = remindAtKST.toISOString().slice(0, 16);; 

    const body = {
        noticeId: requestBody.noticeId,
        remindAt: remindAt,
    }

    const response = await fetch(`${process.env.MEMBER_SERVICE_URL}/api/reminder`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
            
    });
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export const GET = async (event) => {
    const session = await event.locals.auth();
    
    let email = session.user.email;

    const headers = {
        'Content-Type': 'application/json',
        'User-Email': email
    };
    
    const response = await fetch(`${process.env.MEMBER_SERVICE_URL}/api/reminder`, {
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