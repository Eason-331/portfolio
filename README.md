# ETH Zürich 学生作品集

一个用于求职和展示学术经历、技能与技术项目的双语作品集。默认入口为英文，德文位于 `de/`。两种语言均生成完整的静态 HTML。主题默认为深色，切换后会在当前浏览器中保留。网站使用 HTML、CSS 和原生 JavaScript，Node.js 仅用于构建、预览和测试。

## 本地构建与预览

使用 Node.js 20 或更高版本。构建不需要安装 npm 依赖。

```sh
npm test
npm run preview
```

在浏览器打开 `http://127.0.0.1:4173/`，或使用 `/de/` 查看德文版。`npm test` 会先构建到 `dist/`，然后检查两种语言的页面结构、章节锚点、静态资源、PDF 下载及 GitHub Pages 子路径兼容性。

## 修改内容

| 要修改的内容 | 文件或字段 |
| --- | --- |
| 姓名、邮箱、GitHub 和 LinkedIn | `src/content.mjs` 中的 `profile` |
| 英文与德文简介、经历、技能和教育 | `src/content.mjs` 中的 `content.en` 与 `content.de` |
| 项目名称、技术栈、仓库地址与演示地址 | 两种语言的 `projects.items` 中的 `title`、`description`、`tags`、`repository` 和 `demo` |
| PDF 简历 | 替换 `src/assets/cv-en.pdf` 与 `src/assets/cv-de.pdf`，将对应语言的 `cv.template` 改为 `false` |
| 配色、排版与断点 | `src/assets/site.css` |

项目和社交地址使用完整的 HTTPS URL。留空时，对应链接不会显示。方括号标明待补充的信息。发布前可用 `src/content.mjs` 检查两种语言的占位内容，确认简历 PDF 和网页文案相符。填写真实邮箱和资料后，GitHub Pages 访客即可查看这些公开信息。

## 免费部署到 GitHub Pages

1. 将源代码放入一个公开 GitHub 仓库，默认分支为 `main`。
2. 在仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 将作品集提交合并到 `main`。已合并的代码也可以在 **Actions → Build and deploy to GitHub Pages** 中手动运行。
4. 部署成功后，打开部署任务提供的链接。项目站点通常为 `https://<用户名>.github.io/<仓库名>/`，名为 `<用户名>.github.io` 的用户站点则使用站点根路径。站内资源和语言链接均使用相对路径。

工作流会在 Pull Request 上运行构建测试，在 `main` 分支上传并部署 `dist/`。公开仓库可使用 GitHub Free 的 Pages 托管。[GitHub Pages 配置文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 文件结构

```text
src/
  content.mjs          双语文案和个人资料
  page.mjs             两种语言共用的页面模板
  assets/              样式、浏览器脚本、字体、图片与 PDF
scripts/
  build.mjs            生成静态网页
  preview.mjs          启动本地预览
  site.test.mjs        检查静态构建
.github/workflows/     PR 检查与 Pages 部署
```

首屏地形插图由 ImageGen 生成，采用深蓝背景、紫色等高线和瑞士阿尔卑斯山主题。Inter 和 IBM Plex Mono 字体随网站本地托管，许可文件与字体一起保存在 `src/assets/`。

<details>
<summary>首屏插图的生成信息</summary>

插图保存为 `src/assets/alpine-contours.webp`，使用内置 ImageGen。生成提示词如下。

> Wide 3:2 landscape hero artwork for a high-end student engineering portfolio. A dramatic Swiss Alpine mountain massif rendered as an intricate, luminous topographic wire sculpture, thousands of precise thin contour lines flowing horizontally across the ridges. Entire image deep midnight blue and black, with subtly luminous icy violet and periwinkle lines, strongest highlights on the summits. The mountain is three-dimensional, rising toward the middle and right, fully inside the composition. Very dark navy negative space in the top and extreme edges, soft fading contour traces in the foreground and a nearly invisible engineering grid. Refined and minimalist editorial 3D visualization, detailed geological folds, crisp fine lines, restrained luminance, no stars, no text, no letters, no labels, no UI, no border. Design for compression and use behind no text.

</details>
