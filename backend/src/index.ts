import http, { Server, IncomingMessage, ServerResponse } from "http";
import { parse } from "querystring";
import csv from "csv-parser";
import * as formidable from "formidable";
import cors from "cors";
import fs from "fs";

const port = process.env.PORT || 3000;
let users: User[] = [];

interface User {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const corsHandler = cors();
    corsHandler(req, res, () => {
      const { method, url } = req;

      if (req.method === "POST" && req.url === "/api/files") {
        const form = new formidable.IncomingForm();
        form.parse(req, (err: Error, fields: any, files: any) => {
          if (err) {
            console.error("Error parsing form:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "An error occurred while parsing the form",
              })
            );
            return;
          }

          if (!files.file) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "No file uploaded" }));
            return;
          }

          fs.createReadStream(files.file[0].filepath)
            .pipe(csv())
            .on("data", (row: any) => {
              users.push(row);
            })
            .on("end", () => {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "The file was uploaded successfully",
                })
              );
            })
            .on("error", (error: any) => {
              console.error("Error processing CSV:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "An error occurred while processing the CSV file",
                })
              );
            });
        });
      } else if (method === "GET" && url?.startsWith("/api/users")) {
        const query =
          (
            parse(url.split("?")[1] || "").q as unknown as string
          )?.toLowerCase() || "";
        const filteredUsers = users.filter((user) =>
          Object.values(user).some((value) =>
            String(value).toLowerCase().includes(query)
          )
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: filteredUsers }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
    });
  }
);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
