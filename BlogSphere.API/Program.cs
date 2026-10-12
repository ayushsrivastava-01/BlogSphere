
using BlogSphere.API.Models;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var posts = new List<Post>
{
    new Post
    {
        Id = 1,
        Title = "My First Blog",
        Content = "This is my first blog post.",
        Author = "Ayush"
    },
    new Post
    {
        Id = 2,
        Title = "Learning Angular and .NET",
        Content = "I am building BlogSphere to learn full-stack development.",
        Author = "Ayush"
    }
};

//traditional get method
app.MapGet("/api/posts", () =>
{
    return Results.Ok(posts);
});

//get by ID
app.MapGet("/api/posts/{id}", (int id) =>
{
    var post = posts.FirstOrDefault(p => p.Id == id);

    if (post is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(post);
}); 

//post ke liye
app.MapPost("/api/posts", (Post newPost) =>
{
    newPost.Id = posts.Count > 0 ? posts.Max(p => p.Id) + 1 : 1;
    newPost.CreatedAt = DateTime.UtcNow;

    posts.Add(newPost);

    return Results.Created($"/api/posts/{newPost.Id}", newPost);
});


//put method
app.MapPut("/api/posts/{id}", (int id, Post updatedPost) =>
{
    var post = posts.FirstOrDefault(p => p.Id == id);

    if (post is null)
    {
        return Results.NotFound();
    }

    post.Title = updatedPost.Title;
    post.Content = updatedPost.Content;
    post.Author = updatedPost.Author;

    return Results.Ok(post);
});

//delete method
app.MapDelete("/api/posts/{id}", (int id) =>
{
    var post = posts.FirstOrDefault(p => p.Id == id);

    if (post is null)
    {
        return Results.NotFound();
    }

    posts.Remove(post);

    return Results.NoContent();
});

app.Run();