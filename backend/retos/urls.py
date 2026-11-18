
from rest_framework.routers import DefaultRouter
from .views import RetoViewSet, AvanceViewSet

router = DefaultRouter()
router.register(r'retos', RetoViewSet)
router.register(r'avances', AvanceViewSet)

urlpatterns = router.urls
