const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const htmlToPdf = require("electron-html-to");
const writeFileAsync = util.promisify(fs.writeFile);

function generateHTML(githubUserData) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      body {
        background-color: green;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="card">
          <div class="card">
            <div class="image"><img src="${githubUserData.avatar}" height="150px" width="150px" alt="Profile Image"></div>
            <h1 class="name">Hi! My name is ${githubUserData.name}</h1>
            <div class="location">
            <a href="https://www.google.com/maps/place/${githubUserData.location}"><i class="fas fa-map-marked-alt"></i>${githubUserData.location}</a>
           
            </div>
            <div class="githublink">
            <a href="${githubUserData.githubLink}"><i class="fab fa-github"></i>Github</a>
            </div>
            <div class="blog">
            <a href="${githubUserData.blogLink}"><i class="fas fa-blog"></i>Blog</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
       <br />
        <div class="bio">${githubUserData.bio}</div>
      </div>
       <br />
      <div class="row">
        <div class="card publicRepos">Number of public repositories ${githubUserData.repos}</div>
        <div class="card followers">Followers ${githubUserData.followers}</div>
        <div class="card githubStars">Github Stars ${githubUserData.starsLength}</div>
        <div class="card following">Following ${githubUserData.following}</div>
      </div>
    </div>
     <script
      src="https://kit.fontawesome.com/2308dc1f41.js"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

`;
}

inquirer
  .prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your GitHub username:"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    }
  ])
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}`;
    axios.get(queryUrl).then(function(res) {
      const a = res.data;
      const name = a.name;
      const avatar = a.avatar_url;
      const githubUser = a.login;
      const location = a.location;
      const githubLink = a.html_url;
      const blogLink = a.blog;
      const bio = a.bio;
      const repos = a.public_repos;
      const followers = a.followers;
      const following = a.following;
      const queryUrlStars = `https://api.github.com/users/${username}/starred`;
      axios.get(queryUrlStars).then(function(stars) {
        const starsLength = stars.data.length;
        const githubUserData = {
          name,
          avatar,
          githubUser,
          location,
          githubLink,
          blogLink,
          bio,
          repos,
          followers,
          following,
          starsLength
        };
        const html = generateHTML(githubUserData);
        console.log(html);
      });
    });
  });
// .then(function() {
//   let htmlString = fs.readFile("profile.txt", "utf8", (err, data) => {
//     if (err) throw err;
//     conversion({ html: htmlString }, function(err, result) {
//       if (err) {
//         return console.error(err);
//       }
//       console.log(result.numberOfPages);
//       console.log(result.logs);
//       result.stream.pipe(fs.createWriteStream("profile.pdf"));
//       conversion.kill(); // necessary if you use the electron-server strategy, see below for details
//     });
//   });
// });

// promptUser()
//   .then(function(answers) {
//     const html = generateHTML(answers);

//     return writeFileAsync("index.html", html);
//   })
//   .then(function() {
//     console.log("Successfully wrote to index.html");
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
