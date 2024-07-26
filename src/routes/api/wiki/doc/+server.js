export async function GET({ url }) {
    const category = url.searchParams.get('category');
    const response = await fetch(`http://localhost:8080/wiki/category/${category}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}