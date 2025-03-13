import CreateApp, { appInstanceMap } from "./app";

class MyElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "url"];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("micro-app is connected");

    // 创建微应用实例
    const app = new CreateApp({
      name: this.name,
      url: this.url,
      container: this,
    });

    console.log('app', app)

    // 记入缓存 用于后续功能
    appInstanceMap.set(this.name, app);
  }

  disconnectedCallback() {
    console.log("micro-app is disconnected", this.hasAttribute('destory'));
    const app = appInstanceMap.get(this.name);

    app.unmount(this.hasAttribute('destory'));

    console.log('app', app)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);

    // 分别记录 name 及 url 的值
    if (name === "name" && !this.name && newValue) {
      this.name = newValue;
    } else if (name === "url" && !this.url && newValue) {
      this.url = newValue;
    }
  }
}

export function defineElement() {
  if (!window.customElements.get("micro-app")) {
    window.customElements.define("micro-app", MyElement);
  }
}
