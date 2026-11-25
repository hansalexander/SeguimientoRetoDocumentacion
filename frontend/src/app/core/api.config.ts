import { Capacitor } from '@capacitor/core';

const PUERTO = 8000;

const IP_TELEFONO_REAL = '';

export function urlApi(): string {
  if (Capacitor.getPlatform() === 'android') {
    return `http://${IP_TELEFONO_REAL || '10.0.2.2'}:${PUERTO}/api`;
  }

  return `http://127.0.0.1:${PUERTO}/api`;
}
