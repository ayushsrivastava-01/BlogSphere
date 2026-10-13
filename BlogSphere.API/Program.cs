using System.Security.Claims;
using System.Text;
using BlogSphere.API.Data;
using BlogSphere.API.DTOs;
using BlogSphere.API.Models;
using BlogSphere.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<BlogSphereDbContext>(options =>
    options.UseMySQL(connectionString!));

builder.Services.AddScoped<AuthService>();

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AngularClient");
app.UseAuthentication();
app.UseAuthorization();

static int? GetUserId(ClaimsPrincipal user)
{
    var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
    return int.TryParse(id, out var parsed) ? parsed : null;
}

// ==================== POSTS ====================

app.MapGet("/api/posts", async (BlogSphereDbContext db) =>
{
    var posts = await db.Posts
        .OrderByDescending(p => p.CreatedAt)
        .ToListAsync();
    return Results.Ok(posts);
});

app.MapGet("/api/posts/{id}", async (int id, BlogSphereDbContext db) =>
{
    var post = await db.Posts.FindAsync(id);
    return post is null ? Results.NotFound() : Results.Ok(post);
});

app.MapPost("/api/posts", async (
    Post newPost,
    BlogSphereDbContext db,
    ClaimsPrincipal user) =>
{
    var userId = GetUserId(user);

    if (userId is null)
    {
        return Results.Unauthorized();
    }

    newPost.Id = 0;
    newPost.UserId = userId;
    newPost.CreatedAt = DateTime.UtcNow;

    db.Posts.Add(newPost);
    await db.SaveChangesAsync();

    return Results.Created($"/api/posts/{newPost.Id}", newPost);
})
.RequireAuthorization();

app.MapPut("/api/posts/{id}", async (
    int id,
    Post updatedPost,
    BlogSphereDbContext db,
    ClaimsPrincipal user) =>
{
    var userId = GetUserId(user);

    if (userId is null)
    {
        return Results.Unauthorized();
    }

    var post = await db.Posts.FindAsync(id);

    if (post is null)
    {
        return Results.NotFound();
    }

    if (post.UserId != userId)
    {
        return Results.Forbid();
    }

    post.Title = updatedPost.Title;
    post.Content = updatedPost.Content;
    post.Author = updatedPost.Author;

    await db.SaveChangesAsync();

    return Results.Ok(post);
})
.RequireAuthorization();

app.MapDelete("/api/posts/{id}", async (
    int id,
    BlogSphereDbContext db,
    ClaimsPrincipal user) =>
{
    var userId = GetUserId(user);

    if (userId is null)
    {
        return Results.Unauthorized();
    }

    var post = await db.Posts.FindAsync(id);

    if (post is null)
    {
        return Results.NotFound();
    }

    if (post.UserId != userId)
    {
        return Results.Forbid();
    }

    db.Posts.Remove(post);
    await db.SaveChangesAsync();

    return Results.NoContent();
})
.RequireAuthorization();

// ==================== AUTH ====================

app.MapPost("/api/auth/register", async (RegisterDto dto, AuthService auth) =>
{
    var result = await auth.RegisterAsync(dto);

    if (!result.Success)
    {
        return Results.BadRequest(new { message = result.Message });
    }

    return Results.Ok(new
    {
        message = result.Message,
        user = new
        {
            id = result.User!.Id,
            name = result.User.Name,
            email = result.User.Email
        }
    });
});

app.MapPost("/api/auth/login", async (LoginDto dto, AuthService auth) =>
{
    var result = await auth.LoginAsync(dto);

    if (!result.Success)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new
    {
        message = result.Message,
        token = result.Token,
        user = new
        {
            id = result.User!.Id,
            name = result.User.Name,
            email = result.User.Email
        }
    });
});

app.Run();