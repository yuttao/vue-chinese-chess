import { Ucci } from "../../src/components/Ucci";

describe("Ucci Class", function () {
  var ucci: Ucci = new Ucci([]);

  it("should read initial FEN correctly", function () {
    ucci.readFEN("rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR");
    let out: string[][] = [
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
    ];
    expect(ucci.matrix).toEqual(out);
  });

  it("should write initial FEN correctly", function () {
    ucci.matrix = [
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
    ];
    let fen = ucci.writeFEN();
    expect(fen).toEqual(
      "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR"
    );
  });
  it("should get pieces of a team correctly", function () {
    ucci.readFEN("rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR");
    let whitePieces = ucci.getTeam("w").sort();
    expect(whitePieces).toEqual([
      "a6",
      "a9",
      "b7",
      "b9",
      "c6",
      "c9",
      "d9",
      "e6",
      "e9",
      "f9",
      "g6",
      "g9",
      "h7",
      "h9",
      "i6",
      "i9",
    ]);
    let blackPieces = ucci.getTeam("b").sort();
    expect(blackPieces).toEqual([
      "a0",
      "a3",
      "b0",
      "b2",
      "c0",
      "c3",
      "d0",
      "e0",
      "e3",
      "f0",
      "g0",
      "g3",
      "h0",
      "h2",
      "i0",
      "i3",
    ]);
  });

  /*
  it("should get king moves correctly", function () {
    ucci.readFEN("9/4k4/9/9/9/9/9/9/4K4/9");
    let moves = ucci.getKingMoves([1, 4]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [0, 4],
        [2, 4],
        [1, 5],
        [1, 3],
        [8, 4],
      ])
    );
  });

  it("should get rook moves correctly", function () {
    ucci.readFEN("9/4k4/9/9/4R4/9/9/9/4K4/9");
    let moves = ucci.getRookMoves([4, 4]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [5, 4],
        [6, 4],
        [7, 4],
        [3, 4],
        [2, 4],
        [1, 4],
        [4, 5],
        [4, 6],
        [4, 7],
        [4, 8],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0],
      ])
    );
  });

  it("should get canon moves correctly", function () {
    ucci.readFEN("4r4/9/4r4/9/4C3R/9/9/4K4/9/4R4");
    let moves = ucci.getCanonMoves([4, 4]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [3, 4],
        [0, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [4, 6],
        [4, 7],
        [4, 3],
        [4, 2],
        [4, 1],
        [4, 0],
      ])
    );
  });

  it("should get knight moves correctly", function () {
    ucci.readFEN("9/9/9/4N4/4N4/9/3r1R3/9/9/9");
    let moves = ucci.getKnightMoves([4, 4]);
    jest;
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [3, 2],
        [5, 2],
        [6, 3],
        [5, 6],
        [3, 6],
      ])
    );
  });

  it("should get advisor moves correctly", function () {
    ucci.readFEN("9/4a4/3R5/9/9/9/9/9/9/3A1A3");
    let moves = ucci.getAdvisorMoves([1, 4]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [0, 5],
        [0, 3],
        [2, 5],
        [2, 3],
      ])
    );
    moves = ucci.getAdvisorMoves([9, 3]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[8, 4]]));
    moves = ucci.getAdvisorMoves([9, 5]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[8, 4]]));
  });

  it("should get bishop moves correctly", function () {
    ucci.readFEN("2b6/9/4b4/9/2R6/2B6/9/4B4/9/9");
    let moves = ucci.getBishopMoves([0, 2]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[2, 0]]));
    moves = ucci.getBishopMoves([2, 4]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [0, 6],
        [4, 2],
        [4, 6],
      ])
    );
    moves = ucci.getBishopMoves([5, 2]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[7, 0]]));
    moves = ucci.getBishopMoves([7, 4]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [9, 2],
        [9, 6],
        [5, 6],
      ])
    );
  });

  it("should get pawn moves correctly", function () {
    ucci.readFEN("9/9/9/p8/2p5P/3p2P2/4P4/9/9/9");
    let moves = ucci.getPawnMoves([3, 0]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[4, 0]]));
    moves = ucci.getPawnMoves([4, 2]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[5, 2]]));
    moves = ucci.getPawnMoves([5, 3]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [6, 3],
        [5, 4],
        [5, 2],
      ])
    );
    moves = ucci.getPawnMoves([6, 4]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[5, 4]]));
    moves = ucci.getPawnMoves([5, 6]);
    expect(moves).toEqual(jasmine.arrayWithExactContents([[4, 6]]));
    moves = ucci.getPawnMoves([4, 8]);
    expect(moves).toEqual(
      jasmine.arrayWithExactContents([
        [3, 8],
        [4, 7],
      ])
    );
  });

  function validTest(
    message: string,
    moves: [number, number][],
    valid: [number, number][]
  ) {
    it(message, function () {
      expect(moves).toEqual(jasmine.arrayWithExactContents(valid));
    });
  }

  ucci.readFEN("rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR");
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j < 9; j++) {
      let moves = ucci.getMoves([i, j]);
      let valid: [number, number][] = [];
      for (let k = 0; k <= 9; k++) {
        for (let l = 0; l < 9; l++) {
          if (ucci.isMoveValid([i, j], [k, l])) {
            valid.push([k, l]);
          }
        }
      }
      let c = ucci.n2l.get(ucci.get([i, j]));
      validTest("initial state: [" + [i, j] + "]:" + c, moves, valid);
    }
  }*/
});
