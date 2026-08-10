import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecom App API",
      version: "1.0.0",
      description: "API documentation for the e-commerce backend",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  // Scans all files in app/api for special comment blocks (we'll add these per-route)
  apis: ["./src/app/api/**/*.ts"],
});

export default swaggerSpec;