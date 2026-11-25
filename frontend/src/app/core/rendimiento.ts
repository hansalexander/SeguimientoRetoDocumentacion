
import { Reto } from './modelos';
import { SemanaEvaluada } from './semaforo';

export function calcularRendimiento(
  retos: Reto[],
  semanas: SemanaEvaluada[],
  retoId: number = 0
) {
  const retosFiltrados = retos.filter(
    r => retoId === 0 || r.id === retoId
  );

  const tareas = semanas.filter(
    s => retosFiltrados.some(r => r.id === s.reto)
  );

  const iniciadas = tareas.filter(
    s => s.semaforo !== 'PENDIENTE'
  );

  const cerradas = tareas.filter(s => s.cerrada);

  const verdes = cerradas.filter(
    s => s.semaforo === 'VERDE'
  ).length;

  const amarillas = cerradas.filter(
    s => s.semaforo === 'AMARILLO'
  ).length;

  const rojas = cerradas.filter(
    s => s.semaforo === 'ROJO'
  ).length;

  const riesgo = tareas.filter(s => s.enRiesgo).length;

  const totalRetos = retosFiltrados.length;

  const retosEnCurso = retosFiltrados.filter(
    r => r.estado === 'EN_CURSO'
  ).length;

  const retosCompletados = retosFiltrados.filter(
    r => r.estado === 'COMPLETADO'
  ).length;

  const promedio = iniciadas.length > 0
    ? Math.round(
        iniciadas.reduce(
          (total, s) => total + s.porcentaje, 0
        ) / iniciadas.length
      )
    : null;

  const cumplimiento = cerradas.length > 0
    ? Math.round(verdes / cerradas.length * 100)
    : null;

  const evolucion: {
    semana: number;
    promedio: number;
  }[] = [];

  for (let numero = 7; numero <= 15; numero++) {
    const grupo = iniciadas.filter(
      s => s.semana === numero
    );

    if (grupo.length > 0) {
      const promedioSemanal = Math.round(
        grupo.reduce(
          (total, s) => total + s.porcentaje, 0
        ) / grupo.length
      );

      evolucion.push({
        semana: numero,
        promedio: promedioSemanal
      });
    }
  }

  let recomendacion = '';

  if (totalRetos === 0) {
    recomendacion =
      'Crea tu primer reto para comenzar a medir tu rendimiento.';
  } else if (iniciadas.length === 0) {
    recomendacion =
      'Todavía no tienes semanas iniciadas.';
  } else if (riesgo > 0) {
    recomendacion =
      'Prioriza las semanas en riesgo antes de que se cierren.';
  } else if (rojas > 0) {
    recomendacion =
      'Tienes semanas incumplidas. Mejora tu planificación en las próximas semanas.';
  } else if (promedio !== null && promedio >= 80) {
    recomendacion =
      'Tienes un buen rendimiento. Mantén tu constancia.';
  } else if (promedio !== null && promedio >= 50) {
    recomendacion =
      'Vas por buen camino, pero puedes mejorar tus avances.';
  } else {
    recomendacion =
      'Dedica más tiempo a tus retos y establece metas diarias.';
  }

  return {
    totalRetos,
    retosEnCurso,
    retosCompletados,
    totalSemanas: tareas.length,
    totalCerradas: cerradas.length,
    promedio,
    cumplimiento,
    verdes,
    amarillas,
    rojas,
    riesgo,
    evolucion,
    recomendacion
  };
}
