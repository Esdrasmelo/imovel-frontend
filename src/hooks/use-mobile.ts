import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const CONSULTA_MOBILE = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function assinar(notificar: () => void): () => void {
  const consulta = window.matchMedia(CONSULTA_MOBILE);
  consulta.addEventListener("change", notificar);
  return () => consulta.removeEventListener("change", notificar);
}

function lerNoNavegador(): boolean {
  return window.matchMedia(CONSULTA_MOBILE).matches;
}

function lerNoServidor(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(assinar, lerNoNavegador, lerNoServidor);
}
