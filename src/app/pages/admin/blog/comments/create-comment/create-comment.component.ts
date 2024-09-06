import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css',
})
export class CreateCommentComponent {
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      id_articulo: [1, Validators.required], // Valor por defecto 1
      nombre_comentarista: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      contenido: ['', [Validators.required]],
      fecha_comentario: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ], // Fecha actual como valor por defecto
    });
  }

  createComment(): void {
    if (this.commentForm.valid) {
      const newComment = this.commentForm.value;

      this.commentService.createComment(newComment).subscribe(
        () => {
          console.log('El comentario se ha creado correctamente.');
          this.router.navigate(['/comments']);
        },
        (error) => {
          console.error('Hubo un error al crear el comentario:', error);
        }
      );
    } else {
      console.error('El formulario no es válido.');
    }
  }
}
