import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/api';
import { toast } from 'react-toastify';

// Clave para las queries (útil para invalidar)
export const documentKeys = {
  all: ['documents'],
  lists: () => [...documentKeys.all, 'list'],
  list: (filters) => [...documentKeys.lists(), { filters }],
  details: () => [...documentKeys.all, 'detail'],
  detail: (id) => [...documentKeys.details(), id],
};

// Hook para obtener todos los documentos
export const useDocuments = () => {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: async () => {
      try {
        return await documentService.getAll();
      } catch (error) {
        toast.error('Error al cargar los documentos');
        throw error;
      }
    },
  });
};

// Hook para crear un documento
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDocument) => documentService.create(newDocument),
    onSuccess: () => {
      // Invalidar y recargar la lista de documentos
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      toast.success('Documento guardado exitosamente');
    },
    onError: (error) => {
      console.error('Error al crear:', error);
      if (error.response?.status === 500) {
        toast.error('Error interno del servidor');
      } else {
        toast.error('Error al guardar el documento');
      }
    },
  });
};

// Hook para actualizar un documento
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => documentService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar la lista y el detalle específico
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
      toast.success('Documento actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error al actualizar:', error);
      toast.error('Error al actualizar el documento');
    },
  });
};

// Hook para eliminar un documento
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => documentService.delete(id),
    onSuccess: (_, deletedId) => {
      // Actualizar el caché directamente para respuesta instantánea
      queryClient.setQueryData(documentKeys.lists(), (oldData) => {
        return oldData ? oldData.filter(doc => doc.id !== deletedId) : [];
      });
      
      // Invalidar para asegurar consistencia con el servidor
      queryClient.invalidateQueries({ 
        queryKey: documentKeys.lists(),
        refetchType: 'active' 
      });
      
      toast.success('Documento eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar el documento');
      // Recargar para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

// Hook para generar ZIP
export const useGenerateZip = () => {
  return useMutation({
    mutationFn: (id) => documentService.generateZip(id),
    onSuccess: (result) => {
      // Descargar el archivo
      const url = window.URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Documentos generados exitosamente');
    },
    onError: (error) => {
      console.error('Error al generar ZIP:', error);
      toast.error('Error al generar los documentos');
    },
  });
};