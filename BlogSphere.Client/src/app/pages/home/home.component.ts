import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  userId?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  errorMessage = '';
  successMessage = '';

  showCreateForm = false;
  isSaving = false;

  editingPostId: number | null = null;
  isUpdating = false;
  deletingPostId: number | null = null;

  showBackToTop = false;

  searchQuery = '';

  private apiUrl = 'https://blogsphere-api-vhq2.onrender.com/api/posts';

  newPost = {
    title: '',
    content: '',
    author: ''
  };

  editPostForm = {
    title: '',
    content: '',
    author: ''
  };

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.updateBackToTopVisibility();
  }

  get currentUser(): User | null {
    return this.auth.getCurrentUser();
  }

  get filteredPosts(): Post[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.posts;
    }

    return this.posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateBackToTopVisibility();
  }

  private updateBackToTopVisibility(): void {
    this.showBackToTop =
      window.scrollY > 300 ||
      document.documentElement.scrollTop > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  toggleCreateForm(): void {
    if (!this.auth.isLoggedIn()) {
      this.errorMessage = 'Please login to write a story.';
      this.router.navigate(['/login']);
      return;
    }

    this.showCreateForm = !this.showCreateForm;

    if (this.showCreateForm) {
      setTimeout(() => {
        document.getElementById('create-post')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  loadPosts(): void {
    this.http.get<Post[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.posts = data;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.errorMessage = 'Could not load blog posts.';
      }
    });
  }

  createPost(): void {
    if (!this.auth.isLoggedIn()) {
      this.errorMessage = 'Please login to publish a story.';
      this.router.navigate(['/login']);
      return;
    }

    const title = this.newPost.title.trim();
    const content = this.newPost.content.trim();
    const author = this.newPost.author.trim();

    if (!title || !content || !author || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post<Post>(this.apiUrl, {
      title,
      content,
      author
    }).subscribe({
      next: (createdPost) => {
        this.posts = [createdPost, ...this.posts];

        this.newPost = {
          title: '',
          content: '',
          author: ''
        };

        this.showCreateForm = false;
        this.isSaving = false;
        this.successMessage = 'Your post has been published!';
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.isSaving = false;

        if (error.status === 401) {
          this.errorMessage = 'Your session expired. Please login again.';
          this.auth.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Could not publish your post. Please try again.';
        }
      }
    });
  }

  startEdit(post: Post): void {
    if (!this.auth.isLoggedIn()) {
      this.errorMessage = 'Please login to edit stories.';
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.auth.getCurrentUser();

    if (post.userId && currentUser && post.userId !== currentUser.id) {
      this.errorMessage = 'You can only edit your own stories.';
      return;
    }

    this.editingPostId = post.id;

    this.editPostForm = {
      title: post.title,
      content: post.content,
      author: post.author
    };

    this.successMessage = '';
    this.errorMessage = '';

    setTimeout(() => {
      document.getElementById('editTitle' + post.id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });
  }

  cancelEdit(): void {
    this.editingPostId = null;

    this.editPostForm = {
      title: '',
      content: '',
      author: ''
    };

    this.isUpdating = false;
  }

  saveEdit(id: number): void {
    if (!this.auth.isLoggedIn()) {
      this.errorMessage = 'Please login to update stories.';
      this.router.navigate(['/login']);
      return;
    }

    const title = this.editPostForm.title.trim();
    const content = this.editPostForm.content.trim();
    const author = this.editPostForm.author.trim();

    if (!title || !content || !author || this.isUpdating) {
      return;
    }

    const existingPost = this.posts.find(post => post.id === id);

    if (!existingPost) {
      this.errorMessage = 'Could not find the post to update.';
      return;
    }

    const updatedPost: Post = {
      id: existingPost.id,
      title,
      content,
      author,
      createdAt: existingPost.createdAt,
      userId: existingPost.userId
    };

    this.isUpdating = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.put<void>(`${this.apiUrl}/${id}`, updatedPost).subscribe({
      next: () => {
        this.posts = this.posts.map(post =>
          post.id === id ? updatedPost : post
        );

        this.cancelEdit();
        this.successMessage = 'Your story has been updated!';
      },
      error: (error) => {
        console.error('Error updating post:', error);
        this.isUpdating = false;

        if (error.status === 401) {
          this.errorMessage = 'Your session expired. Please login again.';
          this.auth.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.errorMessage = 'You can only edit your own stories.';
        } else {
          this.errorMessage = 'Could not update your story. Please try again.';
        }
      }
    });
  }

  deletePost(post: Post): void {
    if (!this.auth.isLoggedIn()) {
      this.errorMessage = 'Please login to delete stories.';
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.auth.getCurrentUser();

    if (post.userId && currentUser && post.userId !== currentUser.id) {
      this.errorMessage = 'You can only delete your own stories.';
      return;
    }

    if (this.deletingPostId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.deletingPostId = post.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.delete<void>(`${this.apiUrl}/${post.id}`).subscribe({
      next: () => {
        this.posts = this.posts.filter(item => item.id !== post.id);

        if (this.editingPostId === post.id) {
          this.cancelEdit();
        }

        this.deletingPostId = null;
        this.successMessage = 'Your story has been deleted.';
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        this.deletingPostId = null;

        if (error.status === 401) {
          this.errorMessage = 'Your session expired. Please login again.';
          this.auth.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.errorMessage = 'You can only delete your own stories.';
        } else {
          this.errorMessage = 'Could not delete the story. Please try again.';
        }
      }
    });
  }
}