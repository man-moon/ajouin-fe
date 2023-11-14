import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3NodeTokenizer from 'gpt3-tokenizer'
import {
  Configuration,
  OpenAIApi,
} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import dotenv from 'dotenv'

dotenv.config()

const openAiKey = process.env.OPENAI_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const config = new Configuration({
  apiKey: openAiKey,
})
const openai = new OpenAIApi(config)

// export const runtime = 'edge'

export async function POST({ request }) {
  try {
    if (!openAiKey || !supabaseUrl || !supabaseServiceKey) {
      console.log("환경변수 오류");
      return new Response(
        JSON.stringify(
          { error: 'Bad Request' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let query = await request.json()
    query = query.messages[query.messages.length - 1].content

    if (!query) {
      console.log("쿼리 오류");
      return new Response(
        JSON.stringify(
          { error: 'Bad Request' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim()
    const moderationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json())

    const [results] = moderationResponse.results

    if (results.flagged) {
      return new Response(
        JSON.stringify(
          { error: 'Bad Request' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create embedding from query
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: sanitizedQuery.replaceAll('\n', ' '),
    })

    if (embeddingResponse.status !== 200) {
      console.log("임베딩 오류");
      return new Response(
        JSON.stringify(
          { error: 'Bad Request' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      data: [{ embedding }],
    } = await embeddingResponse.json()

    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      'match_page_sections',
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
      }
    )

    if (matchError) {
      console.log("페이지 섹션 오류");
      return new Response(
        JSON.stringify(
          { error: 'Bad Request' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tokenizer = new GPT3NodeTokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i]
      const content = pageSection.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      if (tokenCount >= 1500) {
        break
      }

      contextText += `${content.trim()}\n---\n`
    }

    const prompt = codeBlock`
      ${oneLine`
        You are a very enthusiastic Ajou university chat bot who loves
        to help people! Given the following sections from the ajou univ's
        wiki data, answer the question using only that information. If you are unsure and the answer
        is not explicitly written in the documentation, say
        "관련 정보를 찾을 수 없었어요. 죄송해요."
      `}

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """

      Answer in korean:
    `

    const chatMessage = {
      role: 'user',
      content: prompt,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(
        JSON.stringify(
          { error: 'openai로부터 응답을 만들어내는 과정에서 오류 발생' }), 
          { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (err) {
      console.error(err)
      return new Response(
        JSON.stringify({
          error: '모종의 오류',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
  }
}
