// instrumentation.ts (project root, same level as package.json)
// This function make connection to db when the web start a cold run (Boot for the first time)
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { dbConnection } = await import('@/Backend/lib/dbConnection');
    await dbConnection();
    }
}