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

// Disclaimer: WIP!!! Bugs can happen, please report then :)
window.$ = () => { throw "DMA not ready yet" };

const setupDMAHelpers = () => {
    $.write = (ptr, type, value) => {
        switch(type) {
            case "struct": return $.writeStruct(ptr, value);
            case "vector": return new $.Vector(ptr, value.type, value.typeSize).push(...value.entries);
            default: return $(ptr)[type] = value;
        }
    }

    $.writeStruct = (ptr, fields) => {
        for(const { offset, type, value } of fields) 
            $.write(ptr + offset, type, value);
    }

    $.List = class LinkedList {
        constructor(ptr, type, typeSize) {
            this.ptr = ptr;
            this.type = type;
            this.typeSize = typeSize;
        }

        push(...entries) {
            for(const entry of entries) this._append(this._end, entry);
            this.length += entries.length;
        }

        forEach(cb) {
            let current = $(this.ptr);
            while(current.i32) {
                cb(current.i32);
                current = current.$;
            }
        }

        get length() {
            return $(this.ptr)[4].i32;
        }

        set length(val) {
            $.write(this.ptr + 4, "u32", val);
        }

        get _end() {
            let current = $(this.ptr);
            while(current.i32) current = current.$;
            return current.at;
        }

        _append(last, entry) {
            const ptr = Module.exports.malloc(this.typeSize);
            $.write(ptr, this.type, entry);
            $.write(last, "$", ptr);
        }
    }


    $.Vector = class Vector {
        constructor(ptr, type, typeSize) {
            this.ptr = ptr;
            this.type = type;
            this.typeSize = typeSize;
            this.start = $(ptr).i32;
            this.end = $(ptr)[4].i32;
            this.maxCapacity = $(ptr)[8].i32;
            this.maxEntries = (this.maxCapacity - this.start) / this.typeSize;
            this.totalSize = (this.end - this.start) / this.typeSize;
            this.entries = [];
        }
    
        push(...entries) {
            this.entries.push(...entries);
            this.totalSize = this.entries.length * this.typeSize;
            if(this.entries.length > this.maxEntries) this._malloc();
            else this._write();
        }
    
        clear() {
            this.entries = [];
            this.end = this.start;
            Module.HEAPU8.subarray(this.start, this.maxCapacity).fill(0);
        }
    
        destroy() {
            Module.exports.free(this.start);
            this.start = 0;
            this.end = 0;
            this.maxCapacity = 0;
            $.write(this.ptr, "$", this.start);
            $.write(this.ptr + 4, "$", this.end);
            $.write(this.ptr + 8, "$", this.maxCapacity);
            this.maxEntries = 0;
            this.totalSize = 0;
            this.entries = [];
        }
    
        _write() {
            for(const entry of this.entries) {
                $.write(this.end, this.type, entry);
                this.end += this.typeSize;
            }
            $.write(this.ptr + 4, "$", this.end);
        }
    
        _malloc() {
            this.maxEntries = (this.maxCapacity - this.start) / this.typeSize;
            this.totalSize = this.entries.length * this.typeSize;
            this.start = Module.exports.malloc(this.totalSize);
            this.end = this.start;
            this.maxCapacity = this.start + this.totalSize;
            Module.HEAPU8.subarray(this.start, this.maxCapacity).fill(0);
            $.write(this.ptr, "$", this.start);
            this._write();
            $.write(this.ptr + 8, "$", this.maxCapacity);
        }
    }
}

window.setupDMA = () => {
    const Decoder = new TextDecoder();
    const Encoder = new TextEncoder();

    const getter = ({ ptr }, prop) => {
        switch(prop) {
            case "at":
            case "ptr": return ptr;
            case "u8": return Module.HEAPU8[ptr];
            case "i8": return Module.HEAP8[ptr];
            case "bool": return Boolean(Module.HEAPU8[ptr]);
            case "ibool": return !Boolean(Module.HEAPU8[ptr]);
            case "u16": return Module.HEAPU16[ptr >> 1];
            case "i16": return Module.HEAP16[ptr >> 1];
            case "u32": return Module.HEAPU32[ptr >> 2];
            case "i32": return Module.HEAP32[ptr >> 2];
            case "u64": return Module.HEAPU64[ptr >> 3];
            case "f32": return Module.HEAPF32[ptr >> 2];
            case "f64": return Module.HEAPF64[ptr >> 3];
            case "i64": return Module.HEAP64[ptr >> 3];
            case "u64": return Module.HEAPU64[ptr >> 3];
            case "utf8": return Decoder.decode(Module.HEAPU8.subarray(ptr, Module.HEAPU8.indexOf(0, ptr)));
            case "cstr": {
                let strAt = ptr;
                let length = Module.HEAPU8[ptr + 11];
                if (length === 0x80) {
                    length = Module.HEAP32[(ptr + 4) >> 2];
                    strAt = Module.HEAP32[ptr >> 2];
                }
                return Decoder.decode(Module.HEAPU8.subarray(strAt, strAt + length));
            }
            case "vector": return (type, size, args = null) => {
                const vector = [];
                for(let i = Module.HEAPU32[ptr >> 2]; i < Module.HEAPU32[(ptr + 4) >> 2]; i += size) vector.push(args ? $(i)[type](args) : $(i)[type])
                return vector;
            }
            case "struct": return fields => Object.fromEntries(fields.map(({name, offset, type, args}) => [name, args ? $(ptr + offset)[type](...args) : $(ptr + offset)[type]]));
            case "sll": return nodeOffset => { // singly linked list
                let node = $(ptr);
                const nodes = [];
                while(node[nodeOffset].u32 !== 0) nodes.push((node = node[nodeOffset].$));
                return nodes;
            }
            case "$cb": return cb => cb($(ptr));
            case "$": return $(Module.HEAPU32[ptr >> 2]);
        }
        const offset = parseInt(prop, 10);
        if(!Number.isNaN(offset)) return $(ptr + offset);
    }

    const setter = ({ ptr }, prop, to) => {
        if (to === undefined || to === null) return;
        switch(prop) {
            case "u8": return Module.HEAPU8[ptr] = to;
            case "i8": return Module.HEAP8[ptr] = to;
            case "u16": return Module.HEAPU16[ptr >> 1] = to;
            case "i16": return Module.HEAP16[ptr >> 1] = to;
            case "u32": return Module.HEAPU32[ptr >> 2] = to;
            case "$": 
            case "i32": return Module.HEAP32[ptr >> 2] = to;
            case "u64": return Module.HEAPU64[ptr >> 3] = to;
            case "f32": return Module.HEAPF32[ptr >> 2] = to;
            case "f64": return Module.HEAPF64[ptr >> 3] = to;
            case "i64": return Module.HEAP64[ptr >> 3] = to;
            case "u64": return Module.HEAPU64[ptr >> 3] = to;
            case "utf8": {
                const buf = Encoder.encode(to.toString());
                Module.HEAPU8.set(buf, ptr);
                return Module.HEAPU8[ptr + buf.byteLength] = 0;
            }
            case "cstr": {
                const textBuf = Encoder.encode(to.toString());
                const len = textBuf.length;
                if (Module.HEAPU8[ptr + 11] === 0x80) Module.exports.free(Module.HEAP32[ptr >> 2]);
                Module.HEAPU8.set(new Uint8Array(12), ptr);
                if(len < 11) {
                    Module.HEAPU8.set(textBuf, ptr);
                    return Module.HEAPU8[ptr + 11] = len;
                }
                const strPtr = Module.exports.malloc(len + 1);
                Module.HEAPU8.set(textBuf, strPtr);
                Module.HEAPU8[strPtr + len] = 0;
                return Module.HEAP32.set([strPtr, len, -0x7FFFFFE0], ptr >> 2);
            }
            default: console.warn("Invalid property " + prop);
        }
    }

    window.$ = ptr => new Proxy({ ptr }, { get: getter, set: setter });

    setupDMAHelpers();
}
