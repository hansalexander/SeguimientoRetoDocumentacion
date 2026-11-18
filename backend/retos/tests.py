
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Reto, Avance


class RetoTests(APITestCase):

    def setUp(self):
        self.reto = Reto.objects.create(
            titulo='Reto de prueba',
            descripcion='Descripcion del reto',
            fecha_inicio='2026-11-18',
            fecha_fin='2026-11-30',
            estado='PENDIENTE'
        )

    def test_listar_retos(self):
        url = reverse('reto-list')
        respuesta = self.client.get(url)

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(respuesta.data), 1)

    def test_crear_reto(self):
        url = reverse('reto-list')
        datos = {
            'titulo': 'Nuevo reto',
            'descripcion': 'Reto creado desde una prueba',
            'fecha_inicio': '2026-11-18',
            'fecha_fin': '2026-11-30',
            'estado': 'PENDIENTE'
        }

        respuesta = self.client.post(url, datos, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reto.objects.count(), 2)

    def test_crear_avance(self):
        url = reverse('avance-list')
        datos = {
            'reto': self.reto.id,
            'fecha': '2026-11-18',
            'descripcion': 'Avance de prueba',
            'porcentaje': 25
        }

        respuesta = self.client.post(url, datos, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Avance.objects.count(), 1)

    def test_actualizar_reto(self):
        url = reverse('reto-detail', args=[self.reto.id])
        datos = {
            'titulo': 'Reto actualizado',
            'descripcion': 'Descripcion actualizada',
            'fecha_inicio': '2026-11-18',
            'fecha_fin': '2026-11-30',
            'estado': 'EN_CURSO'
        }

        respuesta = self.client.put(url, datos, format='json')

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)

        self.reto.refresh_from_db()
        self.assertEqual(self.reto.estado, 'EN_CURSO')
