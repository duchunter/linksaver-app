<template>
  <!-- Date time selector -->
  <div class="modal fade" role="dialog" id="rating-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <button type="button"
                  class="close"
                  data-dismiss="modal">
            &times;
          </button>
          <h4 class="modal-title">Rating</h4>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- From -->
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">From:</label>
              <div class="col-sm-7">
                <input type="input" class="form-control" v-model="from">
              </div>
            </div>
          </div>

          <!-- To -->
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">To:</label>
              <div class="col-sm-7">
                <input type="input" class="form-control" v-model="to">
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
  name: 'RatingModal',
  props: [],
  data() {
    return {
      from: '',
      to: ''
    }
  },

  mounted() {
    $('#rating-modal').on("hidden.bs.modal", () => {
      this.submit();
    });
  },

  methods: {
    reset() {
      this.from = '';
      this.to = '';
    },

    submit() {
      this.$parent.picker.rating = {
        logic: '&&',
        value: [
          {
            logic: '>=',
            value: this.from ? this.from : 0
          },
          {
            logic: '<=',
            value: this.to ? this.to : 5
          }
        ]
      }
    }
  }
}
</script>

<style scoped>



</style>
