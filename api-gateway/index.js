const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
    "/users",
    createProxyMiddleware({
        target:"http://user-service:3001",
        changeOrigin:true
    })
);

app.use(
    "/courses",
    createProxyMiddleware({
        target:"http://course-service:3002",
        changeOrigin:true
    })
);

app.use(
    "/krs",
    createProxyMiddleware({
        target:"http://krs-service:3003",
        changeOrigin:true
    })
);

app.listen(5000, () => {
    console.log("API Gateway berjalan di port 5000");
});