<template>
  <g stroke="black" fill="transparent">
    <rect x="22" y="22" stroke-width="2px" width="406" height="456" />
    <rect x="25" y="25" stroke-width="1.5px" width="400" height="450" />
    <path
      v-for="line of lines"
      :key="line.id"
      :d="line.path"
      stroke-width="1.2px"
    />
    <path
      v-for="dash of dashes"
      :key="dash.id"
      :d="dash.path"
      stroke-width="1.4px"
    />
  </g>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "ChessGrid",
  data() {
    return {
      dashDist: 3.5,
      dashLen: 11.5,
    };
  },
  computed: {
    lines() {
      let ret = [
        { id: "line0", path: `M 175,25 275,125` },
        { id: "line1", path: `M 275,25 175,125` },
        { id: "line2", path: `M 175,375 275,475` },
        { id: "line3", path: `M 275,375 175,475` },
      ];
      let id = 4;
      for (let i = 1; i < 9; i++) {
        let y = i * 50 + 25;
        ret.push({ id: `line${id++}`, path: `M 25,${y} 425,${y}` });
      }
      for (let i = 1; i < 8; i++) {
        let x = i * 50 + 25;
        ret.push({ id: `line${id++}`, path: `M ${x},25  ${x},225` });
        ret.push({ id: `line${id++}`, path: `M ${x},275  ${x},475` });
      }
      return ret;
    },
    dashes() {
      let ret = [];
      let l = this.dashLen,
        d = this.dashDist;
      let points = [
        [125, 175],
        [225, 175],
        [325, 175],
        [125, 325],
        [225, 325],
        [325, 325],
        [75, 125],
        [375, 125],
        [75, 375],
        [375, 375],
      ];

      let id = 0;
      for (let p of points.concat([
        [25, 175],
        [25, 325],
      ])) {
        let x = p[0] + d;
        let y = p[1];
        ret.push({
          id: `dash${id++}`,
          path: `M ${x},${y + d + l} l 0,${-l} l ${l},0`,
        });
        ret.push({
          id: `dash${id++}`,
          path: `M ${x},${y - d - l} l 0,${l} l ${l},0`,
        });
      }
      for (let p of points.concat([
        [425, 175],
        [425, 325],
      ])) {
        let x = p[0] - d;
        let y = p[1];
        ret.push({
          id: `dash${id++}`,
          path: `M ${x},${y + d + l} l 0,${-l} l ${-l},0`,
        });
        ret.push({
          id: `dash${id++}`,
          path: `M ${x},${y - d - l} l 0,${l} l ${-l},0`,
        });
      }
      return ret;
    },
  },
})
export default class ChessGrid extends Vue {}
</script>
