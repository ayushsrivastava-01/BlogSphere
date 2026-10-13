import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!email || !password || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    this.auth.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}