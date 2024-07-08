const http = require("http");
const { v4 } = require("uuid");
const url = require("url");
const { read_file, write_file } = require("./fs/fs_api");
const options = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

let app = http.createServer((req, res) => {
  course_id = req.url.split("/")[2];

  if (req.method === "GET") {
    if (req.url === "/courses") {
      let courses = read_file("courses.json");
      res.writeHead(200, options);
      res.end(JSON.stringify(courses));
    }

    if (req.url === `/get_one_course/${course_id}`) {
      let foundedCourse = read_file("courses.json").find(
        (c) => c.id === course_id
      );
      if (!foundedCourse) {
        res.writeHead(404, options);
        return res.end(
          JSON.stringify({
            msg: "Course Not found!",
          })
        );
      }

      res.writeHead(200, options);
      res.end(JSON.stringify(foundedCourse));
    }
  }

  if (req.method === "DELETE") {
    if (req.url === `/delete_course/${course_id}`) {
      let courses = read_file("courses.json");

      let foundedCourse = courses.find((c) => c.id === course_id);

      if (!foundedCourse) {
        res.writeHead(404, options);
        return res.end(
          JSON.stringify({
            msg: "Course not found!",
          })
        );
      }

      courses.forEach((course, idx) => {
        if (course.id === course_id) {
          courses.splice(idx, 1);
        }
      });

      write_file("courses.json", courses);

      res.writeHead(200, options);
      res.end(
        JSON.stringify({
          msg: "Course Deleted!",
        })
      );
    }
  }

  if (req.method === "PUT") {
    if (req.url === `/update_course/${course_id}`) {
      req.on("data", (new_course) => {
        let newCourse = JSON.parse(new_course);
        let { title, price, author } = newCourse;

        let courses = read_file("courses.json");

        let foundedCourse = courses.find((c) => c.id === course_id);

        if (!foundedCourse) {
          res.writeHead(404, options);
          return res.end(
            JSON.stringify({
              msg: "Course not found!",
            })
          );
        }

        courses.forEach((course, idx) => {
          if (course.id === course_id) {
            course.title = title ? title : course.title;
            course.price = price ? price : course.price;
            course.author = author ? author : course.author;
          }
        });

        write_file("courses.json", courses);

        res.writeHead(200, options);
        res.end(
          JSON.stringify({
            msg: "Course Updated!",
          })
        );
      });
    }
  }

  if (req.method === "POST") {
    if (req.url === "/create_course") {
      req.on("data", (chunk) => {
        let data = JSON.parse(chunk);

        let courses = read_file("courses.json");

        courses.push();

        courses = [
          ...courses,
          {
            id: v4(),
            ...data,
          },
        ];
        write_file("courses.json", courses);
        res.writeHead(201, options);
        res.end(
          JSON.stringify({
            msg: "Created Course!",
          })
        );
      });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on the 3000");
});
