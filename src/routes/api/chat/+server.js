// export async function POST({ request }) {
//     const { context, temperature } = await request.json();
//     const response = await fetch('http://35.223.206.75:7860/generate', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ context, temperature })
//     });
//     return response;
// }