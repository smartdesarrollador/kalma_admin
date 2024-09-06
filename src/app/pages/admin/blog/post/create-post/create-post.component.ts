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
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  categorias: Category[] = [];
  autores = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Autor' },
  ];
  selectedFile: File | null = null; // Almacenar el archivo seleccionado

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private categoryService: CategoryService,
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
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categorias = data;
    });
  }

  // Método para manejar el archivo seleccionado
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  createPost(): void {
    if (this.postForm.valid && this.selectedFile) {
      const formData = new FormData();

      // Añadir los campos del formulario al FormData
      formData.append('titulo', this.postForm.get('titulo')!.value);
      formData.append('contenido', this.postForm.get('contenido')!.value);
      formData.append('id_autor', this.postForm.get('id_autor')!.value);
      formData.append('estado', this.postForm.get('estado')!.value);
      formData.append(
        'fecha_publicacion',
        this.postForm.get('fecha_publicacion')!.value
      );
      this.postForm.get('categorias')!.value.forEach((categoriaId: number) => {
        formData.append('categorias[]', categoriaId.toString()); // Convertir a string
      });

      // Añadir el archivo de imagen
      formData.append('imagen', this.selectedFile);

      // Llamar al servicio para crear el post
      this.postService.createPost(formData).subscribe(
        () => {
          console.log('El post se ha creado correctamente.');
          this.router.navigate(['/posts']);
        },
        (error) => {
          console.error('Hubo un error al crear el post:', error);
        }
      );
    } else {
      console.error(
        'El formulario no es válido o no se ha seleccionado una imagen.'
      );
    }
  }
}
