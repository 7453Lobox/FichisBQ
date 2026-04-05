import { useState, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Gallery Manager Component
 * Allows authenticated users to upload and manage gallery images
 */
export default function GalleryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('menu');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: galleryImages, isLoading } = trpc.gallery.list.useQuery();
  const uploadMutation = trpc.gallery.upload.useMutation({
    onSuccess: () => {
      toast.success('Imagen subida exitosamente');
      setTitle('');
      setDescription('');
      setCategory('menu');
      setSelectedFile(null);
      setPreviewUrl('');
      utils.gallery.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Error al subir: ${error.message}`);
    },
  });

  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success('Imagen eliminada');
      utils.gallery.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      if (!base64) return;

      uploadMutation.mutate({
        title,
        description,
        category,
        fileBase64: base64,
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Subir Nueva Imagen</h3>

        <div className="space-y-4">
          {/* File Preview */}
          {previewUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload size={20} className="mr-2" />
              {selectedFile ? selectedFile.name : 'Seleccionar imagen'}
            </Button>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Pechuga a la parrilla"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Descripción</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe la imagen..."
              rows={3}
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md"
            >
              <option value="menu">Menú</option>
              <option value="event">Evento</option>
              <option value="ambiance">Ambiente</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title || uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending && <Loader2 size={20} className="mr-2 animate-spin" />}
            Subir Imagen
          </Button>
        </div>
      </Card>

      {/* Gallery Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">Galería ({galleryImages?.length || 0})</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={32} className="animate-spin text-muted-foreground" />
          </div>
        ) : galleryImages && galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => deleteMutation.mutate({ id: image.id })}
                      disabled={deleteMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm truncate">{image.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{image.description}</p>
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2">
                    {image.category}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay imágenes en la galería aún</p>
          </div>
        )}
      </div>
    </div>
  );
}
