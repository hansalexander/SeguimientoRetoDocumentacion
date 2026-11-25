
# Funcionalidad adicional: Dashboard de rendimiento

## 1. Introducción

Como funcionalidad adicional para la aplicación Seguimiento de Retos,
se desarrolló un dashboard de rendimiento que permite visualizar
las estadísticas y el progreso de los retos registrados por el estudiante.

Esta funcionalidad complementa las opciones existentes de seguimiento
semanal, semáforo y alertas.

## 2. Objetivo

Facilitar el seguimiento de los retos mediante una pantalla que muestre
información estadística, gráficos y recomendaciones automáticas,
permitiendo al estudiante conocer su rendimiento y mejorar
la planificación de sus actividades.

## 3. Funcionalidades implementadas

- Visualización del total de retos.
- Cantidad de retos en curso y completados.
- Cálculo del promedio de avance.
- Porcentaje de cumplimiento de semanas cerradas.
- Gráfico de evolución semanal.
- Distribución de semanas cumplidas, incompletas e incumplidas.
- Cantidad de semanas en riesgo.
- Filtro de estadísticas por reto.
- Recomendaciones automáticas según el rendimiento.
- Actualización reactiva de la información.

## 4. Funcionamiento

El dashboard obtiene los datos desde la API REST de Django,
que se conecta a la base de datos MySQL.

Se utilizan los servicios existentes de Angular y RxJS
para recibir los datos de los retos y las tareas semanales.

La función calcularRendimiento procesa esta información
y devuelve las estadísticas que se muestran en la interfaz.

El promedio se calcula utilizando las semanas que ya iniciaron,
sin incluir las semanas futuras.

El porcentaje de cumplimiento se obtiene dividiendo las semanas
cumplidas entre el total de semanas cerradas y multiplicando por 100.

Cuando no existen datos suficientes, la aplicación muestra
el mensaje "Sin datos".

## 5. Tecnologías utilizadas

- Angular
- Ionic
- TypeScript
- RxJS
- HTML
- CSS
- Django REST Framework
- MySQL
- Capacitor
- Android Studio

## 6. Archivos creados

### rendimiento.ts

Contiene las funciones que calculan las estadísticas,
los porcentajes y las recomendaciones.

### rendimiento.spec.ts

Contiene las pruebas unitarias que permiten comprobar
el funcionamiento de los cálculos estadísticos.

### dashboard.page.ts

Contiene la interfaz gráfica del dashboard,
las tarjetas, los gráficos, el filtro de retos
y la conexión con los servicios reactivos.

## 7. Archivos modificados

### app.routes.ts

Se agregó la ruta /dashboard para acceder a la nueva pantalla.

### retos-lista.page.ts

Se agregó un botón de estadísticas en la pantalla principal
para ingresar al dashboard.

## 8. Programación reactiva

Se utilizaron los operadores combineLatest y map de RxJS
para combinar los datos de los retos, las semanas y el filtro
seleccionado por el usuario.

También se utilizó BehaviorSubject para almacenar el reto seleccionado.

Esto permite que las estadísticas se actualicen cuando cambian
los datos recibidos o cuando el usuario selecciona otro reto.

## 9. Pruebas

Se diseñaron ocho pruebas unitarias adicionales para comprobar:

1. El total de retos.
2. El promedio de avance.
3. La exclusión de semanas futuras.
4. El porcentaje de cumplimiento.
5. El filtro por reto.
6. La ausencia de datos.
7. Las semanas incumplidas.
8. Las recomendaciones automáticas.

## 10. Evidencias

### Dashboard en la aplicación web

![Dashboard web](Documentacion/evidencias-dashboard/dashboard-web.png)

### Dashboard en Android

![Dashboard Android](Documentacion/evidencias-dashboard/dashboard-android.png)

### Gráfico de evolución semanal

![Grafico](Documentacion/evidencias-dashboard/dashboard-grafico.png)

### Filtro por reto

![Filtro](Documentacion/evidencias-dashboard/dashboard-filtro.png)

### Pruebas unitarias

![Pruebas](Documentacion/evidencias-dashboard/pruebas-unitarias.png)

## 11. Conclusión

La implementación del dashboard permite mejorar la aplicación
Seguimiento de Retos mediante estadísticas que ayudan al estudiante
a conocer su rendimiento y tomar mejores decisiones.

La funcionalidad utiliza los datos reales del sistema
y funciona tanto en el navegador web como en Android.

Además, se aplicaron los conocimientos de programación reactiva,
desarrollo frontend y consumo de servicios REST.
