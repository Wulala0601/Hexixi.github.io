# HE XIXI 网站发布

线上网站：[打开 HE XIXI — Soft Error Wonderland](https://wulala0601.github.io/Hexixi.github.io/)

GitHub 仓库：[Wulala0601/Hexixi.github.io](https://github.com/Wulala0601/Hexixi.github.io)

新版源代码保存在仓库的 `wonderland/` 目录。原有素材与旧版文件保留在原位置。
工作流 `.github/workflows/pages.yml` 在 `main` 更新时安装依赖、检查代码、构建并部署到 GitHub Pages。
仓库 Settings → Pages 的发布源应为 GitHub Actions。

## 本地运行

在 `wonderland/` 中运行 `npm ci` 和 `npm run dev`。
普通本地预览使用 `/`；Pages 构建设置 `SITE_BASE_PATH=/Hexixi.github.io/`。

## 网站内容

- 薄荷粉色波点背景、互动 3D 人物与蕾丝底座。
- 四扇门与同色钥匙解锁的独立项目页。
- 粉色电脑内嵌视频、包包和模型详情入口。
- 浮动星星、爱心光标、喵子酱音乐播放器。

`public/` 中只存放网站使用的媒体，不上传本地缓存、原始作品集或私人文档。
构建会为各详情页生成入口文件，支持直接打开和刷新网址。
