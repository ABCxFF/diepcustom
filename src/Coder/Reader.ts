/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

/**
 * UNDOCUMENTED FILE
 **/

const convo = new ArrayBuffer(4);
const u8 = new Uint8Array(convo);
const u16 = new Uint16Array(convo);
const i32 = new Int32Array(convo);
const u32 = new Uint32Array(convo);
const f32 = new Float32Array(convo);

const Decoder = new TextDecoder();

const endianSwap = (num: number) =>
    ((num & 0xff) << 24) |
    ((num & 0xff00) << 8) |
    ((num >> 8) & 0xff00) |
    ((num >> 24) & 0xff);

export default class Reader {
    public at = 0;
    private buffer: Uint8Array;

    public constructor(buf: Uint8Array | ArrayBuffer | Buffer) {
        this.buffer = new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer);
    }

    public u8() {
        return this.buffer[this.at++];
    }

    public u16() {
        u8.set(this.buffer.subarray(this.at, (this.at += 2)));
        return u16[0];
    }

    public u32() {
        u8.set(this.buffer.subarray(this.at, (this.at += 4)));

        return u32[0];
    }

    public vu() {
        let out = 0;
        let i = 0;
        while (this.buffer[this.at] & 0x80) {
            out |= (this.buffer[this.at++] & 0x7f) << i;
            i += 7;
        }
        out |= (this.buffer[this.at++] & 0x7f) << i;

        return out;
    }

    public vi() {
        let out = this.vu();

        return (0 - (out & 1)) ^ (out >>> 1);
    }

    public vf() {
        i32[0] = endianSwap(this.vi());

        return f32[0];
    }

    public stringNT() {
        return Decoder.decode(
            this.buffer.subarray(
                this.at,
                (this.at = this.buffer.indexOf(0, this.at) + 1) - 1
            )
        );
    }

    public string(length = this.vu()) {
        return Decoder.decode(this.buffer.slice(this.at, (this.at += length)));
    }

    public float() {
        u8.set(this.buffer.subarray(this.at, (this.at += 4)));

        return f32[0];
    }
}
