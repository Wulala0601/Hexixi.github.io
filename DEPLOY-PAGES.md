# GitHub Pages 媒体部署

当前线上模型和视频返回 Git LFS 指针文本，不能直接播放。
新工作流会先取回真正的 LFS 文件，再发布网页目录，保持现有网址及 `/mint-catgirl/` 路径不变。

## 首次切换

1. 把本次修改及新增资源提交并推送到 main。必须包含 `.github/workflows/pages.yml`、`scripts/build-pages.cjs`、`mint-catgirl/models/ip-nav-fairy.glb`、`mint-catgirl/assets/portfolio/undone/film.mp4`，以及修改过的网页和脚本。新视频和模型继续使用现有 LFS 规则；不要删除 `.gitattributes`。
2. GitHub 仓库 → Settings → Pages → Build and deployment → Source，选择 **GitHub Actions**。
3. Actions → **Deploy website with media** → **Run workflow**（main）。等待 build、deploy 均成功。

网址：https://wulala0601.github.io/Hexixi.github.io/

之后 main 的每次推送会自动部署。部署产物只含 index.html、mint-catgirl 和可选 CNAME，不包含原始作品集、PSD 或根目录模型副本。无需安装前端依赖。

## 检查

本地运行 `node scripts/build-pages.cjs` 检查媒体文件并准备 `_site`。该目录已加入忽略规则，不需要提交。
工作流遇到缺失媒体、未还原的 LFS 指针或无效 GLB / MP4 会停止，避免将损坏资源部署。
如果 LFS 下载因额度或权限失败，需先处理仓库 LFS 额度/访问权限；不要跳过下载校验。

线上验证模型文件开头应为 `glTF`，MP4 第 5–8 个字节应为 `ftyp`，而不是 `version https://git-lfs.github.com/spec/v1`。
