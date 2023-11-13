// import fs from 'fs';
// import path from 'path';

// export async function POST({ request }) {
//     const { head, content } = await request.json();

//     const filePath = path.join(process.cwd(), `src/routes/docs/${head}.mdx`);

//     fs.writeFile(filePath, content, (err) => {
//         if (err) {
//             console.log(err);
//         }
//     })

//     return new Response(
//         JSON.stringify(
//             { success: 'OK' }),
//         { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
// }
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
    console.log(doc, ver);

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