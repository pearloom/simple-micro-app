import loadHtml from "./source";

export const appInstanceMap = new Map();

export default class CreateApp {
  constructor({ name, url, container }) {
    this.name = name;
    this.url = url;
    this.container = container;
    this.status = "loading";
    loadHtml(this);
    this.loadCount = 0;
  }

  // created loading mount unmount
  status = "created";

  source = {
    // link 元素对应的静态资源
    links: new Map(),
    // script 元素对应的静态资源
    scripts: new Map(),
  };

  // 资源加载完时执行
  onLoad(htmlDom) {
    this.loadCount = this.loadCount ? this.loadCount + 1 : 1;

    if (this.loadCount === 2 && this.status !== "unmount") {
      this.source.html = htmlDom;
      this.mount();
    }
  }

  // 资源加载完成后进行渲染
  mount() {
    const cloneHtml = this.source.html.cloneNode(true);

    const fragment = document.createDocumentFragment();

    Array.from(cloneHtml.childNodes).forEach((node) => {
      fragment.appendChild(node);
    });

    this.container.appendChild(fragment);

    // 执行js
    this.source.scripts.forEach((info) => {
      (0, eval)(info.code);
    });

    this.status = "mounted";
  }

  // 卸载应用 执行关闭沙箱 清空缓存等操作
  unmount() {}
}
