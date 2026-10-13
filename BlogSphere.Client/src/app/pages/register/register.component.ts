import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!name || !email || !password || this.isSubmitting) return;

    if (password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.register(name, email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Account created! Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        console.error('Register error:', err);
        this.isSubmitting = false;
        this.errorMessage =
          err?.error?.message || 'Could not create your account.';
      }
    });
  }
}