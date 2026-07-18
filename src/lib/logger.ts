export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: any) => console.error(`[ERROR]`, msg)
}
