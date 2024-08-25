import { sleep } from '../../utils';

export class TokenBucket {
    private _msRefillIntvl: number;
    private _maxSize: number;
    private _tokens: number;
    private _msNextRefill?: number;
  
    // Refills tokens at a rate of one per msRefillIntvl millis, storing up to size tokens.
    constructor(msRefillIntvl: number, size: number) {
      if (!(msRefillIntvl > 0)) {
        throw new RangeError('msRefillIntvl must be > 0');
      }
      if (!(size > 0)) {
        throw new RangeError('size must be > 0');
      }
      this._msRefillIntvl = msRefillIntvl;
      this._maxSize = size;
      this._tokens = size;
      // Invariant: this._msNextRefill is valid iff this._tokens < this._maxSize
    }

    // Removes one token, waiting for it to refill if none are available.
    async waitForToken(): Promise<void> {
        let msNow: number = Date.now(); // Initialize msNow here to ensure it is always assigned
        // Calculate if/how many tokens to refill
        if (this._tokens < this._maxSize) {  // this._msNextRefill is valid
            msNow = Date.now();
            if (this._msNextRefill !== undefined && msNow >= this._msNextRefill) {
                const newTokens = Math.floor((msNow - this._msNextRefill) / this._msRefillIntvl) + 1;
                this._tokens += newTokens;
                if (this._tokens < this._maxSize) {
                    this._msNextRefill = (this._msNextRefill ?? 0) + newTokens * this._msRefillIntvl;
                } else {
                    this._tokens = this._maxSize;  // this._msNextRefill is now invalid
                    this._msNextRefill = undefined;
                }
            }
        }
        // Remove a token or wait for _msNextRefill, and recalculate it
        if (this._tokens > 0) {
            if (this._tokens === this._maxSize) {  // this._msNextRefill is invalid,
                this._msNextRefill = msNow + this._msRefillIntvl;  // make it valid
            }
            this._tokens--;
        } else if (this._msNextRefill !== undefined) {  // this._msNextRefill is valid and msNow has already been set above
            await sleep(this._msNextRefill - msNow);
            this._msNextRefill = (this._msNextRefill ?? 0) + this._msRefillIntvl;
        }
    }

    // Removes all tokens, and will refill the next token msNextAvail
    // millis from now. After it's refilled, resumes normal refill rate.
    setNextAvail(msNextAvail: number): void {
        this._tokens = 0;
        this._msNextRefill = Date.now() + msNextAvail;
    }
}