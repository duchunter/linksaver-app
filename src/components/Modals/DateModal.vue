<template>
  <!-- Date time selector -->
  <div class="modal fade" role="dialog" id="date-picker-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <button type="button"
                  class="close"
                  data-dismiss="modal">
            &times;
          </button>
          <h4 class="modal-title">{{title}}</h4>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">From:</label>
              <div class="col-sm-7">
                <input type="date"
                       class="form-control"
                       v-model="picker[target].from">
              </div>
            </div>
          </div>

          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">To:</label>
              <div class="col-sm-7">
                <input type="date"
                       class="form-control"
                       v-model="picker[target].to">
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-primary" data-dismiss="modal">Done</button>
          <button class="btn btn-danger" @click="reset">Reset</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'DateModal',
  props: ['title', 'picker'],
  data() {
    return {
      target: this.title == 'Added' ? 'added' : 'lastedit',
    }
  },

  watch: {
    title: function (newTitle, oldTitle) {
      this.target = newTitle == 'Added' ? 'added' : 'lastedit';
    }
  },

  methods: {
    reset() {
      Object.keys(this.picker[this.target]).forEach(key => {
        this.picker[this.target][key] = null;
      });
    },
  }
}
</script>

<style scoped>

</style>
