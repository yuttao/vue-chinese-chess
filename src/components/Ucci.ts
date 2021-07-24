const North: [number, number] = [-1, 0];
const South: [number, number] = [1, 0];
const West: [number, number] = [0, -1];
const East: [number, number] = [0, 1];
const NorthEast: [number, number] = [-1, 1];
const NorthWest: [number, number] = [-1, -1];
const SouthEast: [number, number] = [1, 1];
const SouthWest: [number, number] = [1, -1];

// check if the position is within the chess board
function isPositionValid(p: [number, number]): boolean {
  return p[0] >= 0 && p[0] <= 9 && p[1] >= 0 && p[1] <= 8;
}

function isInPalace(p: [number, number], t: string): boolean {
  if (p[1] < 3 || p[1] > 5) {
    return false;
  }
  if (t == "b" && p[0] >= 0 && p[0] <= 2) {
    return true;
  }
  if (t == "w" && p[0] >= 7 && p[0] <= 9) {
    return true;
  }
  return false;
}

// add a position and a step
function add(p: [number, number], s: [number, number]): [number, number] {
  return [p[0] + s[0], p[1] + s[1]];
}

// absolution value
function diff(a: number, b: number): number {
  const d = a - b;
  if (d < 0) {
    return -d;
  }
  return d;
}

function abs(a: [number, number], b: [number, number]): [number, number] {
  return [diff(a[0], b[0]), diff(a[1], b[1])];
}

export function strToPos(s: string): [number, number] {
  return [s.charCodeAt(1) - 48, s.charCodeAt(0) - 97];
}

function posToStr(p: [number, number]): string {
  return String.fromCharCode(p[1] + 97) + String.fromCharCode(p[0] + 48);
}

export class Ucci {
  matrix!: string[][];

  // initialize the maps
  constructor(copy: string[][]) {
    this.matrix = copy;
  }

  // Read the chess board state from a FEN string
  readFEN(fen: string): boolean {
    const lines = fen.split("/");
    if (lines.length < 10) {
      return false;
    }
    const mat: string[][] = [];
    for (let i = 0; i <= 9; i++) {
      const row: string[] = [];
      const line = lines[i];
      for (let k = 0; k < line.length; k++) {
        const c = line[k];
        if (c >= "1" && c <= "9") {
          for (let j = 0; j < Number(c); j++) {
            row.push(" ");
          }
        } else {
          row.push(c);
        }
      }
      mat.push(row);
    }
    this.matrix = mat;
    return true;
  }

  // write the chess state into a FEN string
  writeFEN(): string {
    const lines: string[] = [];
    for (const row of this.matrix) {
      let line = "";
      let i = 0;
      while (i < 9) {
        if (row[i] == " ") {
          let count = 0;
          while (i < 9 && row[i] == " ") {
            count++;
            i++;
          }
          line += count;
        } else {
          line += row[i];
          i++;
        }
      }
      lines.push(line);
    }
    return lines.join("/");
  }

  getTeam(p: string): string[] {
    const ret: string[] = [];
    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 8; j++) {
        if (this.getPlayer([i, j]) == p) {
          ret.push(posToStr([i, j]));
        }
      }
    }
    return ret;
  }

  set(p: [number, number], v: string): void {
    this.matrix[p[0]][p[1]] = v;
  }
  // get the piece of a position, need to ensure that the position is valid
  get(p: [number, number]): string {
    return this.matrix[p[0]][p[1]];
  }

  getByStr(s: string): string {
    const p = strToPos(s);
    return this.matrix[p[0]][p[1]];
  }

  getLabel(p: [number, number]): string {
    return this.matrix[p[0]][p[1]].toLowerCase();
  }

  getPlayer(p: [number, number]): string {
    const c = this.matrix[p[0]][p[1]];
    if ("a" <= c && c <= "z") {
      return "b";
    } else if ("A" <= c && c <= "Z") {
      return "w";
    }
    return " ";
  }

  // get valid moves for a King
  getKingMoves(p: [number, number]): [number, number][] {
    const ret: [number, number][] = [];
    const player = this.getPlayer(p);
    for (const d of [North, South, East, West]) {
      const t = add(p, d);
      if (isInPalace(t, player) && this.getPlayer(t) != player) {
        ret.push(t);
      }
    }
    const d = player == "w" ? North : South;
    for (let t = add(p, d); isPositionValid(t); t = add(t, d)) {
      if (this.getLabel(t) == "k") {
        ret.push(t);
      }
      break;
    }
    return ret;
  }

  // get valid moves for a Rook
  getRookMoves(p: [number, number]): [number, number][] {
    const ret: [number, number][] = [];
    const team = this.getPlayer(p);
    for (const d of [North, South, East, West]) {
      for (let t = add(p, d); isPositionValid(t); t = add(t, d)) {
        if (this.get(t) == " ") {
          ret.push(t);
        } else {
          if (this.getPlayer(t) != team) {
            ret.push(t);
          }
          break;
        }
      }
    }
    return ret;
  }

  // get all the possible moves for a Canon
  getCanonMoves(p: [number, number]): [number, number][] {
    const ret: [number, number][] = [];
    const team = this.getPlayer(p);
    for (const d of [North, South, East, West]) {
      let jumped = false;
      for (let t = add(p, d); isPositionValid(t); t = add(t, d)) {
        if (jumped == false) {
          if (this.get(t) == " ") {
            ret.push(t);
          } else {
            jumped = true;
          }
        } else if (this.get(t) != " ") {
          if (this.getPlayer(t) != team) {
            ret.push(t);
          }
          break;
        }
      }
    }
    return ret;
  }

  // return the possible moves for a Knight
  getKnightMoves(p: [number, number]): [number, number][] {
    const can: [number, number][] = [];
    const team = this.getPlayer(p);
    for (const d of [North, West, South, East]) {
      const t = add(p, d);
      if (isPositionValid(t) && this.get(t) == " ") {
        const t1 = add(t, d);
        can.push(add(t1, [d[1], d[0]]));
        can.push(add(t1, [-d[1], -d[0]]));
      }
    }
    const ret: [number, number][] = [];
    for (const c of can) {
      if (isPositionValid(c) && this.getPlayer(c) != team) {
        ret.push(c);
      }
    }
    return ret;
  }

  // get all valid moves for an Advisor
  getAdvisorMoves(p: [number, number]): [number, number][] {
    const ret: [number, number][] = [];
    const team = this.getPlayer(p);
    for (const d of [NorthEast, NorthWest, SouthEast, SouthWest]) {
      const t = add(p, d);
      if (isInPalace(t, team) && this.getPlayer(t) != team) {
        ret.push(t);
      }
    }
    return ret;
  }

  // get all valid moves for a Bishop
  getBishopMoves(p: [number, number]): [number, number][] {
    const ret: [number, number][] = [];
    const team = this.getPlayer(p);
    for (const d of [NorthEast, NorthWest, SouthEast, SouthWest]) {
      const t1 = add(p, d);
      if ((team == "b" && t1[0] > 4) || (team == "w" && t1[0] < 5)) {
        continue; // Bishop cannot cross the river
      }
      if (isPositionValid(t1) && this.get(t1) == " ") {
        const t2 = add(t1, d);
        if (isPositionValid(t2) && this.getPlayer(t2) != team) {
          ret.push(t2);
        }
      }
    }
    return ret;
  }

  // get all valid moves for a Pawn
  getPawnMoves(p: [number, number]): [number, number][] {
    const ret: [number, number][] = [];
    const team = this.getPlayer(p);
    const direct = team == "w" ? [North] : [South];
    if ((team == "w" && p[0] <= 4) || (team == "b" && p[0] >= 5)) {
      direct.push(East);
      direct.push(West);
    }
    for (const d of direct) {
      const t = add(p, d);
      if (isPositionValid(t) && this.getPlayer(t) != team) {
        ret.push(t);
      }
    }
    return ret;
  }

  move(a: string, b: string): string {
    const pa = strToPos(a);
    const pb = strToPos(b);
    const ret = this.get(pb);
    this.set(pb, this.get(pa));
    this.set(pa, " ");
    return ret;
  }

  // get moves for a piece
  getMoves(s: string): string[] {
    let can: [number, number][] = [];
    const p = strToPos(s);
    switch (this.getLabel(p)) {
      case "k":
        can = this.getKingMoves(p);
        break;
      case "a":
        can = this.getAdvisorMoves(p);
        break;
      case "b":
        can = this.getBishopMoves(p);
        break;
      case "c":
        can = this.getCanonMoves(p);
        break;
      case "n":
        can = this.getKnightMoves(p);
        break;
      case "r":
        can = this.getRookMoves(p);
        break;
      case "p":
        can = this.getPawnMoves(p);
        break;
    }
    const ret: string[] = [];
    for (const move of can) {
      ret.push(posToStr(move));
    }
    return ret;
  }

  // provide an AdvisorMove and test if it is valid
  isAdvisorMoveValid(a: [number, number], b: [number, number]): boolean {
    const t = this.getPlayer(a);
    return (
      isInPalace(b, t) &&
      Math.abs(a[0] - b[0]) == 1 &&
      Math.abs(a[1] - b[1]) == 1
    );
  }

  // check if a bishop move is valid
  isBishopMoveValid(a: [number, number], b: [number, number]): boolean {
    const t = this.getPlayer(a);
    if ((t == "b" && b[0] > 4) || (t == "w" && b[0] < 5)) {
      return false;
    }
    const d = abs(a, b);
    if (d[0] != 2 || d[1] != 2) {
      return false;
    }
    if (this.get([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]) != " ") {
      return false;
    }
    return true;
  }

  // check if a canon move is valid
  isCannonMoveValid(a: [number, number], b: [number, number]): boolean {
    const count = this.countObstacle(a, b);
    const c = this.get(b);
    return (count == 0 && c == " ") || (count == 1 && c != " ");
  }

  // check if a King move is valid
  isKingMoveValid(a: [number, number], b: [number, number]): boolean {
    if (this.getLabel(b) == "k") {
      return this.countObstacle(a, b) == 0;
    }
    const t = this.getPlayer(a);
    return isInPalace(b, t) && diff(a[0], b[0]) + diff(a[1], b[1]) == 1;
  }

  // check if a knight move is valid
  isKnightMoveValid(a: [number, number], b: [number, number]): boolean {
    const d = abs(a, b);
    if (d[0] === 1 && d[1] === 2) {
      const dy = b[1] > a[1] ? 1 : -1;
      if (this.matrix[a[0]][dy + a[1]] != " ") {
        return false;
      }
    } else if (d[0] === 2 && d[1] === 1) {
      const dx = b[0] > a[1] ? 1 : -1;
      if (this.matrix[a[0] + dx][a[1]] != " ") {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  // check if a Pawn move is valid
  isPawnMoveValid(a: [number, number], b: [number, number]): boolean {
    const d = abs(a, b);
    if (d[0] + d[1] != 1) {
      return false;
    }
    const t = this.getPlayer(a);
    if (t == "w") {
      if ((a[0] == b[0] && a[0] > 4) || a[0] - b[0] == -1) {
        return false;
      }
    } else {
      if ((a[0] == b[0] && a[0] < 5) || a[0] - b[0] == 1) {
        return false;
      }
    }
    return true;
  }

  // check if a Rook move is valid
  isRookMoveValid(a: [number, number], b: [number, number]): boolean {
    return this.countObstacle(a, b) == 0;
  }

  //count how many pieces lies between two positions
  countObstacle(a: [number, number], b: [number, number]): number {
    const ax = a[0],
      bx = b[0],
      ay = a[1],
      by = b[1];
    let i,
      j,
      k,
      n = 0;
    if (ax === bx) {
      i = ay < by ? ay : by;
      j = ay > by ? ay : by;
      for (k = i + 1; k < j; k++) {
        if (this.matrix[ax][k] != " ") {
          n++;
        }
      }
      return n;
    } else if (ay === by) {
      i = ax < bx ? ax : bx;
      j = ax > bx ? ax : bx;
      for (k = i + 1; k < j; k++) {
        if (this.matrix[k][ay] != " ") {
          n++;
        }
      }
      return n;
    }
    return -1;
  }

  isMoveValid(a: string, b: string): boolean {
    const ta = strToPos(a);
    const tb = strToPos(b);
    if (this.getPlayer(ta) == this.getPlayer(tb)) {
      return false;
    }
    const pa = this.getLabel(ta);
    switch (pa) {
      case "a":
        return this.isAdvisorMoveValid(ta, tb);
      case "b":
        return this.isBishopMoveValid(ta, tb);
      case "c":
        return this.isCannonMoveValid(ta, tb);
      case "k":
        return this.isKingMoveValid(ta, tb);
      case "n":
        return this.isKnightMoveValid(ta, tb);
      case "p":
        return this.isPawnMoveValid(ta, tb);
      case "r":
        return this.isRookMoveValid(ta, tb);
      default:
        return false;
    }
  }
}
