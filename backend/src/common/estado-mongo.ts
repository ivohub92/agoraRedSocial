
export const estadoMongo = { ultimoError: null as string | null };


export function ocultarCredenciales(texto: string): string {
  return texto.replace(/\/\/[^@\s/]+@/g, '//***:***@');
}
