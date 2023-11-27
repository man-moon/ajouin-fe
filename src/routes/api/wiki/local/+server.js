import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
    const { title, content } = await request.json();

    const filePath = path.join(process.cwd(), `src/routes/docs/${title}.mdx`);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.log(err);
        }
    })

    return new Response(
        JSON.stringify(
            { success: 'OK' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}