import dotenv from 'dotenv';
dotenv.config();

async function getResponse(types, email, offset, limit, includeTopFixed) {
    const url = new URL(`${process.env.NOTICE_SERVICE_URL}/api/notice`);

    types.forEach(type => url.searchParams.append('types', type));
    url.searchParams.append('offset', offset);
    url.searchParams.append('limit', limit);
    url.searchParams.append('includeTopFixed', includeTopFixed);

    const headers = {
        'Content-Type': 'application/json'
    };

    if (email) {
        headers['User-Email'] = email;
    }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
    });

    return response;
}

export const GET = async (event) => {
    const session = await event.locals.auth();
    
    let email = null;
    if (session?.user) {
        email = session.user.email;
    }

    const includeTopFixed = event.url.searchParams.get('includeTopFixed');
    const types = event.url.searchParams.getAll('types');
    let offset = event.url.searchParams.get('offset') || 0;
    const limit = 20;
    
    const response = await getResponse(types, email, offset, limit, includeTopFixed);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}