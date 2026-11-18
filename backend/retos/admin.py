
from django.contrib import admin
from .models import Reto, Avance


@admin.register(Reto)
class RetoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'titulo',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'creado',
    )
    list_filter = ('estado', 'fecha_inicio')
    search_fields = ('titulo', 'descripcion')


@admin.register(Avance)
class AvanceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'reto',
        'fecha',
        'descripcion',
        'porcentaje',
    )
    list_filter = ('fecha',)
    search_fields = ('descripcion', 'reto__titulo')
