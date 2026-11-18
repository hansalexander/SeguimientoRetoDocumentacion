
from rest_framework import viewsets
from .models import Reto, Avance
from .serializers import RetoSerializer, AvanceSerializer


class RetoViewSet(viewsets.ModelViewSet):
    queryset = Reto.objects.all()
    serializer_class = RetoSerializer


class AvanceViewSet(viewsets.ModelViewSet):
    queryset = Avance.objects.all()
    serializer_class = AvanceSerializer

