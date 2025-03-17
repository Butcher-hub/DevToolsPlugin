# Vue 3 + TypeScript + Vite

一个Chrome插件，MV3版本

使用vue3 + vite + naive ui 做了一些开发过程中常使用的工具。

# 安装
推荐使用pnpm作为包管理器
```bash
pnpm install
```

# 启动
```bash
pnpm run dev
```

# 打包
```bash
pnpm run build
```
打包内容在dist目录下，在chrome扩展中，开发者模式下，加载已解压的扩展程序，选择dist目录即可


# 拓展
很简单，想要什么页面，在pages下定义组件，在router中定义即可

end.