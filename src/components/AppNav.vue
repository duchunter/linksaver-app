<template>
  <div>
    <!-- Nav bar -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <!-- Brand -->
          <a class="navbar-brand">Link saver</a>

          <!-- Add link button -->
          <button id="add-link"
                  class="btn btn-danger"
                  @click="addLink"
                  data-toggle="modal"
                  data-target="#link-info-modal">
            Add new link
          </button>

          <!-- Collapse menu -->
          <button class="navbar-toggle collapsed"
                  data-toggle="collapse" data-target="#navbar"
                  aria-expanded="false"
                  aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>

        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a @click="">Check token</a></li>
            <li><a @click="login">Login</a></li>
            <li><a @click="">Update</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import SearchBar from './SearchBar';
import { isLoggedIn, login } from '../../utils/auth';

export default {
  name: 'app-nav',
  props: [],
  components: {
    SearchBar,
  },

  mounted() {
    $('.navbar-collapse a:not(.dropdown-toggle)').click(function(){
        $(this).parents('.navbar-collapse').collapse('hide');
    });
  },

  methods: {
    login,
    hideNav() {
      $('#navbar').collapse('hide');
    },

    addLink() {
      this.hideNav();
      this.$parent.infoMode = 'add';
    }
  },
};
</script>

<style scoped>
/*
 * Top navigation
 * Hide default border to remove 1px line.
 */
.navbar-fixed-top {
  border: 0;
}

#add-link{
  height: 50px;
  margin-left: 5px;
}

#navbar {
  text-align: center;
}

</style>
