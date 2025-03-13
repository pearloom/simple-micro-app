<template>
  <div id="app">
    <div @click="toggleMicroApp" class="toggle-btn text-red">展示/隐藏</div>
    <div class="flex">
      <div class="square">block</div>
      <micro-app
        class="flex-1"
        v-if="showapp"
        name="app"
        url="http://localhost:3001/react18/"
      ></micro-app>
    </div>
  </div>
</template>

<script>

window.globalStr = 'parent'
export default {
  name: "App",

  data() {
    return {
      showapp: true,
      data: {},
    };
  },

  methods: {
    toggleMicroApp() {
      this.showapp = !this.showapp;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.toggle-btn {
  height: 40px;
  width: 100px;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  user-select: none;
}

.flex {
  display: flex;
  width: 100%;
}

.flex-1 {
  flex: 1;
}

.text-red {
  color: blue;
}

.square {
  width: 100px;
  height: 600px;
  background-color: aliceblue;
}
</style>
