<template>
  <div class="main-container">
    <status-bar :status="status"
                @hide-status="hideStatus"
                id="status-bar"
                class="collapse"/>
    <app-nav/>

    <transition name="mode" mode="out-in">
      <info-page v-if="mode == 'info'" :actionLogs="actionLogs"/>
      <links-table v-if="mode != 'info'"
                   :mode="mode"
                   :tempLinks="tempLinks"
                   :mainLinks="mainLinks"
                   :deleteId="deleteId"
                   :changeId="linkChanges.id"/>
    </transition>

    <link-info :infoMode="infoMode" :linkData="linkData"/>
    <bottom-nav/>

    <div class="button-group" id="scroll-group">
      <!-- Back to top -->
      <button id="back-to-top" class="btn btn-danger" @click=backToTop>
        ^
      </button>

      <br />

      <!-- Go to bot -->
      <button id="go-to-bot" class="btn btn-info" @click=goToBot>
        v
      </button>
    </div>
  </div>
</template>

<script>
import AppNav from './AppNav';
import LinksTable from './LinksTable';
import InfoPage from './InfoPage';
import StatusBar from './StatusBar';
import LinkInfo from './LinkInfo';
import BottomNav from './BottomNav';

export default {
  name: 'Dashboard',
  components: {
    AppNav,
    BottomNav,
    LinksTable,
    InfoPage,
    StatusBar,
    LinkInfo,
  },

  data() {
    return {
      mode: 'info',
      actionLogs: [],
      status: {
        code: '',
        msg: '',
      },

      infoMode: '',
      linkData: {
        link: '',
        title: '',
        tags: [],
        added: 0,
        doc: '',
        rating: '',
        read: '',
        edit: '',
        lastedit: 0,
        report: '',
        relation: '',
        lib: '',
        origin: ''
      },

      tempLinks: [],
      mainLinks: [],
      linkChanges: { id: 0 },
      deleteId: 0,
    }
  },

  mounted() {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });

    $(window).on('scroll', () => {
      // Back to top
      if ($(document).scrollTop() > 20) {
        $('#back-to-top').css('visibility', 'visible');
      } else {
        $('#back-to-top').css('visibility', 'hidden');
      }

      // Go to bot
      let height = $('html, body').prop("scrollHeight");
      let winHeight = $(window).height();

      if ($(document).scrollTop() < height - winHeight) {
        $('#go-to-bot').css('visibility', 'visible');
      } else {
        $('#go-to-bot').css('visibility', 'hidden');
      }
    });
  },

  methods: {
    // Toggle status bar
    hideStatus() {
      $('#status-bar').collapse('hide');
    },

    showStatus(code, msg) {
      this.status = { code, msg }
      this.actionLogs.unshift({
        code,
        content: `${code} : ${msg}`,
      });
      $('#status-bar').collapse('show');
      setTimeout(this.hideStatus, 1500);
    },

    // Scroll back to top
    backToTop(e) {
      $('html, body').animate({scrollTop : 0}, 200);
    },

    // Scroll to bot
    goToBot(e) {
      $('html, body').animate({
        scrollTop: $('html, body').prop("scrollHeight")
      }, 300);
    },
  },

}
</script>

<style>

a {
  cursor: pointer;
}

.mode-enter-active, .mode-leave-active {
  transition: opacity .3s ease;
}
.mode-enter, .mode-leave-to {
  opacity: 0;
}

.main-container {
  padding-top: 50px;
  padding-bottom: 50px;
}

#scroll-group {
  position: fixed;
  bottom: 2vh;
  right: 2vw;
  z-index: 99;
  display: block;
}

#back-to-top {
  visibility: hidden;
  margin-bottom: 0.5vh;
}

#go-to-bot {
  visibility: visible;
}

</style>
