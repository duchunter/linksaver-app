<template>
  <div>
    <div class="panel panel-default">

      <!-- Header -->
      <div class="panel-heading container-fluid">

        <!-- Search in ... -->
        <div class="col-sm-3">
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-4">Search:</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="table">
                  <option value="Info">Info</option>
                  <option value="Main">Main</option>
                  <option value="Temp">Temp</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="col-sm-4">
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-2">Title:</label>
              <div class="col-sm-10">
                <input type="text"
                       class="form-control"
                       placeholder="any"
                       v-model="condition.title">
              </div>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="col-sm-5">
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-2">Tags:</label>
              <div class="col-sm-10">
                <input type="text"
                       class="form-control"
                       placeholder="seperated with commas"
                       v-model="condition.tags">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- More options -->
      <div class="panel-body collapse" id="more-option">
        <div class="container-fluid">
          <!-- Link -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-3">Link:</label>
                <div class="col-sm-9">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.link">
                </div>
              </div>
            </div>
          </div>

          <!-- Doc -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-3">Doc:</label>
                <div class="col-sm-9">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.doc">
                </div>
              </div>
            </div>
          </div>

          <!-- Lib -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-3">Lib:</label>
                <div class="col-sm-9">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.lib">
                </div>
              </div>
            </div>
          </div>

          <!-- Related links -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-4">Related:</label>
                <div class="col-sm-8">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.relation">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container-fluid">
          <!-- Read -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-3">Read:</label>
                <div class="col-sm-9">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.read">
                </div>
              </div>
            </div>
          </div>

          <!-- Edit -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-3">Edit:</label>
                <div class="col-sm-9">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.edit">
                </div>
              </div>
            </div>
          </div>

          <!-- Origin -->
          <div v-if="table=='Temp' || table=='Info'" class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-4">Origin:</label>
                <div class="col-sm-8">
                  <input type="text"
                         class="form-control"
                         placeholder="any"
                         v-model="condition.origin">
                </div>
              </div>
            </div>
          </div>

          <!-- Sub table for search info -->
          <div v-if="table == 'Info'" class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-4">From:</label>
                <div class="col-sm-8">
                  <select class="form-control" v-model="subTable">
                    <option value="Logs">Logs</option>
                    <option value="Main">Main</option>
                    <option value="Temp">Temp</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Picker -->
        <div class="container-fluid">
          <!-- Added -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-4">Added:</label>
                <div class="col-sm-8">
                  <button @click="changeModalTitle('Added')"
                          class="btn btn-primary form-control"
                          data-toggle="modal"
                          data-target="#date-picker-modal">
                    <i class="fa fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-4">Rating:</label>
                <div class="col-sm-8">
                  <button class="btn btn-primary form-control"
                          data-toggle="modal"
                          data-target="#rating-modal">
                    <i class="fa fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Last edit -->
          <div class="col-sm-3">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-5">Last edit:</label>
                <div class="col-sm-7">
                  <button @click="changeModalTitle('Last edit')"
                          class="btn btn-primary form-control"
                          data-toggle="modal"
                          data-target="#date-picker-modal">
                    <i class="fa fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="panel-footer">
        <button class="btn btn-danger" @click="search">Search</button>
        <button id="optionDisplay"
                @click="changeButtonContent"
                class="btn btn-primary"
                data-toggle="collapse"
                data-target="#more-option">
          More options
        </button>
        <button class="btn btn-success" @click="reset">Reset</button>
        <button class="btn btn-info" @click="hideSearch">Hide</button>
      </div>
    </div>

    <!-- Modals -->
    <date-modal :title="pickerTitle"></date-modal>
    <rating-modal></rating-modal>
  </div>
</template>

<script>
import { getInfo, searchLink } from '../../utils/api';
import DateModal from './DateModal';
import RatingModal from './RatingModal';

export default {
  name: 'SearchBar',
  props: [],
  components: {
    DateModal,
    RatingModal,
  },

  data() {
    return {
      showOptions: false,
      table: '',
      subTable: '',
      pickerTitle: 'Added',
      condition: {
        title: '',
        tags: '',
        link: '',
        doc: '',
        lib: '',
        relation: '',
        read: '',
        edit: '',
        origin: '',
      },

      picker: {},
    }
  },

  mounted() {
    $('#search-collapse').on('hidden.bs.collapse', () => {
      $('#more-option').collapse('hide');
      if (this.showOptions) this.changeButtonContent();
    });
  },

  methods: {
    // Hide this bar, used for transistion effect
    hideSearch() {
      this.$emit('hideSearch');
    },

    // Change between 'Show more options' and 'Hide'
    changeButtonContent() {
      this.showOptions = !this.showOptions;
      let content = this.showOptions ? 'Hide advanced options' : 'More options';
      $('#optionDisplay').html(content);
    },

    /*
      Change date picker title
      because use 1 modal for both 'added' and 'lastedit'
      inner data will be determined by its title
    */
    changeModalTitle(title) {
      this.pickerTitle = title;
    },

    // Clear all condition at once
    reset() {
      // Clear direct condition
      Object.keys(this.condition).forEach(key => {
        this.condition[key] = '';
      });

      // Clear condition aquired from picker
      Object.keys(this.picker).forEach(key => {
        delete this.picker[key];
      })
    },

    // Trigger alert
    triggerAlert(code, msg) {
      this.$parent.$parent.showStatus(code, msg);
    },

    // Get condition
    getCondition() {
      let condition = {};

      // Aquire condition from input form
      Object.keys(this.condition).forEach(key => {
        if (this.condition[key]) condition[key] = this.condition[key];
      });

      // Aquire condition from picker
      Object.keys(this.picker).forEach(key => {
        let data = this.picker[key];
        if (typeof(data) == 'object') {
          if (Object.keys(data) != 0) condition[key] = data;
        } else {
          if (data) condition[key] = data;
        }
      });

      return condition;
    },

    // Submit condition and send api
    search() {
      let condition = this.getCondition();

      // Search info require subtable
      if (this.table == 'Info') {
        if (!this.subTable) {
          this.triggerAlert(400, 'Missing target');
          return;
        }

        // Get Info
        getInfo({ condition, table: this.subTable }).then(data => {
          this.hideSearch();
          this.triggerAlert('Result', data);

        }).catch(err => {
          this.triggerAlert(err.response.status, err.response.data);
        });

      } else {
        // If no table selected
        if (!this.table) {
          this.triggerAlert(400, 'Please select 1 search mode');
          return;
        }

        // Search link
        searchLink({
          condition,
          mode: 'all',
          table: this.table,
        })
        .then(data => {
          this.hideSearch();
          let mode = this.table.toLowerCase();
          this.$parent.$parent.mode = mode;
          this.$parent.$parent[`${mode}Links`] = data.data.reverse();
        })
        .catch(err => {
          this.triggerAlert(err.response.status, err.response.data);
        });
      }
    }
  }
}
</script>

<style scoped>

.panel-footer {
  text-align: center;
}

</style>
