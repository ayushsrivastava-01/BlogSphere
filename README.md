# 📝 BlogSphere

### ✨ Write. Share. Connect.

<p align="center">
  A modern full-stack blogging platform built with <strong>Angular</strong> and <strong>ASP.NET Core</strong>.
  <br />
  <em>Learning full-stack development, one feature at a time.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/C%23-Backend-239120?style=for-the-badge&logo=csharp&logoColor=white" alt="C Sharp" />
  <img src="https://img.shields.io/badge/Angular-Planned-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular planned" />
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" alt="In development" />
</p>

---

## 🚀 About the Project

**BlogSphere** is a full-stack blogging application I'm building to strengthen my skills in modern web development.

The project starts with a RESTful API built using ASP.NET Core and will gradually evolve into a complete blogging platform with an Angular frontend, database integration, and authentication.

The focus is on understanding how real-world applications work — from API design and data persistence to frontend integration and deployment.

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>📖 Read Blogs</h3>
      Retrieve all blog posts or fetch a specific post by its ID.
    </td>
    <td width="50%">
      <h3>✍️ Create Blogs</h3>
      Add new posts with a title, content, and author.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🛠️ Update Blogs</h3>
      Edit existing blog post details using the PUT endpoint.
    </td>
    <td width="50%">
      <h3>🗑️ Delete Blogs</h3>
      Remove a post using its unique ID.
    </td>
  </tr>
</table>

> More features, including database persistence and the Angular interface, are planned as development continues.

## 🧰 Tech Stack

| Technology            | Purpose              | Status  |
| --------------------- | -------------------- | ------- |
| C#                    | Backend programming  | In use  |
| ASP.NET Core Web API  | REST API development | In use  |
| .NET 10               | Backend framework    | In use  |
| Postman               | API testing          | In use  |
| Git & GitHub          | Version control      | In use  |
| Angular               | Frontend development | Planned |
| TypeScript            | Frontend programming | Planned |
| SQL Server            | Database             | Planned |
| Entity Framework Core | Data access          | Planned |

## 📡 API Reference

Base URL: `http://localhost:5269`

| HTTP Method | Endpoint          | Description       |
| ----------- | ----------------- | ----------------- |
| `GET`       | `/api/posts`      | Get all posts     |
| `GET`       | `/api/posts/{id}` | Get a post by ID  |
| `POST`      | `/api/posts`      | Create a new post |
| `PUT`       | `/api/posts/{id}` | Update a post     |
| `DELETE`    | `/api/posts/{id}` | Delete a post     |

### Example Request

Create a new blog using `POST /api/posts`.

```json
{
  "title": "Hello, BlogSphere!",
  "content": "My journey into full-stack development starts here.",
  "author": "Ayush"
}
```

## ⚙️ Run Locally

### Prerequisites

* [.NET SDK](https://dotnet.microsoft.com/download)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Postman](https://www.postman.com/)

### Setup

```bash
git clone https://github.com/ayushsrivastava-01/BlogSphere.git
cd BlogSphere/BlogSphere.API
dotnet watch run
```

Use the local URL shown in the terminal to test your API with Postman. The port can vary between environments.

## 🗺️ Roadmap

* [x] Set up ASP.NET Core Web API
* [x] Create the blog post model
* [x] Implement GET endpoints
* [x] Implement POST endpoint
* [x] Implement PUT endpoint
* [x] Implement DELETE endpoint
* [ ] Integrate SQL Server
* [ ] Add Entity Framework Core
* [ ] Build a responsive Angular frontend
* [ ] Connect Angular with the backend API
* [ ] Add validation and error handling
* [ ] Implement user authentication
* [ ] Deploy the full-stack application

## 🎯 Project Goals

* Build a complete full-stack application from scratch.
* Understand RESTful API design and HTTP methods.
* Learn database integration and persistence.
* Practice clean, maintainable code.
* Gain hands-on experience with Angular and .NET.

## 👨‍💻 Author

<p align="center">
  <strong>Ayush Srivastava</strong>
  <br />
  Aspiring Full-Stack Developer
  <br /><br />
  <a href="https://github.com/ayushsrivastava-01">
    <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github" alt="GitHub Profile" />
  </a>
</p>

---

<p align="center">
  ⭐ If you find this project interesting, consider giving it a star!
  <br />
  <em>Building today. Improving every day.</em>
</p>
