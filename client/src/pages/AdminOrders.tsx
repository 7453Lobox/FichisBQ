import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';

type OrderStatus = "nuevo" | "en_preparacion" | "listo" | "entregado" | "cancelado";

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: ordersData, isLoading, refetch } = trpc.orders.list.useQuery();
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData);
    }
  }, [ordersData]);

  // Polling cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: newStatus,
      });
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Acceso Denegado</h1>
          <p className="text-muted-foreground">Solo administradores pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'nuevo':
        return 'bg-blue-100 text-blue-800';
      case 'en_preparacion':
        return 'bg-yellow-100 text-yellow-800';
      case 'listo':
        return 'bg-green-100 text-green-800';
      case 'entregado':
        return 'bg-gray-100 text-gray-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      nuevo: 'Nuevo',
      en_preparacion: 'En Preparación',
      listo: 'Listo',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return labels[status];
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Panel de Pedidos</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay pedidos aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de pedidos */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedOrder?.id === order.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          Pedido #{order.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.customerName} - {order.customerPhone}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total: ${(order.totalPrice / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalles del pedido seleccionado */}
            {selectedOrder && (
              <div className="bg-card rounded-lg border-2 border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Detalles del Pedido
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-semibold text-foreground">{selectedOrder.customerName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <a
                      href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {selectedOrder.customerPhone}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Platos</p>
                    <div className="mt-2 space-y-1">
                      {(() => {
                        try {
                          const items = JSON.parse(selectedOrder.items);
                          return items.map((item: any, idx: number) => (
                            <p key={idx} className="text-sm text-foreground">
                              {item.nombre} x{item.cantidad} - ${item.precio}
                            </p>
                          ));
                        } catch {
                          return <p className="text-sm text-foreground">{selectedOrder.items}</p>;
                        }
                      })()}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(selectedOrder.totalPrice / 100).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Cambiar Estado</p>
                    <div className="space-y-2">
                      {(['nuevo', 'en_preparacion', 'listo', 'entregado', 'cancelado'] as OrderStatus[]).map((status) => (
                        <Button
                          key={status}
                          onClick={() => handleStatusChange(selectedOrder.id, status)}
                          variant={selectedOrder.status === status ? 'default' : 'outline'}
                          className="w-full"
                          disabled={updateStatusMutation.isPending}
                        >
                          {getStatusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notas</p>
                      <p className="text-sm text-foreground">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
