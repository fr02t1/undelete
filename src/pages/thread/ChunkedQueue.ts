// A FIFO queue with items pushed in individually, and shifted out in an Array of chunkSize

export class ChunkedQueue<T> {
  private _chunkSize: number;
  private _chunks: T[][];

  constructor(chunkSize: number) {
    if (!(chunkSize > 0)) {
      throw new RangeError('chunkSize must be > 0');
    }
    this._chunkSize = chunkSize;
    this._chunks = [[]];  // Array of Arrays
    // Invariant: this._chunks always contains at least one Array
  }

  push(x: T): void {
    const last = this._chunks[this._chunks.length - 1];
    if (last.length < this._chunkSize) {
      last.push(x);
    } else {
      this._chunks.push([x]);
    }
  }

  hasFullChunk = (): boolean => this._chunks[0].length >= this._chunkSize * 0.9;
  isEmpty = (): boolean => this._chunks[0].length === 0;

  shiftChunk(): T[] {
    const first = this._chunks.shift() as T[];
    if (this._chunks.length === 0) {
      this._chunks.push([]);
    }
    return first;
  }
}

export default ChunkedQueue;