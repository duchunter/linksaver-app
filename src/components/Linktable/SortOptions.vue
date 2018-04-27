<template>
  <div class="button-group collapse" id="sort-collapse">
    <!-- Sort by title -->
    <button class="btn btn-danger" @click="sortTitle">
      Sort by title
    </button>

    <!-- Sort by added -->
    <button class="btn btn-warning" @click="sortDate('added')">
      Sort by added
    </button>

    <!-- Sort by lastedit -->
    <button class="btn btn-success" @click="sortDate('lastedit')">
      Sort by last edit
    </button>

    <!-- Sort by rating -->
    <button class="btn btn-primary" @click="sortDate('rating')">
      Sort by rating
    </button>

    <!-- Reverse -->
    <button class="btn btn-info" @click="reverseTable">
      Reverse
    </button>
  </div>
</template>

<script>
export default {
  name: 'SortOptions',
  props: ['table'],
  methods: {
    // Sort by title
    sortTitle() {
      this.table.sort((a, b) => {
        return a.title == b.title
          ? 0
          : a.title > b.title ? 1 : -1;
      });
    },

    // Sort date
    sortDate(item) {
      this.table.sort((a, b) => b[item] - a[item]);
    },

    // Reverse
    reverseTable() {
      this.table.reverse();
    },
  }
}
</script>

<style scoped>
#sort-collapse {
  margin-top: 4px;
}
</style>
