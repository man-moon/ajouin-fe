export const load = async (events) => {
    const session = await events.locals.auth()
    
    return {
        session,
    }
}