<template>
  <div class="newplayer">
    <input type="text" v-model="username" placeholder="Enter Username" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
    };
  },
};
</script>

<style lang="less" scoped>
.newplayer {
  width: 100%;
  height: 100px;
  background: white;
  position: fixed;
  input {
    height: 50px;
    width: 90%;
    border: none;
    outline: none;
    border: 2px solid #0088ff;
    border-radius: 5px;
  }
}
</style>