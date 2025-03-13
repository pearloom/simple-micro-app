// 由于每个子应用都需要一个独立的沙箱，所以我们通过class创建一个类：SandBox，当一个新的子应用被创建时，就创建一个新的沙箱与其绑定。
export default class SandBox {
  // 沙箱是否在运行
  active = false;
  // 代理的对象
  microWindow = {};
  // 新添加的属性 在卸载时清空
  injectedKeys = new Set();

  constructor() {
    this.proxyWindow = new Proxy(this.microWindow, {
      // 设置变量
      set: (target, key, value) => {
        // 沙箱只有在运行时才允许设置新变量
        if (this.active) {
          Reflect.set(target, key, value);
          this.injectedKeys.add(key);
        }
        return true;
      },
      get: (target, key) => {
        // 优先从代理对象上取值
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key);
        }
        // 否则兜底到window对象上取值
        const rawValue = Reflect.get(window, key);

        // 如果兜底的值为函数，则需要绑定window对象，如：console、alert等
        if (typeof rawValue === "function") {
          const valueStr = rawValue.toString();

          //  排除构造函数
          if (
            !/^function\s+[A-Z]/.test(valueStr) &&
            !/^class\s+/.test(valueStr)
          ) {
            return rawValue.bind(window);
          }
        }

        return rawValue;
      },
      deleteProperty: (target, key) => {
        // 当前key存在于代理对象上时才满足删除条件
        if (target.hasOwnProperty(key)) {
          return Reflect.deleteProperty(target, key);
        }
        return true;
      },
    });
  }

  start() {
    if (!this.active) {
      this.active = true;
    }
  }

  stop() {
    if (this.active) {
      this.active = false;

      this.injectedKeys.forEach((key) => {
        Reflect.deleteProperty(this.microWindow, key);
      });

      this.injectedKeys.clear();
    }
  }

  // 修改js作用域
  //   (function(window, self) {
  //   with(window) {
  //     子应用的js代码
  //   }
  // }).call(代理对象, 代理对象, 代理对象)
  // 修改js作用域
  bindScope(code) {
    window.proxyWindow = this.proxyWindow;
    var a = `;(function(window, self){with(window){;${code}\n}}).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`;

    console.log(a)
    return `;(function(window, self){with(window){;${code}\n}}).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`;
  }
}
