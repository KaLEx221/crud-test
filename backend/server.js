require("dotenv").config();

const http = require("http");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // HOME
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      message: "CRUD API is working!"
    }));

    return;
  }

  // GET USERS
  if (req.method === "GET" && req.url === "/users") {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id");

    if (error) {
      console.log("GET ERROR:", error);

      res.writeHead(500, {
        "Content-Type": "application/json"
      });

      res.end(JSON.stringify({
        error: error.message
      }));

      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));

    return;
  }

  // POST USER
  if (req.method === "POST" && req.url === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { name, email } = JSON.parse(body);

        console.log("Trying to insert:", name, email);

        const { data, error } = await supabase
          .from("users")
          .insert({
            name: name,
            email: email
          })
          .select();

    if (error) {
  console.log("SUPABASE INSERT ERROR:", error);

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    error: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  }));

  return;
}

        console.log("USER CREATED:", data);

        res.writeHead(201, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify(data));

      } catch (err) {
        console.log("REQUEST ERROR:", err);

        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: "Invalid request"
        }));
      }
    });

    return;
  }

  // PUT USER
  if (
    req.method === "PUT" &&
    req.url.startsWith("/users/")
  ) {
    const id = req.url.split("/")[2];

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { name, email } = JSON.parse(body);

        const { data, error } = await supabase
          .from("users")
          .update({
            name: name,
            email: email
          })
          .eq("id", id)
          .select();

        if (error) {
          console.log("UPDATE ERROR:", error);

          res.writeHead(500, {
            "Content-Type": "application/json"
          });

          res.end(JSON.stringify({
            error: error.message
          }));

          return;
        }

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify(data));

      } catch (err) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: "Invalid request"
        }));
      }
    });

    return;
  }

  // DELETE USER
  if (
    req.method === "DELETE" &&
    req.url.startsWith("/users/")
  ) {
    const id = req.url.split("/")[2];

    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.log("DELETE ERROR:", error);

      res.writeHead(500, {
        "Content-Type": "application/json"
      });

      res.end(JSON.stringify({
        error: error.message
      }));

      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));

    return;
  }

  // NOT FOUND
  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    error: "Route not found"
  }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
