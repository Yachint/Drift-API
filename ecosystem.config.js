module.exports = {
  apps: [
    {
      name: "drift_server",
      script: "./app.js",
      instances: -1,
      exec_mode: "cluster",
      watch: true,
      env: {
        PORT: process.env.PORT,
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
