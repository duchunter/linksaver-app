<template>
  <div class="panel panel-default">
    <!-- Heading -->
    <div class="panel-heading">
        <div class="row">
          <div class="col-lg-12">
            <div class="button-group">
              <!-- Display selector -->
              <button class="btn btn-primary dropdown-toggle"
                      data-toggle="dropdown">
                <i class="fa fa-tv"></i> Display <span class="caret"></span>
              </button>

              <!-- Picker -->
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
                <i class="fa fa-filter"></i>
                 Filter
                <span class="caret"></span>
              </button>

              <!-- Displaying -->
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
            </div>

            <!-- Sort options -->
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

            <!-- Filter bar -->
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
            </div>
          </div>
        </div>
    </div>

    <!-- Body -->
    <div class="panel-body">
      <div class="table-responsive">
        <table class="table table-hover">
          <!-- Headers -->
          <thead>
            <transition-group name="header-list" tag="tr">
              <th v-for="item in Object.keys(displayOption)"
                  :key="item"
                  class="header-list-item"
                  v-if="displayOption[item]">
                {{item[0].toUpperCase() + item.slice(1)}}
              </th>
            </transition-group>
          </thead>

          <!-- Main links -->
          <transition-group id="main" name="row-list" tag="tbody">
            <transition-group v-for="link in main"
                :key="link.id"
                class="row-list-item"
                name="header-list"
                tag="tr"
                @click.native="displayInfo(link)"
                data-toggle="modal"
                data-target="#link-info-modal">
              <td v-for="item in Object.keys(displayOption)"
                  :key="item"
                  class="header-list-item"
                  v-if="displayOption[item]">
                {{
                  ['added', 'lastedit'].includes(item)
                  ? parseDate(link[item])
                  : link[item]
                }}
              </td>
            </transition-group>
          </transition-group>

          <!-- Temp links -->
          <transition-group id="temp" name="row-list" tag="tbody">
            <transition-group v-for="link in temp"
                @click.native="displayInfo(link)"
                :key="link.id"
                class="row-list-item"
                name="header-list"
                tag="tr"
                data-toggle="modal"
                data-target="#link-info-modal">
              <td v-for="item in Object.keys(displayOption)"
                  :key="item"
                  class="header-list-item"
                  v-if="displayOption[item]">
                {{
                  ['added', 'lastedit'].includes(item)
                  ? parseDate(link[item])
                  : link[item]
                }}
              </td>
            </transition-group>
          </transition-group>

        </table>
      </div>
    </div>

    <!-- Modals -->
    <date-modal :title="pickerTitle"/>
    <rating-modal/>
  </div>
</template>

<script>
import DateModal from './DateModal';
import RatingModal from './RatingModal';

export default {
  name: 'LinksTable',
  props: ['mode', 'tempLinks', 'mainLinks', 'deleteId' ,'changeId'],
  components: {
    DateModal,
    RatingModal,
  },

  data() {
    return {
      displayOption: {
        link: false,
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
        origin: true,
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
      picker: {},
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
    },

    changeId(newId, oldId) {
      let target = this.mode == 'main'
        ? this.mainLinks.find(link => link.id == newId)
        : this.tempLinks.find(link => link.id == newId);

      // Apply changes
      Object.keys(this.$parent.linkChanges).forEach(key => {
        target[key] = this.$parent.linkChanges[key];
      });
    },
  },

  computed: {
    main() {
      let newArr = this.mainLinks.filter(link => {
        let ok = true;
        Object.keys(this.condition).forEach(key => {
          if (this.condition[key]) {
            if (!link[key]) {
              ok = false;
            } else {
              if (this.splitData.includes(key)) {
                this.condition[key].split(', ').forEach(item => {
                  ok &= link[key].toLowerCase().includes(item.toLowerCase());
                })
              } else {
                ok &= link[key]
                  .toLowerCase()
                  .includes(this.condition[key].toLowerCase());
              }
            }
          }
        });

        return ok;
      });

      if (this.mode == 'main') {
        let percent = newArr.length / this.mainLinks.length * 100;
        $('#displaying-link').css('width', `${percent}%`);
      }

      return newArr;
    },

    temp() {
      let newArr = this.tempLinks.filter(link => {
        let ok = true;
        Object.keys(this.condition).forEach(key => {
          if (this.condition[key]) {
            if (!link[key]) {
              ok = false;
            } else {
              if (this.splitData.includes(key)) {
                this.condition[key].split(', ').forEach(item => {
                  ok &= link[key].toLowerCase().includes(item.toLowerCase());
                })
              } else {
                ok &= link[key]
                  .toLowerCase()
                  .includes(this.condition[key].toLowerCase());
              }
            }
          }
        });

        return ok;
      });

      if (this.mode == 'temp') {
        let percent = newArr.length / this.tempLinks.length * 100;
        $('#displaying-link').css('width', `${percent}%`);
      }

      return newArr;
    }
  },

  methods: {
    // Parse time string to date
    parseDate(time) {
      if (!time) return 'none';
      const date = new Date(parseInt(time));
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },

    // Sort by title
    sortTitle() {
      if (this.mode == 'main') {
        this.mainLinks.sort((a, b) => {
          return a.title == b.title
            ? 0
            : a.title > b.title ? 1 : -1;
        });
      } else {
        this.tempLinks.sort((a, b) => {
          return a.title == b.title
            ? 0
            : a.title > b.title ? 1 : -1;
        });
      }
    },

    // Sort date
    sortDate(item) {
      if (this.mode == 'main') {
        this.mainLinks.sort((a, b) => b[item] - a[item]);
      } else {
        this.tempLinks.sort((a, b) => b[item] - a[item]);
      }
    },

    // Reverse
    reverseTable() {
      if (this.mode == 'main') {
        this.mainLinks.reverse()
      } else {
        this.tempLinks.reverse();
      }
    },

    // Trigger info link modal
    displayInfo(link) {
      this.$parent.infoMode = 'info';
      Object.keys(link).forEach(key => {
        this.$parent.linkData[key] = link[key];
      });
      if (this.mode != 'temp') this.$parent.linkData.origin = 'none';
    },

    // Clear filter
    clearFilter() {
      Object.keys(this.condition).forEach(key => {
        this.condition[key] = '';
      });
    },

    changeModalTitle(title) {
      this.pickerTitle = title;
    },
  },
};

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

button {
  margin-top: 2px;
}

.dropdown-menu li {
  float: left;
  width: 50%;
}

.panel-footer {
  text-align: center;
}

.row-list-move {
  transition: transform 0.2s;
}

.row-list-item {
  transition: all 0.2s;
}

.row-list-enter, .row-list-leave-to
/* .header-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.row-list-leave-active {
  position: absolute;
}

.header-list-item {
  transition: all 0.2s;
}

.header-list-enter, .header-list-leave-to
/* .header-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.header-list-leave-active {
  position: absolute;
}

.progress {
  width: 50vw;
  margin: 0;
  padding: 0;
}

.button-group .btn {
  margin-bottom: 4px;
}

#sort-collapse, #filter-collapse {
  margin-top: 4px;
}

#displaying-link {
  width: 100%;
  transition: width 1s ease;
}

</style>
