<template>
  <div class="button-group">
    <!-- Display selector -->
    <button class="btn btn-primary dropdown-toggle"
            data-toggle="dropdown">
      Display <span class="caret"></span>
    </button>

    <!-- Display picker -->
    <ul class="dropdown-menu">
      <li v-for="item in Object.keys(displayOption)">
        <a :value="item">
          <!-- Tick box -->
          <input type="checkbox" v-model="displayOption[item]"/>
          &nbsp;{{item[0].toUpperCase() + item.slice(1)}}
        </a>
      </li>
    </ul>

    <!-- Sort selector -->
    <button data-toggle="collapse"
            data-target="#sort-collapse"
            class="btn btn-warning dropdown-toggle">
       Sort
      <span class="caret"></span>
    </button>

    <!-- Filter -->
    <button data-toggle="collapse"
            data-target="#filter-collapse"
            class="btn btn-success dropdown-toggle">
       Filter
      <span class="caret"></span>
    </button>

    <!-- Random for main-->
    <button @click="getRandomLink"
            class="btn btn-info"
            v-if="mode == 'main' && main.length != 0">
       Random
    </button>

    <!-- Random for temp-->
    <button @click="getRandomLink"
            class="btn btn-info"
            v-if="mode == 'temp' && temp.length != 0">
       Random
    </button>

    <!-- Displaying progress bar-->
    <div class="btn btn-default" @click="clearFilter">
      <div class="progress">
        <div id="displaying-link"
             class="progress-bar progress-bar-danger"
             data-toggle="tooltip"
             data-placement="top"
             title="Click to clear all filter"
             role="progressbar">
          {{
            mode == 'main'
              ? `${main.length}/${mainLinks.length}`
              : `${temp.length}/${tempLinks.length}`
          }}
        </div>
      </div>
    </div>

    <sort-options :table="mode == 'main' ? mainLinks : tempLinks"/>
    <filter-bar :condition="condition" :picker="picker"/>
  </div>
</template>

<script>
import FilterBar from './FilterBar';
import SortOptions from './SortOptions';

export default {
  name: 'HeaderButton',
  props: [
    'mode', 'main', 'temp', 'mainLinks', 'tempLinks',
    'displayOption', 'condition', 'picker'
  ],

  components: { FilterBar, SortOptions },
  methods: {
    // Clear filter
    clearFilter() {
      Object.keys(this.condition).forEach(key => {
        this.condition[key] = '';
      });

      Object.keys(this.picker).forEach(key => {
        this.picker[key].from = null;
        this.picker[key].to = null;
      });
    },

    // Get random link
    getRandomLink() {
      let randomLink = this.mode == 'main'
        ? this.main[Math.floor((Math.random() * this.main.length))]
        : this.temp[Math.floor((Math.random() * this.temp.length))];
      this.$parent.displayInfo(randomLink);
      $('#link-info-modal').modal('show');
    }
  }
}
</script>

<style scoped>
button {
  margin-top: 2px;
}

.dropdown-menu li {
  float: left;
  width: 50%;
}

.progress {
  width: 50vw;
  margin: 0;
  padding: 0;
}

.button-group .btn {
  margin-bottom: 4px;
}

#displaying-link {
  width: 100%;
  transition: width 1s ease;
}
</style>
