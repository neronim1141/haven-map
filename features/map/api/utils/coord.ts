export class Coord {
  x = 0;
  y = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  parent = () => {
    const tmp = { x: this.x, y: this.y };
    // if (tmp.x < 0) tmp.x--;
    // if (tmp.y < 0) tmp.y--;

    return new Coord(Math.floor(tmp.x / 2), Math.floor(tmp.y / 2));
  };
  toString = () => {
    return `${this.x}_${this.y}`;
  };
}
