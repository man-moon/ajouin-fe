import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'

export async function POST({ request }) {
    const { html } = await request.json();
    let md = NodeHtmlMarkdown.translate(html);
    //md내의 #을 모두 제거
    md = md.replace(/#/g, '');

    return new Response(
        JSON.stringify(
            { result: md }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}