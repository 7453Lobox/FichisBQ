import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import GalleryManager from '@/components/GalleryManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Admin Gallery Page
 * Only accessible to authenticated users (admin role)
 */
export default function AdminGallery() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-primary">Gestionar Galería</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Bienvenido, {user.name}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <GalleryManager />
      </div>
    </div>
  );
}
