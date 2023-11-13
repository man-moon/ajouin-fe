export async function GET({ url }) {
    const category = url.searchParams.get('category');
    const response = await fetch(`http://222.251.154.231:8082/wiki/category/${category}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}