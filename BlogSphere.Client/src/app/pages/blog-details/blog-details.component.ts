import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit {
  post: Post | null = null;
  isLoading = true;
  errorMessage = '';

  private apiUrl = 'http://localhost:5269/api/posts';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid blog ID.';
      this.isLoading = false;
      return;
    }

    this.http.get<Post>(`${this.apiUrl}/${id}`).subscribe({
      next: (data) => {
        this.post = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog details:', error);
        this.errorMessage = 'Could not find this blog post.';
        this.isLoading = false;
      }
    });
  }
}
