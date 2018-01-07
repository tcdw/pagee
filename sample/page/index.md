你的 pagee 站点已经**渲染成功**！

## 添加页面

1. 在你站点项目根目录下的 `page` 文件夹中，按需创建你需要的 Markdown 或 HTML。
2. 每个 Markdown 或 HTML 文件都需要有一个相同名称的 JSON 对应，JSON 保存着页面配置信息：

```json
{
    "title": "首页",
    "description": "一个 pagee 站点",
    "template": "page"
}
```

* `title`：页面名称
* `description`：（可选）页面简介，该值会被放置到渲染后的 HTML 的 meta 标签中
* `template`：（可选）使用的页面模板，默认为 `page`，即调用模板文件夹下对应的 hbs 格式模板文件。使用 `none` 则不套用任何模板，直接输出源 HTML

你可以在 `page` 目录中嵌套多层文件夹，里面的文档都会被扫描、处理。

## 内链注意事项

编写内链时，请注意页面的层次关系，并以 `html` 作为扩展名。如果要从 `index.md` 链接到 `info/about-us.md`，则需要在 `index.md` 将链接地址填写为 `info/about-us.html`。
