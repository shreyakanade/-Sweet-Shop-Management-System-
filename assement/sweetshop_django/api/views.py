from rest_framework import generics, viewsets, status
from .models import Sweet
from .serializers import SweetSerializer, UserRegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response

# Register endpoint
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer

# Sweets viewset
class SweetViewSet(viewsets.ModelViewSet):
    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['destroy', 'restock']:
            return [IsAuthenticated(), IsAdminOrReadOnly()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        name = request.query_params.get('name')
        category = request.query_params.get('category')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        qs = Sweet.objects.all()
        if name:
            qs = qs.filter(name__icontains=name)
        if category:
            qs = qs.filter(category__icontains=category)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='purchase')
    def purchase(self, request, pk=None):
        sweet = self.get_object()
        qty = int(request.query_params.get('quantity', 1))
        if sweet.quantity < qty:
            return Response({'detail': 'Not enough quantity in stock'}, status=status.HTTP_400_BAD_REQUEST)
        sweet.quantity -= qty
        sweet.save()
        return Response({'detail': f'Purchased {qty} unit(s)', 'sweet': self.get_serializer(sweet).data})

    @action(detail=True, methods=['post'], url_path='restock', permission_classes=[IsAuthenticated])
    def restock(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'detail': 'Admin privileges required'}, status=status.HTTP_403_FORBIDDEN)
        sweet = self.get_object()
        qty = int(request.query_params.get('quantity', 0))
        if qty <= 0:
            return Response({'detail': 'Quantity must be > 0'}, status=status.HTTP_400_BAD_REQUEST)
        sweet.quantity += qty
        sweet.save()
        return Response({'detail': f'Restocked {qty} unit(s)', 'sweet': self.get_serializer(sweet).data})
