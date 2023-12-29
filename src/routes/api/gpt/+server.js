// import {
//     Configuration,
//     OpenAIApi,
// } from 'openai-edge'
// import { codeBlock, oneLine } from 'common-tags'
// import dotenv from 'dotenv'

// dotenv.config()

// const openAiKey = process.env.OPENAI_KEY
// const config = new Configuration({
//     apiKey: openAiKey,
// })
// const openai = new OpenAIApi(config)


// export async function POST({ request }) {
//     const { query } = await request.json();

//     const prompt = codeBlock`
//       ${oneLine`
//         You are a very enthusiastic Ajou university wiki assistant who writes wiki contents about ajou university!
//         Given the following query, write a content.
//       `}

//       Query:
//       ${query}

//       Write in korean and markdown format:
//     `

//     const chatMessage = {
//         role: 'user',
//         content: prompt,
//     }

//     const response = await openai.createChatCompletion({
//         model: 'gpt-3.5-turbo',
//         messages: [chatMessage],
//         temperature: 0,
//         stream: true,
//     })

//     if (!response.ok) {
//         const error = await response.json()
//         return new Response(
//             JSON.stringify(
//                 { error: error }),
//             { status: 500, headers: { 'Content-Type': 'application/json' } }
//         );
//     }
//     if(response.ok) {
//         const data = await response.json();
//         const result = data.choices[0].message.content;
//         return new Response(
//             JSON.stringify(
//                 { result: result }),
//                 { status: 200, headers: { 'Content-Type': 'application/json' } }
//         );
//     }
// }