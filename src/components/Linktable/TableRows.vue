<template>
  <tbody>
    <tr v-for="link in links"
        @click="showInfo(link)"
        data-toggle="modal"
        data-target="#link-info-modal">
      <td v-for="item in Object.keys(displayOption)"
          v-if="displayOption[item]">
        {{
          ['added', 'lastedit'].includes(item)
          ? parseDate(link[item])
          : link[item]
        }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'TableRows',
  props: ['links', 'displayOption'],
  methods: {
    showInfo(link) {
      this.$parent.displayInfo(link);
    },

    // Parse time string to date
    parseDate(time) {
      if (!time) return 'none';
      const date = new Date(parseInt(time));
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },
  }
}
</script>

<style scoped>
td {
  max-width: 20em;
  word-break: keep-all;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

tr :hover {
  cursor: pointer;
}
</style>
