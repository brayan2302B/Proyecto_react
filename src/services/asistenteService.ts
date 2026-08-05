import api from './api';

// ── Tipos compartidos ─────────────────────────────────────────────────────────
export interface ChatMessage {
  rol: 'user' | 'assistant';
  contenido: string;
}

export interface ChatRequest {
  mensaje: string;
  historial?: ChatMessage[];
}

export interface ChatResponse {
  respuesta: string;
}

export interface ChatUploadResponse {
  respuesta: string;
  estado: 'validado' | 'devuelto' | 'pendiente';
  id_informe?: number;
}

// ── Chat de texto (sin archivos) ──────────────────────────────────────────────
/**
 * Envía un mensaje de texto al Asistente IA de STIMI.
 * Requiere que el usuario esté autenticado (token JWT en localStorage).
 */
export const enviarMensajeAsistente = async (
  mensaje: string,
  historial: ChatMessage[] = [],
): Promise<ChatResponse> => {
  const payload: ChatRequest = {
    mensaje,
    historial: historial.slice(-10),
  };
  const response = await api.post<ChatResponse>('/webhooks/chat', payload);
  return response.data;
};

// ── Chat con archivo PDF (validación de informe) ──────────────────────────────
/**
 * Sube un informe PDF al backend para que sea analizado por la IA.
 * Requiere que el usuario esté autenticado.
 *
 * @param archivo      - Objeto File del informe PDF seleccionado por el usuario
 * @param tipoInforme  - 'GC' o 'GF'
 * @param periodo      - Período en formato "Mes YYYY" (e.g. "Julio 2026")
 */
export const enviarArchivoInforme = async (
  archivo: File,
  tipoInforme: string,
  periodo: string,
): Promise<ChatUploadResponse> => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('tipo_informe', tipoInforme.toUpperCase());
  formData.append('periodo', periodo);

  const response = await api.post<ChatUploadResponse>(
    '/webhooks/chat/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Timeout extendido: OpenAI puede tardar hasta 60s en analizar un PDF grande
      timeout: 90000,
    },
  );
  return response.data;
};

export const asistenteService = {
  enviarMensajeAsistente,
  enviarArchivoInforme,
};
