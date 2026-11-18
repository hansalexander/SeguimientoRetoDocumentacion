

from rest_framework import serializers
from .models import Reto, Avance


class RetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reto
        fields = '__all__'


class AvanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avance
        fields = '__all__'
