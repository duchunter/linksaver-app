<template>
  <div class="container-fluid">
    <ul class="nav navbar-nav">
      <li>
        <a id="status-content"
           href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes"
           target="_blank">
          {{displayMsg}}
        </a>
      </li>
      <li class="pull-right">
        <a id="close">
          <button @click="hideStatus" class="close">
            &times;
          </button>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  props: ['status'],
  data() {
    return {

    }
  },

  computed: {
    displayMsg() {
      let statusCode = this.status.code;

      // Set color
      if (statusCode >= 400) {
        $('#status-content').css('color', 'red');
      } else {
        $('#status-content').css('color', 'lightgreen');
      }

      // Set content
      if (statusCode == 401) return `401: Unauthorized`;
      if (statusCode == 403) return `403: Forbidden`;
      return `${statusCode}: ${this.status.msg}`;
    }
  },

  methods: {
    hideStatus() {
      this.$emit('hide-status');
    }
  },
}
</script>

<style scoped>

li {
  float: none;
  display: inline-block;
}

.container-fluid {
  background-color: #212121;
  position: fixed;
  top: 0;
  z-index: 10000;
  width: 100%;
}

.navbar-nav {
  width: 100%;
  text-align: center;
}

.close {
  color: white;
}

#status-content {
  color: lightgreen;
}

#status-content:hover, #close:hover {
  background: none;
}

</style>
