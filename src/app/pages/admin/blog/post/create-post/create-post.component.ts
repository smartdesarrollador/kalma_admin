import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  postForm: FormGroup;
  categorias: Category[] = []; // Arreglo de categorías
  autores = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Autor' },
  ];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private categoryService: CategoryService, // Servicio para obtener categorías
    private router: Router
  ) {
    this.postForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      contenido: ['', [Validators.required]],
      id_autor: [null, Validators.required],
      estado: ['publicado', Validators.required],
      fecha_publicacion: ['', Validators.required],
      categorias: [[], Validators.required], // Campo para seleccionar categorías
    });
  }

  ngOnInit(): void {
    // Cargar las categorías al inicializar el componente
    this.categoryService.getCategories().subscribe((data) => {
      this.categorias = data;
    });
  }

  createPost(): void {
    if (this.postForm.valid) {
      const newPost = this.postForm.value;

      this.postService.createPost(newPost).subscribe(
        () => {
          console.log('El post se ha creado correctamente.');
          this.router.navigate(['/posts']);
        },
        (error) => {
          console.error('Hubo un error al crear el post:', error);
        }
      );
    } else {
      console.error('El formulario no es válido.');
    }
  }
}
