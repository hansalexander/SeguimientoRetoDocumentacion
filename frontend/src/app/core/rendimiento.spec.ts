
import { calcularRendimiento } from './rendimiento';
import { Reto, TareaSemanal } from './modelos';
import { evaluarSemana } from './semaforo';

describe('Dashboard de rendimiento', () => {

  const reto: Reto = {
    id: 1,
    titulo: 'Aprender programación',
    descripcion: 'Mejorar mis conocimientos',
    fecha_inicio: '2026-11-16',
    fecha_fin: null,
    estado: 'EN_CURSO',
    total_avances: 0,
    creado: '',
    actualizado: ''
  };

  const reto2: Reto = {
    ...reto,
    id: 2,
    titulo: 'Aprender inglés'
  };

  function crearSemana(
    id: number,
    retoId: number,
    semana: number,
    porcentaje: number,
    inicio: string,
    fin: string
  ) {
    const tarea: TareaSemanal = {
      id: id,
      reto: retoId,
      reto_titulo: 'Reto de prueba',
      semana: semana,
      fecha_inicio: inicio,
      fecha_fin: fin,
      descripcion: 'Meta semanal',
      porcentaje: porcentaje,
      actualizado: ''
    };

    return evaluarSemana(tarea, '2026-11-25');
  }

  const semana7 = crearSemana(
    1, 1, 7, 100,
    '2026-11-16', '2026-11-22'
  );

  const semana8 = crearSemana(
    2, 1, 8, 50,
    '2026-11-23', '2026-11-29'
  );

  const semana9 = crearSemana(
    3, 1, 9, 0,
    '2026-11-30', '2026-12-06'
  );

  it('calcula el total de retos', () => {

    const resultado = calcularRendimiento(
      [reto, reto2], []
    );

    expect(resultado.totalRetos).toBe(2);
    expect(resultado.retosEnCurso).toBe(2);
  });

  it('calcula correctamente el promedio', () => {

    const resultado = calcularRendimiento(
      [reto], [semana7, semana8]
    );

    expect(resultado.promedio).toBe(75);
  });

  it('no incluye semanas futuras en el promedio', () => {

    const resultado = calcularRendimiento(
      [reto], [semana7, semana8, semana9]
    );

    expect(resultado.promedio).toBe(75);
    expect(resultado.totalSemanas).toBe(3);
  });

  it('calcula el cumplimiento de semanas cerradas', () => {

    const resultado = calcularRendimiento(
      [reto], [semana7, semana8]
    );

    expect(resultado.cumplimiento).toBe(100);
    expect(resultado.verdes).toBe(1);
    expect(resultado.totalCerradas).toBe(1);
  });

  it('filtra las estadisticas por reto', () => {

    const otraSemana = crearSemana(
      4, 2, 8, 20,
      '2026-11-23', '2026-11-29'
    );

    const resultado = calcularRendimiento(
      [reto, reto2],
      [semana8, otraSemana],
      2
    );

    expect(resultado.totalRetos).toBe(1);
    expect(resultado.promedio).toBe(20);
  });

  it('maneja correctamente la ausencia de datos', () => {

    const resultado = calcularRendimiento([], []);

    expect(resultado.totalRetos).toBe(0);
    expect(resultado.promedio).toBeNull();
    expect(resultado.cumplimiento).toBeNull();
    expect(resultado.evolucion.length).toBe(0);
  });

  it('detecta semanas incumplidas', () => {

    const semanaRoja = crearSemana(
      5, 1, 7, 5,
      '2026-11-16', '2026-11-22'
    );

    const resultado = calcularRendimiento(
      [reto], [semanaRoja]
    );

    expect(resultado.rojas).toBe(1);
    expect(resultado.cumplimiento).toBe(0);
    expect(resultado.recomendacion).toContain(
      'semanas incumplidas'
    );
  });

  it('genera recomendaciones de buen rendimiento', () => {

    const resultado = calcularRendimiento(
      [reto], [semana7]
    );

    expect(resultado.recomendacion).toContain(
      'buen rendimiento'
    );
  });

});
