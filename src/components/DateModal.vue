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
          <!-- Mode selector: exact or range -->
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">I want:</label>
              <div class="col-sm-5">
                <select class="form-control" v-model="picker[target].mode">
                  <option value="exact">Exact date</option>
                  <option value="range">Range</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Exact -->
          <div v-if="picker[target].mode == 'exact'" class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">Date:</label>
              <div class="col-sm-7">
                <input type="date"
                       class="form-control"
                       v-model="picker[target].exact">
              </div>
            </div>
          </div>

          <!-- Range -->
          <div v-if="picker[target].mode == 'range'" class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">From:</label>
              <div class="col-sm-7">
                <input type="date"
                       class="form-control"
                       v-model="picker[target].from">
              </div>
            </div>
          </div>

          <div v-if="picker[target].mode == 'range'" class="form-horizontal">
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
  props: ['title'],
  data() {
    return {
      target: this.title == 'Added' ? 'added' : 'lastedit',
      picker: {
        added: {
          mode: '',
          exact: '',
          from: '',
          to: ''
        },

        lastedit: {
          mode: '',
          exact: '',
          from: '',
          to: ''
        }
      }
    }
  },

  watch: {
    title: function (newTitle, oldTitle) {
      this.target = newTitle == 'Added' ? 'added' : 'lastedit';
    }
  },

  mounted() {
    $('#date-picker-modal').on("hidden.bs.modal", () => {
      this.submit();
    });
  },

  methods: {
    reset() {
      Object.keys(this.picker[this.target]).forEach(key => {
        this.picker[this.target][key] = '';
      });
    },

    submit() {
      let { mode, exact, from, to } = this.picker[this.target];

      // Validate data
      let invalid = false;
      if (!mode) {
        invalid = true;
      } else {
        if (mode == 'exact' && !exact) {
          invalid = true;
          this.$parent.triggerAlert(400, 'Date picker - no input data');
        }

        if (mode == 'range' && !from && !to) {
          invalid = true;
          this.$parent.triggerAlert(400, 'Date picker - no input data');
        }
      }

      // Adjust this based on your timezone, mine is 7
      const zone = 7 * 60 * 60 * 1000;
      const day = 24 * 60 * 60 * 1000;

      // Set data
      this.$parent.picker[this.target] = invalid
        ? {}
        : {
          logic: '&&',
          value: mode == 'exact'
            ? [
              {
                logic: '>=',
                value: new Date(exact).getTime() - zone,
              },
              {
                logic: '<=',
                value: new Date(exact).getTime() + day - zone,
              }
            ]

            : [
              {
                logic: '>=',
                value: from ? new Date(from).getTime() - zone : 0,
              },
              {
                logic: '<=',
                value: to
                  ? new Date(to).getTime() - zone
                  : new Date().getTime(),
              },
            ],
          };
    }
  }
}
</script>

<style scoped>



</style>
