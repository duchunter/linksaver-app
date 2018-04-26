<template>
  <!-- Date time selector -->
  <div class="modal fade" role="dialog" id="link-info-modal">
    <div class="button-group" id="scroll-group-modal">
      <!-- Back to top -->
      <button id="back-to-top-modal" class="btn btn-danger" @click=backToTop>
        ^
      </button>

      <br />

      <!-- Go to bot -->
      <button id="go-to-bot-modal" class="btn btn-info" @click=goToBot>
        v
      </button>
    </div>

    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <button type="button"
                  class="close"
                  data-dismiss="modal">
            &times;
          </button>

          <!-- Functional button -->
          <div v-if="infoMode=='info'" class="button-group">
            <!-- Clipboard -->
            <button class="btn btn-danger"
                    @click="copyToClipboard"
                    data-toggle="tooltip"
                    title="Copy to clipboard">
              <i class="fa fa-clipboard"></i>
            </button>

            <!-- Open -->
            <a class="btn btn-primary"
               :href="linkData.link"
               target="_blank"
               data-toggle="tooltip"
               title="Open in new tab">
              <i class="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Title -->
          <h4 class="modal-title">
            {{infoMode == 'add' ? 'Add new link' : linkData.title}}
          </h4>
          <br />

          <!-- Editable data -->
          <div class="form-horizontal" v-for="item in editable">
            <div class="form-group">
              <!-- Label -->
              <label class="control-label col-sm-2">
                {{item[0].toUpperCase() + item.slice(1)}}:
              </label>

              <div class="col-sm-8">
                <!-- Add mode -->
                <input v-if="infoMode == 'add'"
                       type="text" class="form-control"
                       v-model="newLink[item]">

                <!-- Info mode -->
                <div v-if="infoMode == 'info'
                           && !editCheckbox[item]
                           && item != 'doc'"
                     class="form-control">
                  {{linkData[item]}}
                </div>

                <textarea rows="5"
                          readonly
                          v-if="infoMode == 'info'
                                && !editCheckbox[item]
                                && item == 'doc'"
                          class="form-control"
                          v-model="linkData[item]">
                </textarea>

                <!-- Edit mode -->
                <input v-if="infoMode == 'info'
                             && editCheckbox[item]
                             && item != 'doc'"
                       type="text"
                       class="form-control"
                       v-model="linkChanges[item]">

                <textarea rows="5"
                          v-if="infoMode == 'info'
                                && editCheckbox[item]
                                && item == 'doc'"
                          class="form-control"
                          v-model="linkChanges[item]">
                </textarea>
              </div>

              <!-- Edit button -->
              <div v-if="infoMode == 'info'" class="col-sm-1">
                <button v-if="!editCheckbox[item]"
                        @click="setEdit(item)"
                        class="btn btn-primary">
                  Edit
                </button>
                <button v-if="editCheckbox[item]"
                        @click="setEdit(item)"
                        class="btn btn-danger">
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Fixed data -->
          <div v-if="infoMode=='info'"
               class="form-horizontal"
               v-for="item in fixed">

            <div class="form-group">
              <label class="control-label col-sm-2">
                {{item[0].toUpperCase() + item.slice(1)}}:
              </label>

              <div class="col-sm-8">
                <div class="form-control">
                  {{
                    item == 'origin'
                      ? linkData[item]
                      : parseDate(linkData[item])
                  }}
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button v-if="infoMode == 'add'"
                  class="btn btn-primary"
                  @click="addNewLink">
            Add
          </button>
          <button v-if="infoMode == 'add'"
                  class="btn btn-warning"
                  @click="discardNewLink">
            Discard
          </button>
          <button class="btn btn-info"
                  data-dismiss="modal">
            Close
          </button>
          <button v-if="Object.keys(linkChanges) != 0"
                  @click="editlinkInfo"
                  class="btn btn-primary">
            Submit changes
          </button>
          <button v-if="infoMode == 'info' && linkData.origin == 'none'"
                  @click="setDeleteMode('demote')"
                  data-toggle="collapse"
                  data-target="#are-you-sure"
                  class="btn btn-warning">
            Demote
          </button>
          <button v-if="infoMode=='info' && linkData.origin != 'none'"
                  @click="setDeleteMode('promote')"
                  data-toggle="collapse"
                  data-target="#are-you-sure"
                  class="btn btn-success">
            Promote
          </button>
          <button v-if="infoMode == 'info'"
                  data-toggle="collapse"
                  data-target="#are-you-sure"
                  @click="setDeleteMode('delete')"
                  class="btn btn-danger">
            Delete
          </button>
          <div class="collapse" id="are-you-sure">
            <p>Are you sure ?</p>
            <button class="btn btn-primary"
                    v-if="deleteMode == 'delete'"
                    @click="deleteLink">
              <i class="fa fa-check"></i> Yes
            </button>
            <button class="btn btn-primary"
                    v-if="deleteMode != 'delete'"
                    @click="adjustLink">
              <i class="fa fa-check"></i> Yes
            </button>
            <button class="btn btn-danger"
                    data-toggle="collapse"
                    data-target="#are-you-sure">
              <i class="fa fa-times"></i> No
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addLink, editLink, adjustLink, deleteLink } from '../../../utils/api';

export default {
  name: 'LinkInfo',
  props: ['infoMode', 'linkData'],
  data() {
    return {
      editable: [
        'link', 'title', 'tags', 'doc', 'rating', 'read',
        'edit', 'report', 'relation', 'lib'
      ],

      fixed: ['added', 'lastedit', 'origin'],

      editCheckbox: {
        link: false,
        title: false,
        tags: false,
        doc: false,
        rating: false,
        read: false,
        edit: false,
        report: false,
        relation: false,
        lib: false,
      },

      newLink: {
        link: '',
        title: '',
        tags: '',
        doc: '',
        rating: '',
        read: '',
        edit: '',
        report: '',
        relation: '',
        lib: '',
      },

      linkChanges: {},
      deleteMode: '',
    }
  },

  mounted() {
    $('#link-info-modal').on('hidden.bs.modal', () => {
      this.discardChanges();
      $('#are-you-sure').collapse('hide');
      $('textarea').css('height', '15vh');
    });

    $('#link-info-modal').on('scroll', () => {
      // Back to top
      if ($('#link-info-modal').scrollTop() > 20) {
        $('#back-to-top-modal').css('visibility', 'visible');
      } else {
        $('#back-to-top-modal').css('visibility', 'hidden');
      }

      // Go to bot
      let height = $('#link-info-modal').prop("scrollHeight");
      let winHeight = $(window).height();
      if ($('#link-info-modal').scrollTop() < height - winHeight) {
        $('#go-to-bot-modal').css('visibility', 'visible');
      } else {
        $('#go-to-bot-modal').css('visibility', 'hidden');
      }
    });

    $('#are-you-sure').on('show.bs.collapse', () => {
      $("#link-info-modal").animate({
        scrollTop: $('#link-info-modal').prop("scrollHeight")
      }, 400);
    });
  },

  methods: {
    // Scroll back to top
    backToTop(e) {
      $("#link-info-modal").animate({
        scrollTop: 0
      }, 200);
    },

    // Scroll to bot
    goToBot(e) {
      $("#link-info-modal").animate({
        scrollTop: $('#link-info-modal').prop("scrollHeight")
      }, 300);
    },

    // Handling checkbox
    setEdit(item) {
      if (!this.editCheckbox[item]) {
        this.linkChanges[item] = this.linkData[item];
      } else {
        delete this.linkChanges[item];
      }

      this.editCheckbox[item] = !this.editCheckbox[item];
    },

    // Set delete mode for yes button of are-you-sure
    setDeleteMode(mode) {
      this.deleteMode = mode;
    },

    // Trigger alert
    triggerAlert(code, msg) {
      this.$parent.showStatus(code, msg);
    },

    // Copy to clipboard
    copyToClipboard() {
      let temp = $("<input>");
      $("body").append(temp);
      temp.val(this.linkData.link).select();
      document.execCommand("copy");
      temp.remove();
    },

    // Parse time string to date
    parseDate(time) {
      if (!time) return 'none';
      const date = new Date(parseInt(time));
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },

    // Clear data in add mode
    discardNewLink() {
      Object.keys(this.newLink).forEach(key => {
        this.newLink[key] = '';
      });
    },

    // Clear all changes
    discardChanges() {
      let keys = Object.keys(this.linkChanges)
      if (keys.length != 0) {
        keys.forEach(key => {
          delete this.linkChanges[key];
          this.editCheckbox[key] = false;
        });
      }
    },

    // Add link
    addNewLink() {
      addLink(this.newLink, false).then((res) => {
        this.triggerAlert(res.status, res.data);
      }).catch((err) => {
        this.triggerAlert(err.response.status, err.response.data);
      });
    },

    // Edit link info
    editlinkInfo() {
      let mode = this.$parent.mode;
      editLink({
        id: this.linkData.id,
        table: mode[0].toUpperCase() + mode.slice(1),
        changes: this.linkChanges,
        link: this.linkData.link
      })
      .then(res => {
        this.triggerAlert(res.status, res.data);

        // Clear old changes
        Object.keys(this.$parent.linkChanges).forEach(key => {
          delete this.$parent.linkChanges[key];
        });

        // Apply changes to current linkData and source data in table
        Object.keys(this.linkChanges).forEach(key => {
          this.linkData[key] = this.linkChanges[key];
          this.$parent.linkChanges[key] = this.linkChanges[key];
        });

        this.$parent.linkChanges.id = this.linkData.id;
        this.discardChanges();
      })
      .catch(err => {
        this.triggerAlert(err.response.status, err.response.data);
      });
    },

    // Promote or demote link
    adjustLink() {
      adjustLink({
        promote: this.deleteMode == 'promote',
        id: this.linkData.id,
      })
      .then(res => {
        this.triggerAlert(res.status, res.data);

        // Delete source data in table
        this.$parent.deleteId = 0;
        this.$parent.deleteId = this.linkData.id;

        // Hide this modal
        $('#link-info-modal').modal('hide');
      })
      .catch(err => {
        this.triggerAlert(err.response.status, err.response.data);
      });
    },

    deleteLink() {
      let mode = this.$parent.mode;

      deleteLink({
        table: mode[0].toUpperCase() + mode.slice(1),
        id: this.linkData.id,
        link: this.linkData.link,
      })
      .then(res => {
        this.triggerAlert(res.status, res.data);

        // Delete source data in table
        this.$parent.deleteId = 0;
        this.$parent.deleteId = this.linkData.id;

        // Hide this modal
        $('#link-info-modal').modal('hide');
      })
      .catch(err => {
        this.triggerAlert(err.response.status, err.response.data);
      });
    },
  },
}
</script>

<style scoped>

textarea {
  resize: vertical;
}

.modal-title {
  word-wrap: break-word;
  text-align: center;
}

.modal-footer {
  text-align: center;
}

.modal-header, .modal-footer {
  background-color: #eeeeee;
}

.form-control {
  word-wrap: break-word;
  overflow-y: scroll;
}

#are-you-sure {
  margin-top: 5px;
  background-color: #eeeeee;
}

#are-you-sure button {
  margin-bottom: 6px;
}

#scroll-group-modal {
  position: fixed;
  bottom: 2vh;
  right: 2vw;
  z-index: 99;
  display: block;
}

#back-to-top-modal {
  visibility: hidden;
  margin-bottom: 0.5vh;
}

#go-to-bot-modal {
  visibility: visible;
}

</style>
