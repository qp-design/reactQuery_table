const CracoLessPlugin = require("craco-less");
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#f00" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    // 配置别名,可以直接从根目录下面开始查找文件
    alias: {
      "@": resolve("src"),
      "components": resolve("src/components")
    }
  }
};
