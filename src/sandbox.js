import { EventCenterForMicroApp } from "./data";

// 记录addEventListener、removeEventListener原生方法
const rawWindowAddEventListener = window.addEventListener;
const rawWindowRemoveEventListener = window.removeEventListener;

/**
 * 重写全局事件的监听和解绑
 * @param microWindow 原型对象
 */
function effect(microWindow) {
  // 使用Map记录全局事件
  const eventListenerMap = new Map();

  // 重写addEventListener
  microWindow.addEventListener = function (type, listener, options) {
    const listenerList = eventListenerMap.get(type);
    // 当前事件非第一次监听，则添加缓存
    if (listenerList) {
      listenerList.add(listener);
    } else {
      // 当前事件第一次监听，则初始化数据
      eventListenerMap.set(type, new Set([listener]));
    }
    // 执行原生监听函数
    return rawWindowAddEventListener.call(window, type, listener, options);
  };

  // 重写removeEventListener
  microWindow.removeEventListener = function (type, listener, options) {
    const listenerList = eventListenerMap.get(type);
    // 从缓存中删除监听函数
    if (listenerList?.size && listenerList.has(listener)) {
      listenerList.delete(listener);
    }
    // 执行原生解绑函数
    return rawWindowRemoveEventListener.call(window, type, listener, options);
  };

  // 清空残余事件
  return () => {
    console.log("需要卸载的全局事件", eventListenerMap);
    // 清空window绑定事件
    if (eventListenerMap.size) {
      // 将残余的没有解绑的函数依次解绑
      eventListenerMap.forEach((listenerList, type) => {
        if (listenerList.size) {
          for (const listener of listenerList) {
            rawWindowRemoveEventListener.call(window, type, listener);
          }
        }
      });
      eventListenerMap.clear();
    }
  };
}

// 由于每个子应用都需要一个独立的沙箱，所以我们通过class创建一个类：SandBox，当一个新的子应用被创建时，就创建一个新的沙箱与其绑定。
export default class SandBox {
  // 沙箱是否在运行
  active = false;
  // 代理的对象
  microWindow = {};
  // 新添加的属性 在卸载时清空
  injectedKeys = new Set();

  constructor(appName) {
    // 创建数据通信对象
    this.microWindow.microApp = new EventCenterForMicroApp(appName);

    // 卸载钩子
    this.releaseEffect = effect(this.microWindow);

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

      // 卸载全局事件
      this.releaseEffect();

      // 清空所有绑定函数
      this.microWindow.microApp.clearDataListener()
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

    return `;(function(window, self){with(window){;${code}\n}}).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`;
  }
}
