import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonModule } from '@angular/common';
import { Post } from 'src/app/models/post.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  categorias: Category[] = [];
  autores = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Autor' },
  ];
  postId: number;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      contenido: ['', [Validators.required]],
      id_autor: [null, Validators.required],
      estado: ['publicado', Validators.required],
      fecha_publicacion: ['', Validators.required],
      categorias: [[], Validators.required],
    });

    // Obtener el ID del post desde la URL
    this.postId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    // Cargar las categorías
    this.categoryService.getCategories().subscribe((data) => {
      this.categorias = data;
    });

    // Cargar los datos del post a editar
    this.postService.getPost(this.postId).subscribe((post: Post) => {
      this.postForm.patchValue({
        titulo: post.titulo,
        contenido: post.contenido,
        id_autor: post.id_autor,
        estado: post.estado,
        fecha_publicacion: post.fecha_publicacion,
        categorias: post.categorias?.map((categoria: Category) => categoria.id), // Asegúrate de tipar correctamente
      });
    });
  }

  updatePost(): void {
    if (this.postForm.valid) {
      const updatedPost = this.postForm.value;

      this.postService.updatePost(this.postId, updatedPost).subscribe(
        () => {
          console.log('Post actualizado correctamente.');
          this.router.navigate(['/posts']);
        },
        (error) => {
          console.error('Hubo un error al actualizar el post:', error);
        }
      );
    }
  }
}
