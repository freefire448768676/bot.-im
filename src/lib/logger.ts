export const logger = {
  info: (msg: any) => console.log(``, msg),
  error: (msg: any) => console.error(`[ERROR]`, msg),
  warn: (msg: any) => console.warn(``, msg)
}
