
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonProgressBar
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBack,
  refresh,
  clipboardOutline,
  timeOutline,
  trendingUpOutline,
  checkmarkCircleOutline,
  bulbOutline,
  statsChartOutline,
  trophyOutline
} from 'ionicons/icons';

import {
  BehaviorSubject,
  combineLatest,
  map
} from 'rxjs';

import { SeguimientoService } from '../core/seguimiento.service';
import { calcularRendimiento } from '../core/rendimiento';

@Component({
  selector: 'app-dashboard',

  imports: [
    AsyncPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    IonProgressBar
  ],

  template: `
    <ion-header>
      <ion-toolbar color="primary">

        <ion-buttons slot="start">
          <ion-button routerLink="/retos"
                      aria-label="Volver a retos">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>Mi rendimiento</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="actualizar()"
                      aria-label="Actualizar estadísticas">
            <ion-icon name="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>

      </ion-toolbar>
    </ion-header>

    <ion-content>

      <main class="contenedor">

        <section class="bienvenida">
          <ion-icon name="stats-chart-outline"></ion-icon>
          <h1>Dashboard de rendimiento</h1>
          <p>
            Analiza tus avances y mejora el cumplimiento
            de tus metas semanales.
          </p>
        </section>

        @if (error$ | async; as error) {
          <p class="error">{{ error }}</p>
          <ion-button expand="block" (click)="actualizar()">
            Reintentar
          </ion-button>
        } @else {

          <ion-card>
            <ion-card-content>
              <ion-select
                label="Seleccionar reto"
                labelPlacement="stacked"
                [value]="retoSeleccionado$.value"
                (ionChange)="seleccionar($event.detail.value)">

                <ion-select-option [value]="0">
                  Todos los retos
                </ion-select-option>

                @for (reto of retos$ | async; track reto.id) {
                  <ion-select-option [value]="reto.id">
                    {{ reto.titulo }}
                  </ion-select-option>
                }

              </ion-select>
            </ion-card-content>
          </ion-card>

          @if (estadisticas$ | async; as datos) {

            <div class="estadisticas">

              <div class="tarjeta azul">
                <ion-icon name="clipboard-outline"></ion-icon>
                <span>Total de retos</span>
                <strong>{{ datos.totalRetos }}</strong>
              </div>

              <div class="tarjeta naranja">
                <ion-icon name="time-outline"></ion-icon>
                <span>Retos en curso</span>
                <strong>{{ datos.retosEnCurso }}</strong>
              </div>

              <div class="tarjeta morada">
                <ion-icon name="trending-up-outline"></ion-icon>
                <span>Avance promedio</span>
                <strong>
                  {{ datos.promedio === null
                     ? 'Sin datos'
                     : datos.promedio + '%' }}
                </strong>
              </div>

              <div class="tarjeta verde">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Cumplimiento</span>
                <strong>
                  {{ datos.cumplimiento === null
                     ? 'Sin datos'
                     : datos.cumplimiento + '%' }}
                </strong>
              </div>

            </div>

            <!-- Resumen general -->

            <ion-card>
              <ion-card-header>
                <ion-card-title>
                  Resumen general
                </ion-card-title>
              </ion-card-header>

              <ion-card-content>

                <div class="fila">
                  <span>Retos completados</span>
                  <strong>{{ datos.retosCompletados }}</strong>
                </div>

                <div class="fila">
                  <span>Tareas semanales</span>
                  <strong>{{ datos.totalSemanas }}</strong>
                </div>

                <div class="fila">
                  <span>Semanas cerradas</span>
                  <strong>{{ datos.totalCerradas }}</strong>
                </div>

                <div class="fila">
                  <span>Semanas en riesgo</span>
                  <strong class="texto-rojo">
                    {{ datos.riesgo }}
                  </strong>
                </div>

              </ion-card-content>
            </ion-card>

            <!-- Grafico de rendimiento -->

            <ion-card>

              <ion-card-header>
                <ion-card-title>
                  Evolución semanal
                </ion-card-title>
              </ion-card-header>

              <ion-card-content>

                <p>Avance promedio por semana</p>

                @if (datos.evolucion.length === 0) {
                  <p class="sin-datos">
                    Todavía no hay semanas iniciadas.
                  </p>
                }

                @for (item of datos.evolucion; track item.semana) {

                  <div class="grafico-fila">

                    <span class="semana">
                      S{{ item.semana }}
                    </span>

                    <div class="barra-fondo">
                      <div
                        class="barra"
                        [style.width.%]="item.promedio"
                        [class.barra-verde]="item.promedio === 100"
                        [class.barra-amarilla]="item.promedio >= 10 && item.promedio < 100"
                        [class.barra-roja]="item.promedio < 10">
                      </div>
                    </div>

                    <strong>{{ item.promedio }}%</strong>

                  </div>

                }

              </ion-card-content>
            </ion-card>

            <!-- Distribucion de semanas -->

            <ion-card>

              <ion-card-header>
                <ion-card-title>
                  Distribución de semanas cerradas
                </ion-card-title>
              </ion-card-header>

              <ion-card-content>

                <div class="fila">
                  <span>🟢 Cumplidas</span>
                  <strong>{{ datos.verdes }}</strong>
                </div>

                <ion-progress-bar
                  color="success"
                  [value]="datos.totalCerradas
                    ? datos.verdes / datos.totalCerradas
                    : 0">
                </ion-progress-bar>

                <div class="fila">
                  <span>🟡 Incompletas</span>
                  <strong>{{ datos.amarillas }}</strong>
                </div>

                <ion-progress-bar
                  color="warning"
                  [value]="datos.totalCerradas
                    ? datos.amarillas / datos.totalCerradas
                    : 0">
                </ion-progress-bar>

                <div class="fila">
                  <span>🔴 Incumplidas</span>
                  <strong>{{ datos.rojas }}</strong>
                </div>

                <ion-progress-bar
                  color="danger"
                  [value]="datos.totalCerradas
                    ? datos.rojas / datos.totalCerradas
                    : 0">
                </ion-progress-bar>

                @if (datos.totalCerradas === 0) {
                  <p class="sin-datos">
                    Todavía no existen semanas cerradas.
                  </p>
                }

              </ion-card-content>
            </ion-card>

            <!-- Recomendacion automatica -->

            <ion-card class="recomendacion">

              <ion-card-content>

                <div class="titulo-recomendacion">
                  <ion-icon name="bulb-outline"></ion-icon>
                  <h2>Recomendación personalizada</h2>
                </div>

                <p>{{ datos.recomendacion }}</p>

              </ion-card-content>

            </ion-card>

          } @else {
            <p class="sin-datos">
              Cargando estadísticas...
            </p>
          }

        }

      </main>

    </ion-content>
  `,

  styles: `
    ion-content {
      --background: var(--ion-color-light);
    }

    .contenedor {
      padding: 16px;
      max-width: 950px;
      margin: auto;
    }

    .bienvenida {
      background: linear-gradient(135deg, #0054e9, #6236d9);
      color: white;
      padding: 24px;
      border-radius: 18px;
      margin-bottom: 20px;
    }

    .bienvenida ion-icon {
      font-size: 32px;
    }

    .bienvenida h1 {
      font-size: 24px;
      font-weight: bold;
      margin: 12px 0;
    }

    .bienvenida p {
      font-size: 14px;
      line-height: 1.5;
      opacity: 0.95;
    }

    .estadisticas {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin: 18px 0;
    }

    .tarjeta {
      border-radius: 16px;
      padding: 16px;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 120px;
      box-shadow: 0 4px 12px #00000015;
    }

    .tarjeta ion-icon {
      font-size: 29px;
    }

    .tarjeta span {
      font-size: 13px;
    }

    .tarjeta strong {
      font-size: clamp(17px, 5vw, 28px);
    }

    .azul {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
    }

    .naranja {
      background: linear-gradient(135deg, #b45309, #c2410c);
    }

    .morada {
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
    }

    .verde {
      background: linear-gradient(135deg, #15803d, #047857);
    }

    ion-card {
      margin: 16px 0;
      border-radius: 16px;
    }

    ion-card-title {
      font-size: 18px;
      font-weight: 600;
    }

    .fila {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      font-size: 14px;
    }

    .texto-rojo {
      color: var(--ion-color-danger);
    }

    .grafico-fila {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 18px 0;
    }

    .semana {
      width: 35px;
      font-weight: bold;
    }

    .grafico-fila strong {
      width: 45px;
      text-align: right;
    }

    .barra-fondo {
      flex: 1;
      height: 22px;
      background: var(--ion-color-light-shade);
      border-radius: 7px;
      overflow: hidden;
    }

    .barra {
      height: 100%;
      border-radius: 7px;
      transition: width 0.4s ease;
    }

    .barra-verde {
      background: #22c55e;
    }

    .barra-amarilla {
      background: #eab308;
    }

    .barra-roja {
      background: #ef4444;
    }

    ion-progress-bar {
      height: 9px;
      border-radius: 10px;
      margin-bottom: 12px;
    }

    .recomendacion {
      border-left: 5px solid #eab308;
    }

    .titulo-recomendacion {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .titulo-recomendacion ion-icon {
      color: #eab308;
      font-size: 28px;
      flex-shrink: 0;
    }

    .titulo-recomendacion h2 {
      font-weight: bold;
      margin: 0;
    }

    .recomendacion p {
      line-height: 1.6;
    }

    .sin-datos {
      text-align: center;
      padding: 15px;
      color: var(--ion-color-medium);
    }

    .error {
      color: var(--ion-color-danger);
      padding: 12px;
    }

    @media (min-width: 768px) {
      .estadisticas {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `
})

export class DashboardPage {

  private readonly seguimiento = inject(SeguimientoService);

  protected readonly retos$ = this.seguimiento.retos$;

  protected readonly error$ = this.seguimiento.error$;

  protected readonly retoSeleccionado$ =
    new BehaviorSubject<number>(0);

  protected readonly estadisticas$ = combineLatest([
    this.seguimiento.retos$,
    this.seguimiento.semanas$,
    this.retoSeleccionado$
  ]).pipe(
    map(([retos, semanas, retoId]) =>
      calcularRendimiento(retos, semanas, retoId)
    )
  );

  constructor() {
    addIcons({
      arrowBack,
      refresh,
      clipboardOutline,
      timeOutline,
      trendingUpOutline,
      checkmarkCircleOutline,
      bulbOutline,
      statsChartOutline,
      trophyOutline
    });
  }

  protected seleccionar(id: number): void {
    this.retoSeleccionado$.next(Number(id));
  }

  protected actualizar(): void {
    this.seguimiento.recargar();
  }

  ionViewWillEnter(): void {
    this.actualizar();
  }
}
