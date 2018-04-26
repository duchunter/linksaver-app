<template>
  <div class="container-fluid">
    <!-- Functional button -->
    <div class="button-group">
      <!-- Reload -->
      <button class="btn btn-danger" @click="reload">
        Get server info
      </button>

      <!-- Clear log -->
      <button class="btn btn-primary" @click=clearLog>
        Clear log
      </button>
    </div>

    <!-- Progress bar -->
    <h4>Database</h4>
    <div class="progress">
      <div id="mainCount"
           class="progress-bar progress-bar-success"
           data-toggle="tooltip"
           data-placement="top"
           title="Main"
           role="progressbar">
        {{basicInfo.Main}}
      </div>
      <div id="tempCount"
           class="progress-bar progress-bar-warning"
           data-toggle="tooltip"
           data-placement="top"
           title="Temp"
           role="progressbar">
        {{basicInfo.Temp}}
      </div>
    </div>

    <h4>Logs</h4>
    <div class="progress">
      <div id="logsCount"
           class="progress-bar progress-bar-danger"
           data-toggle="tooltip"
           data-placement="top"
           title="Logs"
           role="progressbar">
        {{basicInfo.Logs}}
      </div>
    </div>

    <!-- Action log -->
    <br />
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Action log</h3>
      </div>
      <div class="panel-body terminal-body">
        <p v-for="log in actionLogs"
           :style="{color: log.code >= 400 ? 'red' : 'green'}">
          {{log.content}}
        </p>
        <p v-if="actionLogs.length == 0"
           style="color: white; text-align: center">
          (Nothing to show, start by searching something)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getInfo, sendLog } from '../../../utils/api';

export default {
  name: 'InfoPage',
  props: ['actionLogs'],
  data() {
    return {
      basicInfo: {
        Temp: 0,
        Main: 0,
        Logs: 0,
      }
    }
  },

  mounted() {

  },

  methods: {
    // Trigger alert
    triggerAlert(code, msg) {
      this.$parent.showStatus(code, msg);
    },

    // Get basic info
    getBasicInfo() {
      let database = ['Main', 'Temp'];

      // Count 2 link table
      database.forEach(table => {
        getInfo({ table }).then(res => {
          // Set data
          this.basicInfo[table] = parseInt(res);

          // Adjust progress bar
          let total = database.reduce((sum, cur) => {
            return sum + this.basicInfo[cur];
          }, 0);

          database.forEach(table => {
            let width = this.basicInfo[table] * 100 / total;
            $(`#${table.toLowerCase()}Count`).css('width', `${width}%`);
          });

        }).catch(err => {
          this.triggerAlert(err.response.status, err.response.data);
        });
      });

      // Count log
      getInfo({ table: 'Logs' }).then(res => {
        this.basicInfo.Logs = parseInt(res);
        $('#logsCount').css('width', `${res > 100 ? '100' : res}%`);
      });
    },

    // Get basic info again
    reload() {
      Object.keys(this.basicInfo).forEach(table => {
        this.basicInfo[table] = 0;
        $(`#${table.toLowerCase()}Count`).css('width', '0%');
      });

      setTimeout(this.getBasicInfo, 500);
    },

    // Clear log
    clearLog() {
      sendLog().then(res => {
        this.triggerAlert(res.status, res.data);
      }).catch(err => {
        this.triggerAlert(err.response.status, err.response.data);
      });
    }
  }
}
</script>

<style scoped>

.container-fluid {
  padding-top: 5px;
}

.button-group {
  margin-top: 2px;
}

.terminal-body {
  height: 20vh;
  overflow-y: scroll;
  background-color: #212121;
}

#mainCount, #tempCount, #logsCount {
  width: 0%;
  transition: width 1s ease;
}

#reload {
  margin: 2px;
}

</style>
