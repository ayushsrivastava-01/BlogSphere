using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BlogSphere.API.Data;
using BlogSphere.API.DTOs;
using BlogSphere.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BlogSphere.API.Services;

public class AuthService
{
    private readonly BlogSphereDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(BlogSphereDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<(bool Success, string Message, User? User)> RegisterAsync(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return (false, "All fields are required.", null);
        }

        if (dto.Password.Length < 6)
        {
            return (false, "Password must be at least 6 characters.", null);
        }

        var exists = await _db.Users.AnyAsync(u => u.Email == email);

        if (exists)
        {
            return (false, "Email is already registered.", null);
        }

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return (true, "Registration successful.", user);
    }

    public async Task<(bool Success, string Message, string? Token, User? User)> LoginAsync(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
        {
            return (false, "Invalid email or password.", null, null);
        }

        var passwordOk = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!passwordOk)
        {
            return (false, "Invalid email or password.", null, null);
        }

        var token = GenerateToken(user);

        return (true, "Login successful.", token, user);
    }

    private string GenerateToken(User user)
    {
        var key = _config["Jwt:Key"]!;
        var issuer = _config["Jwt:Issuer"]!;
        var audience = _config["Jwt:Audience"]!;
        var expiryMinutes = int.Parse(_config["Jwt:ExpiryMinutes"] ?? "60");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}