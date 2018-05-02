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

      <button class="btn btn-success" @click=importData>
        Import data
      </button>
    </div>

    <!-- Progress bar -->
    <hr>
    <p>App database</p>
    <div class="progress">
      <div id="appMain"
           class="progress-bar progress-bar-success"
           data-toggle="tooltip"
           data-placement="top"
           title="Main"
           role="progressbar">
        {{appMain}}
      </div>
      <div id="appTemp"
           class="progress-bar progress-bar-warning"
           data-toggle="tooltip"
           data-placement="top"
           title="Temp"
           role="progressbar">
        {{appTemp}}
      </div>
    </div>

    <p>Server database</p>
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

    <p>Logs</p>
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
        <p>Action log</p>
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
import { readFile } from '../../../utils/model';

export default {
  name: 'InfoPage',
  props: ['actionLogs', 'appMain', 'appTemp'],
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
    this.$parent.adjustAppProgressBar();
  },

  methods: {
    // Import data
    async importData() {
      window.plugins.spinnerDialog.show('Import data', 'Please wait', true);

      try {
        this.$parent.mainLinks = await readFile('main.json');
        this.$parent.tempLinks = await readFile('temp.json');
      } catch (err) {
        this.triggerAlert(500, err);
        return;
      }

      this.triggerAlert(200, 'Data imported');
      window.plugins.spinnerDialog.hide();
    },

    // Trigger alert
    triggerAlert(code, msg) {
      this.$parent.showStatus(code, msg);
    },

    // Get basic info
    async getServerInfo() {
      // Get info concurrently
      let getMainInfo = getInfo({ table: 'Main' });
      let getTempInfo = getInfo({ table: 'Temp' });
      let getLogInfo = getInfo({ table: 'Logs' });

      let mainCount = await getMainInfo;
      let tempCount = await getTempInfo;
      let logCount = await getLogInfo;

      this.basicInfo.Main = parseInt(mainCount);
      this.basicInfo.Temp = parseInt(tempCount);
      this.basicInfo.Logs = parseInt(logCount);

      // Adjust progress bar percentage
      let total = this.basicInfo.Main + this.basicInfo.Temp;
      $(`#mainCount`).css('width', `${this.basicInfo.Main * 100 / total}%`);
      $(`#tempCount`).css('width', `${this.basicInfo.Temp * 100 / total}%`);
      $('#logsCount').css(
        'width',
        `${this.basicInfo.Logs > 100 ? '100' : this.basicInfo.Logs}%`
      );
    },

    // Get basic info again
    reload() {
      // Clear current info to reduce progress bar to 0
      for (let table in this.basicInfo) {
        this.basicInfo[table] = 0;
        $(`#${table.toLowerCase()}Count`).css('width', '0%');
      }

      // Active spinner
      window.plugins.spinnerDialog.show('Asking server', 'Please wait', true);

      // Wait for animation to complete
      setTimeout(async () => {
        try {
          await this.getServerInfo();
        } catch (err) {
          if (!err.response) {
            this.triggerAlert(500, err);
          } else {
            this.triggerAlert(err.response.status, err.response.data);
          }
        }

        window.plugins.spinnerDialog.hide();
      }, 200);
    },

    // Clear log
    async clearLog() {
      window.plugins.spinnerDialog.show('Clear log', 'Please wait', true);
      try {
        let response = await sendLog();
        this.triggerAlert(response.status, response.data);
        $(`#logsCount`).css('width', '0%');
      } catch (err) {
        if (!err.response) {
          this.triggerAlert(500, err);
        } else {
          this.triggerAlert(err.response.status, err.response.data);
        }
      }

      window.plugins.spinnerDialog.hide();
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

#mainCount, #tempCount, #logsCount, #appMain, #appTemp {
  width: 0%;
  transition: width 1s ease;
}

#reload {
  margin: 2px;
}

</style>
