// export const load = async (event) => {
//   const session = await event.locals.auth();
//   if (!session?.user) {
//     // 사용자가 인증되지 않은 경우 처리
//     console.log("인증안됨")
//     return { error: '인증되지 않은 사용자' };
//   } else{
//     console.log("인증된 유저");
//     console.log(session.user);
//   }
//   // 세션 데이터를 사용하여 API 요청 처리
//   return {
//     session: session
//   };
// };



export const GET = async (event) => {
    const session = await event.locals.auth()
   
    if (!session?.user) {
        console.log("로그인 정보 없음");
      return new Response(null, { status: 401, statusText: "Unauthorized" })
    } else {
    
        console.log("인증된 유저");
        console.log(session.user);
        return new Response(null, { status: 200});
    }
  }
  