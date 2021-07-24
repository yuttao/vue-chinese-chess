<template>
  <g filter="url(#dropshadow)" :transform="translate" @click="pieceClicked">
    <g
      v-if="highlight"
      fill="none"
      :style="{ stroke: textColor, strokeWidth: 4 }"
    >
      <path v-for="p of highlightPath" :key="p.id" :d="p.path" />
      <rect
        x="0"
        y="0"
        width="50"
        height="50"
        fill="transparent"
        stroke="none"
      />
    </g>
    <circle
      v-if="piece != ' '"
      style="fill: #d69704; fill-opacity: 1"
      cx="25"
      cy="25"
      r="23"
    />
    <circle
      v-if="piece != ' '"
      style="fill: none; stroke-width: 2.5; stroke-opacity: 1"
      :style="{ stroke: textColor }"
      cx="25"
      cy="25"
      r="20"
    />
    <g :style="{ fill: textColor }">
      <CharAdvisor v-if="type == 'a'" />
      <CharBishop v-else-if="type == 'b'" :player="player" />
      <CharCannon v-else-if="type == 'c'" />
      <CharKing v-else-if="type == 'k'" :player="player" />
      <CharKnight v-else-if="type == 'n'" />
      <CharPawn v-else-if="type == 'p'" :player="player" />
      <CharRook v-else-if="type == 'r'" />
    </g>
  </g>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CharAdvisor from "./CharAdvisor.vue";
import CharBishop from "./CharBishop.vue";
import CharCannon from "./CharCannon.vue";
import CharKing from "./CharKing.vue";
import CharKnight from "./CharKnight.vue";
import CharPawn from "./CharPawn.vue";
import CharRook from "./CharRook.vue";

@Options({
  name: "ChessPiece",
  props: {
    piece: String,
    position: String,
    highlight: false,
  },
  data() {
    return {
      highDist: 3.5,
      highLen: 12,
    };
  },
  computed: {
    // get the piece type
    type(): string {
      return this.piece.toLowerCase();
    },
    // the the piece color
    textColor(): string {
      if ("a" <= this.piece && this.piece <= "z") {
        return "rgb(5, 8, 202)";
      } else if ("A" <= this.piece && this.piece <= "Z") {
        return "#9b0606";
      }
      return "#793131";
    },
    // get the player symbol
    player(): string {
      if ("a" <= this.piece && this.piece <= "z") {
        return "b";
      } else if ("A" <= this.piece && this.piece <= "Z") {
        return "w";
      }
      return " ";
    },
    // caculate the traslation of the piece string format position
    translate(): string {
      if (this.position == undefined) {
        return "translate(0 0)";
      }
      var dx = this.position.charCodeAt(0) - "a".charCodeAt(0);
      var dy = this.position.charCodeAt(1) - "0".charCodeAt(0);
      return `translate(${dx * 50} ${dy * 50})`;
    },
    highlightPath() {
      var dx = this.highDist;
      if (this.piece == " ") {
        dx += 4;
      }
      var len = this.highLen;
      return [
        {
          id: this.position + ":h0",
          path: `M ${dx},${dx + len} l 0,${-len} l ${len},0`,
        },
        {
          id: this.position + ":h1",
          path: `M ${50 - dx},${dx + len} l 0,${-len} l ${-len},0`,
        },
        {
          id: this.position + ":h2",
          path: `M ${dx},${50 - dx - len} l 0,${len} l ${len},0`,
        },
        {
          id: this.position + ":h3",
          path: `M ${50 - dx},${50 - dx - len} l 0,${len} l ${-len},0`,
        },
      ];
    },
  },
  components: {
    CharAdvisor,
    CharBishop,
    CharCannon,
    CharKing,
    CharKnight,
    CharPawn,
    CharRook,
  },
  methods: {
    pieceClicked() {
      this.$emit("pieceClicked", this.position);
    },
  },
})
export default class ChessPiece extends Vue {
  piece!: string;
  position!: string;
}
</script>
