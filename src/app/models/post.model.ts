export interface Post {
  id?: number;
  titulo?: string;
  contenido?: string;
  id_autor?: number;
  estado?: 'publicado' | 'borrador';
  fecha_publicacion?: Date | null;
  created_at?: Date;
  updated_at?: Date;
  comentarios?: Comment[];
}
