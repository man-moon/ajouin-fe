import dotenv from 'dotenv';
dotenv.config();

export const GET = async ({ params }) => {

    const response = await fetch(`${process.env.NOTICE_SERVICE_URL}/api/notice/${params.id}`, {
        method: 'GET',
    });

    const data = await response.json();

    return new Response(JSON.stringify(data));
}