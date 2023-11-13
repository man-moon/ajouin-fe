import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'

export async function POST({ request }) {
    const { html } = await request.json();

    console.log(html);

    const md = NodeHtmlMarkdown.translate(html);

    console.log(md);

    return new Response(
        JSON.stringify(
            { result: md }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}