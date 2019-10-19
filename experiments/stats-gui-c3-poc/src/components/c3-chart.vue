<template>
    <div id="chart"></div>
</template>
<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import * as c3 from 'c3';
@Component({
  name: "c3-chart"
})
export default class C3Chart extends Vue {
    public mounted() {
    let chart = c3.generate({
    bindto: '#chart',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ]
        }
    });

  }

}
</script>