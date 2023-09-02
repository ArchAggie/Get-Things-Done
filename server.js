const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8000;

const server = http.createServer((req, res) => {
	let filePath = path.join(__dirname, req.url);

	// If the request is for a directory, append "index.html" to the URL
	if (filePath.endsWith("/")) {
		filePath += "index.html";
	}

	// Set the content type based on the file extension
	let contentType = "text/html";
	const extname = path.extname(filePath);
	if (extname === ".css") {
		contentType = "text/css";
	} else if (extname === ".js") {
		contentType = "text/javascript";
	}

	const fileStream = fs.createReadStream(filePath);

	fileStream.on("error", () => {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not Found");
	});

	res.writeHead(200, { "Content-Type": contentType });
	fileStream.pipe(res);
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
