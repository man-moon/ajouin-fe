import { main } from '$lib/server/generate-embeddings.ts'

export async function GET({ request }) {
    main().catch((err) => console.error(err))
    return new Response(
        JSON.stringify(
            { success: 'OK' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}