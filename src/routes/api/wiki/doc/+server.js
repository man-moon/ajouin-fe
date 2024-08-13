export async function GET({ url }) {
    const category = url.searchParams.get('category');
    const response = await fetch(`http://129.154.51.227:8083/wiki/category/${category}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}