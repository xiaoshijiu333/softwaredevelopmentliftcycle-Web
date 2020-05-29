<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  // created() {
  //   console.log("ssss");
  //   console.log(sessionStorage.getItem("store"));
  //   // 在页面加载时读取sessionStorage里的状态信息
  //   if (sessionStorage.getItem("store")) {
  //     this.$store.replaceState(
  //       Object.assign(
  //         {},
  //         this.$store.state,
  //         JSON.parse(sessionStorage.getItem("store"))
  //       )
  //     );
  //   }

  //   // 在页面刷新时将vuex里的信息保存到sessionStorage里
  //   // beforeunload事件在页面刷新时先触发
  //   window.addEventListener("beforeunload", () => {
  //     console.log(this.$store.state);
  //     sessionStorage.setItem("store", JSON.stringify(this.$store.state));
  //   });
  // }
};
</script>