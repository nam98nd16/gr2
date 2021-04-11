module.exports = {
  apps: [
    {
      name: "gr2",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "./node_modules/nuxt/bin/nuxt.js",
      args: "start",
      env: {
        NODE_ENV: "aws"
      }
    }
  ]
};
