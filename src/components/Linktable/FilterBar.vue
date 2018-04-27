<template>
  <div class="collapse panel panel-default" id="filter-collapse">
    <!-- Heading -->
    <div class="panel-heading">
      <button class="btn btn-danger"
              @click="clearFilter"
              v-if="Object.values(condition).filter(x => x).length">
        Clear filter
      </button>
    </div>

    <!-- Body -->
    <div class="panel-body container-fluid">
      <!-- Input -->
      <div v-for="key in Object.keys(condition)" class="col-sm-4">
        <div class="form-horizontal">
          <div class="form-group">
            <!-- Label -->
            <label class="control-label col-sm-3">
              {{key[0].toUpperCase() + key.slice(1)}}
            </label>
            <!-- Input field -->
            <div class="col-sm-9">
              <input type="text"
                     class="form-control"
                     placeholder="any"
                     v-model="condition[key]">
            </div>
          </div>
        </div>
      </div>

      <!-- Added -->
      <div class="col-sm-2">
        <div class="form-horizontal">
          <div class="form-group">
            <div class="col-sm-10">
              <button @click="changeModalTitle('Added')"
                      class="btn btn-primary form-control"
                      data-toggle="modal"
                      data-target="#date-picker-modal">
                Added
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="col-sm-2">
        <div class="form-horizontal">
          <div class="form-group">
            <div class="col-sm-10">
              <button class="btn btn-primary form-control"
                      data-toggle="modal"
                      data-target="#rating-modal">
                Rating
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="form-horizontal">
          <div class="form-group">
            <div class="col-sm-10">
              <button @click="changeModalTitle('Last edit')"
                      class="btn btn-primary form-control"
                      data-toggle="modal"
                      data-target="#date-picker-modal">
                Last edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <date-modal :title="pickerTitle"/>
    <rating-modal/>
  </div>
</template>

<script>
import DateModal from '../Modals/DateModal';
import RatingModal from '../Modals/RatingModal';

export default {
  name: 'FilterBar',
  props: ['condition', 'picker'],
  components: {
    DateModal,
    RatingModal,
  },

  data() {
    return {
      pickerTitle: 'Added'
    }
  },

  methods: {
    // Clear filter
    clearFilter() {
      Object.keys(this.condition).forEach(key => {
        this.condition[key] = '';
      });

      Object.keys(this.picker).forEach(key => {
        delete this.picker[key];
      });
    },

    changeModalTitle(title) {
      this.pickerTitle = title;
    },
  }
}
</script>

<style scoped>
#filter-collapse {
  margin-top: 4px;
}
</style>
