import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '../news.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
import { jwtDecode } from 'jwt-decode';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../comment.service';
import Swal from 'sweetalert2';
interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}

interface Comment {
  id: number;
  body: string;
  userID: number;
  articleID: number;
  createdAt: string;
  user?: {
    name: string;
    id: number;
  };
}
@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css',
})
export class NewsDetailComponent {
  currentDate = new Date();
  news: any = {};
  baseUrl: string = 'http://localhost:3000/';
  cookie!: string;
  userInfo: any = {};
  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};
  userGoogle: any = {};
  commentText = '';
  comments: Comment[] = []; // Now TypeScript knows what's inside comments
  newsId: number = 0;
  isUser: boolean = false;
  editingCommentId: number | null = null;
  commentsCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService,
    private router: Router,
    private commentService: CommentService
  ) {}
  commentForm = new FormGroup({
    comment: new FormControl(''),
  });
  ngOnInit(): void {
    this.newsId = +this.route.snapshot.params['id']; // Convertir de string a number
    console.log('Article ID: ', this.newsId); // Verifica que estás recibiendo el ID correcto

    this.newsService.getNewsById(this.newsId).subscribe({
      next: (data) => {
        console.log('Initial data loaded', data);
        this.news = data;
      },
      error: (error) => {
        console.error('Error al obtener los detalles del artículo:', error);
      },
    });

    this.isAuthenticated = this.authService.tokenExists();
    if (this.isAuthenticated) {
      this.getPayload();
    }
    this.getLocalTokenInfo();
    this.loadComments();
    console.log('commentsCount:', this.commentsCount);
    this.isUser = this.authService.isUser();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      // Si no hay una ruta de imagen, devuelve una imagen por defecto
      return 'src/assets/images/default-image.webp';
    }
    const imageUrl = `${this.baseUrl}${imagePath.replace(/\\/g, '/')}`;
    return imageUrl;
  }

  //!Lógica para coger info users
  //Cogemos token local
  getLocalUserData(id: any) {
    this.http.getLocalUser(id).subscribe({
      next: (response) => {
        console.log('Datos del usuario:', response);
        this.userLocalInfo = response;
      },
      error: (error) => {
        console.log('Error en getLocalUserData:', error);
      },
    });
  }
  getLocalTokenInfo() {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      //Esto lo hacemos para comprobar que existe localStorage en el entorno
      this.isAuthenticated = true;
      this.localToken = localStorage.getItem('token');
      const localInfo = jwtDecode(this.localToken) as CustomJwtPayload;
      console.log(localInfo.id);

      if (localInfo && localInfo.id) {
        this.getLocalUserData(localInfo.id);
      }
    } else {
      console.log('De momento no hay localToken');
    }
  }

  getPayload() {
    this.http.getPayload().subscribe({
      next: (res) => {
        console.log('Datos del usuario:', res.user);
        this.userInfo = jwtDecode(res.user);
        console.log(this.userInfo.id);
        this.isAuthenticated = true;

        this.http2
          .get<any>(`http://localhost:3000/user/${this.userInfo.id}`)
          .subscribe({
            next: (userRes) => {
              console.log(userRes);
              this.userGoogle = userRes;
              console.log(this.userGoogle.role);
            },
          });
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario', error);
      },
    });
  }

  navigateToEditNews(newsId: number) {
    this.router.navigate(['/edit-news', newsId]);
  }

  //Lógica comments

  startEditing(comment: Comment) {
    this.editingCommentId = comment.id;
    this.commentForm.setValue({ comment: comment.body });
  }

  submitComment(): void {
    if (!this.isAuthenticated) {
      console.error('User not authenticated');
      return;
    }
    const commentBody = this.commentForm.get('comment')?.value;
    if (!commentBody || commentBody.trim() === '') {
      console.error('Comment body cannot be empty');
      return; // Prevent submission of empty comments
    }

    if (this.editingCommentId) {
      // Update existing comment
      this.commentService
        .updateComment(this.editingCommentId, { body: commentBody })
        .subscribe({
          next: (response) => {
            console.log('Comment updated', response);
            this.loadComments(); // Reload comments after updating
          },
          error: (error) => console.error('Error updating comment', error),
        });
    } else {
      // Post new comment
      const payload = {
        body: commentBody,
        articleID: this.newsId.toString(),
      };
      this.commentService.postComment(payload).subscribe({
        next: (response) => {
          console.log('Comment posted', response);
          this.loadComments(); // Reload comments after posting a new one
        },
        error: (error) => console.error('Error posting comment', error),
      });
    }

    this.commentForm.reset();
    this.editingCommentId = null;
  }

  loadComments() {
    this.commentService.getComments(this.newsId.toString()).subscribe({
      next: (comments: any) => {
        this.comments = comments;
        this.commentsCount = comments.length;
      },
      error: (error) => console.error('Error loading comments', error),
    });
  }

  deleteComment(commentId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer el comentario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, bórralo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe({
          next: (response) => {
            console.log('Comment deleted', response);
            Swal.fire('Borrado', 'Tu comentario ha sido borrado.', 'success');
            this.loadComments();
          },
          error: (error) => {
            console.error('Error deleting comment', error);
            Swal.fire('Error!', 'Failed to delete the comment.', 'error');
          },
        });
      }
    });
  }
}
