<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 460 510"
    class="chess-board"
  >
    <defs>
      <filter id="dropshadow" height="150%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <!-- stdDeviation is how much to blur -->
        <feOffset dx="2" dy="2" result="offsetblur" />
        <!-- how much to offset -->
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
          <!-- slope is the opacity of the shadow -->
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <!-- this contains the offset blurred image -->
          <feMergeNode in="SourceGraphic" />
          <!-- this contains the element that the filter is applied to -->
        </feMerge>
      </filter>
    </defs>
    <g transform="translate(5,5)">
      <ChessGrid />
      <ChessPiece
        v-for="p of unmovable"
        :key="p.position"
        :piece="p.piece"
        :position="p.position"
      />
      <ChessPiece
        v-for="p of movable"
        :key="p.position"
        :piece="p.piece"
        :position="p.position"
        @pieceClicked="onSelectPiece"
      />
      <ChessPiece
        v-for="p of moves"
        :key="p.position"
        :piece="p.piece"
        :position="p.position"
        :highlight="true"
        @pieceClicked="onMovePiece"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ChessGrid from "./ChessGrid.vue";
import ChessPiece from "./ChessPiece.vue";
import { Ucci } from "./Ucci";

class PieceInfo {
  position = "";
  piece = "";

  constructor(position: string, piece: string) {
    this.position = position;
    this.piece = piece;
  }
}

class Move {
  start = "a0";
  end = "a1";
  eaten = " ";
  constructor(start: string, end: string, eaten: string) {
    this.start = start;
    this.end = end;
    this.eaten = eaten;
  }
}

@Options({
  name: "ChessBoard",
  data() {
    return {
      matrix: [
        ["r", "n", "b", "a", "k", "a", "b", "n", "r"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", "c", " ", " ", " ", " ", " ", "c", " "],
        ["p", " ", "p", " ", "p", " ", "p", " ", "p"],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        ["P", " ", "P", " ", "P", " ", "P", " ", "P"],
        [" ", "C", " ", " ", " ", " ", " ", "C", " "],
        [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        ["R", "N", "B", "A", "K", "A", "B", "N", "R"],
      ],
      history: [],
      player: "w",
      chosen: undefined,
      possible: [],
    };
  },
  components: {
    ChessGrid,
    ChessPiece,
  },
  computed: {
    movable() {
      let ret = [];
      let ucci = new Ucci(this.matrix);
      for (const p of ucci.getTeam(this.player)) {
        if (p == this.chosen) {
          continue;
        }
        ret.push(new PieceInfo(p, ucci.getByStr(p)));
      }
      return ret;
    },
    unmovable() {
      let ret = [];
      let ucci = new Ucci(this.matrix);
      const play = this.player == "w" ? "b" : "w";
      for (const p of ucci.getTeam(play)) {
        if (this.possible.indexOf(p) >= 0) {
          continue;
        }
        ret.push(new PieceInfo(p, ucci.getByStr(p)));
      }
      return ret;
    },
    moves() {
      let ret = [];
      const ucci = new Ucci(this.matrix);
      for (const p of this.possible) {
        ret.push(new PieceInfo(p, ucci.getByStr(p)));
      }
      if (this.chosen) {
        ret.push(new PieceInfo(this.chosen, ucci.getByStr(this.chosen)));
      }
      return ret;
    },
  },
  methods: {
    onSelectPiece(piece: string) {
      this.chosen = piece;
      const ucci = new Ucci(this.matrix);
      this.possible = ucci.getMoves(piece);
    },
    onMovePiece(piece: string) {
      if (
        this.chosen != piece &&
        piece != undefined &&
        this.chosen != undefined
      ) {
        const ucci = new Ucci(this.matrix);
        this.history.push(
          new Move(this.chosen, piece, ucci.move(this.chosen, piece))
        );
        this.player = this.player == "w" ? "b" : "w";
      }
      this.chosen = undefined;
      this.possible = [];
    },
  },
})
export default class ChessBoard extends Vue {}
</script>

<style>
svg.chess-board {
  width: 100vw;
  height: 110vw;
  background: burlywood;
  /* background: url("/assets/chessboard.svg");
  background-repeat: no-repeat;
  background-size: cover; */
  max-height: 100vh;
  max-width: 90.909vh;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: auto;
  /* vertical center */
  left: 0;
  right: 0;
  /* horizontal center */
}
</style>
