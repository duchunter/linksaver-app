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

    <sort-options :table="mainLinks"/>
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
        delete this.picker[key];
      });
    },
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
