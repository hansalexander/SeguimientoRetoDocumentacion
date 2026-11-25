import { TareaSemanal } from './modelos';

export type Semaforo =
  'PENDIENTE' | 'ABIERTA' | 'VERDE' | 'AMARILLO' | 'ROJO';

// Reglas del seguimiento
export const UMBRAL_ROJO = 10;
export const META = 100;
export const DIAS_AVISO_RIESGO = 2;

export const ETIQUETA_SEMAFORO: Record<Semaforo, string> = {
  PENDIENTE: 'Por iniciar',
  ABIERTA: 'En curso',
  VERDE: 'Cumplida',
  AMARILLO: 'Incompleta',
  ROJO: 'No cumplida',
};

export const COLOR_SEMAFORO: Record<Semaforo, string> = {
  PENDIENTE: 'medium',
  ABIERTA: 'primary',
  VERDE: 'success',
  AMARILLO: 'warning',
  ROJO: 'danger',
};

export interface SemanaEvaluada extends TareaSemanal {
  semaforo: Semaforo;
  cerrada: boolean;
  editable: boolean;
  diasRestantes: number;
  enRiesgo: boolean;
}

export interface ResumenReto {
  ROJO: number;
  AMARILLO: number;
  VERDE: number;
  ABIERTA: number;
  PENDIENTE: number;
}

export function hoyIso(fecha = new Date()): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export function diasEntre(desde: string, hasta: string): number {
  const aUtc = (iso: string) => {
    const [anio, mes, dia] = iso.split('-').map(Number);
    return Date.UTC(anio, mes - 1, dia);
  };

  return Math.round(
    (aUtc(hasta) - aUtc(desde)) / 86_400_000
  );
}

export function fechaCorta(iso: string | null): string {
  if (!iso) {
    return '—';
  }

  const [, mes, dia] = iso.split('-');

  return `${dia}/${mes}`;
}

export function calcularSemaforo(
  porcentaje: number,
  fechaInicio: string,
  fechaFin: string,
  hoy: string,
): Semaforo {

  if (hoy < fechaInicio) {
    return 'PENDIENTE';
  }

  if (hoy <= fechaFin) {
    return 'ABIERTA';
  }

  if (porcentaje >= META) {
    return 'VERDE';
  }

  if (porcentaje < UMBRAL_ROJO) {
    return 'ROJO';
  }

  return 'AMARILLO';
}

export function evaluarSemana(
  tarea: TareaSemanal,
  hoy: string
): SemanaEvaluada {

  const semaforo = calcularSemaforo(
    tarea.porcentaje,
    tarea.fecha_inicio,
    tarea.fecha_fin,
    hoy
  );

  const diasRestantes = Math.max(
    diasEntre(hoy, tarea.fecha_fin),
    0
  );

  return {
    ...tarea,
    semaforo,
    cerrada: hoy > tarea.fecha_fin,
    editable: semaforo === 'ABIERTA',
    diasRestantes,
    enRiesgo:
      semaforo === 'ABIERTA' &&
      tarea.porcentaje < UMBRAL_ROJO &&
      diasRestantes <= DIAS_AVISO_RIESGO,
  };
}

export function resumirPorReto(
  semanas: SemanaEvaluada[]
): Map<number, ResumenReto> {

  const resumen = new Map<number, ResumenReto>();

  for (const semana of semanas) {
    const actual = resumen.get(semana.reto) ?? {
      ROJO: 0,
      AMARILLO: 0,
      VERDE: 0,
      ABIERTA: 0,
      PENDIENTE: 0,
    };

    actual[semana.semaforo]++;
    resumen.set(semana.reto, actual);
  }

  return resumen;
}
