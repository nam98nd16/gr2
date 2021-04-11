module.exports = {
  apps: [
    {
      name: "server",
      script: "bin/www",
      watch: true,
      env: {
        NODE_ENV: "aws",
      },
    },
  ],
};
