module.exports = {
  apps: [
    {
      name: "anvar-portfolio",
      script: "dist/server.cjs",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
