using BlogSphere.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogSphere.API.Data;

public class BlogSphereDbContext : DbContext
{
    public BlogSphereDbContext(
        DbContextOptions<BlogSphereDbContext> options)
        : base(options)
    {
    }

    public DbSet<Post> Posts => Set<Post>();

    public DbSet<User> Users => Set<User>();
}