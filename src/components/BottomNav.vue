<template>
  <div>
    <nav class="navbar navbar-fixed-bottom">
      <div class="container-fluid">
        <button @click="setMode('info')">Info</button>
        <button @click="setMode('main')">Main</button>
        <button @click="setMode('temp')">Temp</button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'BottomNav',
  methods: {
    setMode(mode) {
      this.$parent.mode = mode;
      this.hideNav();
      this.hideSearch();
    },
  }
}
</script>

<style scoped>

button {
  height: 50px;
  width: 33.33%;
  float: left;
  border-radius: 0;
  border: 0;
  background-color: #030303;
  color: white;
}

.navbar-fixed-top {
  border: 0;
  text-align: center;
}

.container-fluid {
  margin: 0;
  padding: 0;
}

</style>
