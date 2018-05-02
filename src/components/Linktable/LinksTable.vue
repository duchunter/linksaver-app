<template>
  <div class="panel panel-default">
    <!-- Heading -->
    <div class="panel-heading">
        <div class="row">
          <div class="col-lg-12">
            <header-buttons :mode="mode"
                            :condition="condition"
                            :picker="picker"
                            :main="main"
                            :temp="temp"
                            :mainLinks="mainLinks"
                            :tempLinks="tempLinks"
                            :displayOption="displayOption">
          </div>
        </div>
    </div>

    <!-- Body -->
    <div class="panel-body">
      <div class="table-responsive">
        <table class="table table-hover">
          <!-- Headers -->
          <thead>
            <tr>
              <th>#</th>
              <th v-for="item in Object.keys(displayOption)"
                  v-if="displayOption[item]">
                {{item[0].toUpperCase() + item.slice(1)}}
              </th>
            </tr>
          </thead>

          <!-- Main links -->
          <table-rows id="main"
                      :links="main"
                      :displayOption="displayOption"/>

          <!-- Temp links -->
          <table-rows id="temp"
                      :links="temp"
                      :displayOption="displayOption"/>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import TableRows from './TableRows';
import HeaderButtons from './HeaderButtons';
import { writeFile } from '../../../utils/model';

export default {
  name: 'LinksTable',
  props: ['mode', 'tempLinks', 'mainLinks', 'deleteId' ,'changeId'],
  components: { TableRows, HeaderButtons },

  data() {
    return {
      displayOption: {
        title: true,
        tags: false,
        added: true,
        doc: false,
        rating: false,
        read: false,
        edit: false,
        lastedit: false,
        report: false,
        relation: false,
        lib: false,
        origin: false,
      },

      condition: {
        link: '',
        title: '',
        tags: '',
        doc: '',
        read: '',
        edit: '',
        report: '',
        relation: '',
        lib: '',
        origin: '',
      },

      splitData: ['tags', 'report', 'relation', 'lib'],
      pickerTitle: 'Added',
      picker: {
        added: {},
        lastedit: {},
        rating: {},
      },
    };
  },

  mounted() {
    $('.dropdown-menu a').on('click', e => {
      let target = $(e.target).attr('value');
      this.displayOption[target] = !this.displayOption[target];
      return false;
    });

    $(`#${this.mode == 'main' ? 'temp' : 'main'}`).fadeOut(0);
  },

  watch: {
    mode(newMode, oldMode) {
      $(`#${oldMode}`).fadeOut(300, () => {
        $(`#${newMode}`).fadeIn(300);
      });
    },

    deleteId(newId, oldId) {
      if (newId == 0) return;

      if (this.mode == 'main') {
        this.mainLinks.forEach((link, index) => {
          if (link.id == newId) {
            this.mainLinks.splice(index, 1);
          }
        });
      } else {
        this.tempLinks.forEach((link, index) => {
          if (link.id == newId) {
            this.tempLinks.splice(index, 1);
          }
        });
      }

      // Write to file
      let data = JSON.stringify(
        this.mode == 'main' ? this.$parent.mainLinks : this.$parent.tempLinks
      )

      writeFile(`${this.mode}.json`, data).then(result => {
        this.$parent.showStatus(200, result);
      }).catch(err => {
        this.$parent.showStatus(500, err);
      });
    },

    changeId(newId, oldId) {
      let target = this.mode == 'main'
        ? this.mainLinks.find(link => link.id == newId)
        : this.tempLinks.find(link => link.id == newId);

      // Apply changes
      Object.keys(this.$parent.linkChanges).forEach(key => {
        target[key] = this.$parent.linkChanges[key];
      });

      // Write to file
      let data = JSON.stringify(
        this.mode == 'main' ? this.$parent.mainLinks : this.$parent.tempLinks
      )

      writeFile(`${this.mode}.json`, data).then(result => {
        this.$parent.showStatus(200, result);
      }).catch(err => {
        this.$parent.showStatus(500, err);
      });
    },
  },

  computed: {
    main() {
      let newList = this.mainLinks.filter(this.filterList);
      if (Object.values(this.condition).filter(x => x).length == 0) {
        newList = [];
      }

      if (this.mode == 'main') {
        let percent = newList.length / this.mainLinks.length * 100;
        $('#displaying-link').css('width', `${percent}%`);
      }

      return newList;
    },

    temp() {
      let newList = this.tempLinks.filter(this.filterList);
      if (this.mode == 'temp') {
        let percent = newList.length / this.tempLinks.length * 100;
        $('#displaying-link').css('width', `${percent}%`);
      }

      return newList;
    }
  },

  methods: {
    // Trigger info link modal
    displayInfo(link) {
      this.$parent.infoMode = 'info';
      Object.keys(link).forEach(key => {
        this.$parent.linkData[key] = link[key];
      });
    },

    filterList(link) {
      let ok = true;
      // Check string data
      Object.keys(this.condition).forEach(key => {
        if (this.condition[key]) {
          if (!link[key]) {
            ok = false;
            return ok;
          }

          if (this.splitData.includes(key)) {
            this.condition[key].split(', ').forEach(item => {
              ok &= link[key].toLowerCase().includes(item.toLowerCase());
            });
          } else {
            ok &= link[key]
              .toLowerCase()
              .includes(this.condition[key].toLowerCase());
          }
        }
      });

      // Check rating
      let from = this.picker.rating.from || 0;
      let to = this.picker.rating.to || 5;
      ok &= link.rating >= parseInt(from);
      ok &= link.rating <= parseInt(to);

      // Check time (added, lastedit)
      // Adjust this based on your timezone, mine is 7
      const zone = 7 * 60 * 60 * 1000;
      const day = 24 * 60 * 60 * 1000;
      ['added', 'lastedit'].forEach(item => {
        let from = this.picker[item].from;
        let to = this.picker[item].to;

        let start = from ? new Date(from).getTime() - zone : 0;
        let stop = to
          ? new Date(to).getTime() - zone + day
          : new Date().getTime();

        if (from || to) {
          ok &= link[item] >= start;
          ok &= link[item] <= stop;
        }
      });

      return ok;
    },
  },
};

</script>

<style scoped>

</style>
