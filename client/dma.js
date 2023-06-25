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

class $Entity {
    #$;
    #$basic;
    #$position;
    #$collidable;
    #$renderable;
    #$cannon;
    constructor($, $parent = null) {
        this.#$ = $;
        this.parent = null;
        this.children = [];

        this.#$basic = $[0x10][0x20][0x18][0 * 4].$;
        this.#$position = $[0x10][0x20][0x18][10 * 4].$;
        this.#$collidable = $[0x10][0x20][0x18][3 * 4].$;
        this.#$renderable = $[0x10][0x20][0x18][11 * 4].$;
        this.#$cannon = $[0x10][0x20][0x18][2 * 4].$;
        
        if($parent) {
            if (!this.#$basic.at) throw "Invalid Basic component reference.";
            this.#$basic[FIELD_OFFSETS.basic.parent].u32 = $parent[52].u32;
            this.#$basic[FIELD_OFFSETS.basic.parent][4].u16 = $parent[56].u16;
            this.#$basic[FIELD_OFFSETS.basic.owner].u32 = $parent[52].u32;
            this.#$basic[FIELD_OFFSETS.basic.owner][4].u16 = $parent[56].u16;
        }
    }

    createChild(isCannon = false) {
        const ptr = $EntityManager.createNewEntity(this.#$[48].at);
        if (!ptr) throw "Out of entityIds";

        const componentList = $EntityManager.createComponentList({
            createBasic: true,
            createCollidable: true,
            createPosition: true,
            createRenderable: true,
            createCannon: isCannon
        });
        if (!componentList) throw "Invalid component list reference.";
        Module.rawExports.decodeComponentList(ptr, componentList);
        Module.exports.free($(componentList)[0].i32);
        Module.exports.free(componentList);

        const entity = new $Entity($(ptr), this.#$);
        entity.parent = this;
        this.children.push(entity);

        return entity;
    }

    get positionData() {
        return this.#$position ? new $Position(this.#$position) : null;
    }

    set positionData(component) {
        throw "Setting components by reference is not allowed!\nTry using yourSecondEntity.positionData.clone(yourFirstEntity.positionData); instead.";
    }

    get physicsData() {
        return this.#$collidable ? new $Collidable(this.#$collidable) : null;
    }

    set physicsData(component) {
        throw "Setting components by reference is not allowed!\nTry using yourSecondEntity.physicsData.clone(yourFirstEntity.physicsData); instead.";
    }

    get styleData() {
        return this.#$renderable ? new $Renderable(this.#$renderable) : null;
    }

    set styleData(component) {
        throw "Setting components by reference is not allowed!\nTry using yourSecondEntity.styleData.clone(yourFirstEntity.styleData); instead.";
    }

    get barrelData() {
        return this.#$cannon ? new $Cannon(this.#$collidable) : null;
    }

    set barrelData(component) {
        throw "Setting components by reference is not allowed!\nTry using yourSecondEntity.barrelData.clone(yourFirstEntity.barrelData); instead.";
    }

    clone(source) {
        if (!(source instanceof $Entity)) throw "Failed to clone data from an unknown object, please provide an instance of $Entity.";
        if(source.positionData) this.positionData?.clone(source.positionData);
        if(source.physicsData) this.physicsData?.clone(source.physicsData);
        if(source.styleData) this.styleData?.clone(source.styleData);
        if(source.barrelData) this.barrelData?.clone(source.barrelData);
    }

    defaults() {
        this.positionData?.defaults();
        this.physicsData?.defaults();
        this.styleData?.defaults();
        this.barrelData?.defaults();
    }
}

class $Component {
    #$;
    constructor($) {
        this.entity = new $Entity($.$);
        this.#$ = $;
    }
}

class $Position extends $Component {
    #$x;
    #$y;
    #$angle;
    #$flags;
    constructor($) {
        super($);
        this.#$x = $[FIELD_OFFSETS.position.x];
        this.#$y = $[FIELD_OFFSETS.position.y];
        this.#$angle = $[FIELD_OFFSETS.position.angle];
        this.#$flags = $[FIELD_OFFSETS.position.flags];
    }

    get x() {
        return this.#$x.f32;
    }

    set x(value) {
        this.#$x.f32 = value;
    }

    get y() {
        return this.#$y.f32;
    }

    set y(value) {
        this.#$y.f32 = value;
    }

    get angle() {
        return this.#$angle.f32;
    }

    set angle(value) {
        this.#$angle.f32 = value;
    }

    get isAngleAbsolute() {
        return Boolean(this.#$flags.u32 & FLAGS.absoluteRotation);
    }

    set isAngleAbsolute(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.absoluteRotation;
        else this.#$flags.u32 &= ~FLAGS.absoluteRotation;
    }

    clone(source) {
        if (!(source instanceof $Position)) throw "Failed to clone data from an unknown object, please provide an instance of $Position.";
        this.x = source.x;
        this.y = source.y;
        this.angle = source.angle;
        this.isAngleAbsolute = source.isAngleAbsolute;
    }

    defaults() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.isAngleAbsolute = false;
    }
}

class $Collidable extends $Component {
    #$sides;
    #$size;
    #$width;
    #$flags;
    constructor($) {
        super($);
        this.#$sides = $[FIELD_OFFSETS.collidable.sides];
        this.#$size = $[FIELD_OFFSETS.collidable.size];
        this.#$width = $[FIELD_OFFSETS.collidable.width];
        this.#$flags = $[FIELD_OFFSETS.collidable.flags];
    }

    get sides() {
        return this.#$sides.u32;
    }

    set sides(value) {
        this.#$sides.u32 = value;
    }

    get size() {
        return this.#$size.f32;
    }

    set size(value) {
        this.#$size.f32 = value;
    }

    get width() {
        return this.#$width.f32;
    }

    set width(value) {
        this.#$width.f32 = value;
    }

    get isTrapezoid() {
        return Boolean(this.#$flags.u32 & FLAGS.isTrapezoid);
    }

    set isTrapezoid(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.isTrapezoid;
        else this.#$flags.u32 &= ~FLAGS.isTrapezoid;
    }

    clone(source) {
        if (!(source instanceof $Collidable)) throw "Failed to clone data from an unknown object, please provide an instance of $Collidable.";
        this.sides = source.sides;
        this.size = source.size;
        this.width = source.width;
        this.isTrapezoid = source.isTrapezoid;
    }

    defaults() {
        this.sides = 1;
        this.size = 50.0;
        this.width = 0;
        this.isTrapezoid = false;
    }
}

class $Renderable extends $Component {
    #$color;
    #$borderWidth;
    #$opacity;
    #$flags;
    constructor($) {
        super($);
        this.#$color = $[FIELD_OFFSETS.renderable.color];
        this.#$borderWidth = $[FIELD_OFFSETS.renderable.borderWidth];
        this.#$opacity = $[FIELD_OFFSETS.renderable.opacity];
        this.#$flags = $[FIELD_OFFSETS.renderable.flags];
    }

    get color() {
        return this.#$color.u32;
    }

    set color(value) {
        this.#$color.u32 = value;
    }

    get borderWidth() {
        return this.#$borderWidth.f32;
    }

    set borderWidth(value) {
        this.#$borderWidth.f32 = value;
    }

    get opacity() {
        return this.#$opacity.f32;
    }

    set opacity(value) {
        this.#$opacity.f32 = value;
    }

    get isVisible() {
        return Boolean(this.#$flags.u32 & FLAGS.isVisible);
    }

    set isVisible(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.isVisible;
        else this.#$flags.u32 &= ~FLAGS.isVisible;
    }

    get renderFirst() {
        return Boolean(this.#$flags.u32 & FLAGS.renderFirst);
    }

    set renderFirst(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.renderFirst;
        else this.#$flags.u32 &= ~FLAGS.renderFirst;
    }

    get isStar() {
        return Boolean(this.#$flags.u32 & FLAGS.isStar);
    }

    set isStar(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.isStar;
        else this.#$flags.u32 &= ~FLAGS.isStar;
    }

    get isCachable() {
        return Boolean(this.#$flags.u32 & FLAGS.isCachable);
    }

    set isCachable(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.isCachable;
        else this.#$flags.u32 &= ~FLAGS.isCachable;
    }

    get showsAboveParent() {
        return Boolean(this.#$flags.u32 & FLAGS.showsAboveParent);
    }

    set showsAboveParent(value) {
        value = Boolean(value);
        if (value === true) this.#$flags.u32 |= FLAGS.showsAboveParent;
        else this.#$flags.u32 &= ~FLAGS.showsAboveParent;
    }

    clone(source) {
        if (!(source instanceof $Renderable)) throw "Failed to clone data from an unknown object, please provide an instance of $Renderable.";
        this.color = source.color;
        this.borderWidth = source.borderWidth;
        this.opacity = source.borderWidth;
        this.isVisible = source.isVisible;
        this.renderFirst = source.renderFirst;
        this.isStar = source.isStar;
        this.isCachable = source.isCachable;
        this.showsAboveParent = source.showsAboveParent;
    }

    defaults() {
        this.color = 0;
        this.borderWidth = 7.5;
        this.opacity = 1;
        this.isVisible = true;
        this.renderFirst = false;
        this.isStar = false;
        this.isCachable = true;
        this.showsAboveParent = false;
    }
}

class $Cannon extends $Component {
    #$shootingAngle;
    constructor($) {
        super($);
        this.#$shootingAngle = $[FIELD_OFFSETS.cannon.shootingAngle];
    }

    get shootingAngle() {
        return this.#$shootingAngle.f32;
    }

    set shootingAngle(value) {
        this.#$shootingAngle.f32 = value;
    }

    clone(source) {
        if (!(source instanceof $Cannon)) throw "Failed to clone data from an unknown object, please provide an instance of $Cannon.";
        this.shootingAngle = source.shootingAngle;
    }

    defaults() {
        this.shootingAngle = 0;
    }
}

class $LinkedList {
    constructor(ptr, type, typeSize) {
        this.ptr = ptr;
        this.type = type;
        this.typeSize = typeSize;
    }

    push(...entries) {
        for (const entry of entries) this._append(this._end, entry);
        this.length += entries.length;
    }

    forEach(cb) {
        let current = $(this.ptr);
        while (current.i32) {
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
        while (current.i32) current = current.$;
        return current.at;
    }

    _append(last, entry) {
        const ptr = Module.exports.malloc(this.typeSize);
        $.write(ptr, this.type, entry);
        $.write(last, "$", ptr);
    }
}

class $Vector {
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
        if (this.entries.length > this.maxEntries) this._malloc();
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
        for (const entry of this.entries) {
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

class $EntityManager {
    static createNewEntity(simulation) {
        for (let i = 0; i < 16385; ++i) {
            if (!$(simulation).$[i][720].u8) {
                return Module.rawExports.createEntityAtIndex($(simulation).i32 + 12, i);
            }
        }
        return 0;
    }

    static getComponent(entity, name) {
        // These offsets don't change over versions (unless the components are reordered)
        switch (name) {
            case "Basic":
                return $(entity)[0x10][0x20][0x18][0 * 4].i32;
            case "CPUControllable":
                return $(entity)[0x10][0x20][0x18][1 * 4].i32;
            case "Cannon":
                return $(entity)[0x10][0x20][0x18][2 * 4].i32;
            case "Collidable":
                return $(entity)[0x10][0x20][0x18][3 * 4].i32;
            case "Destroyable":
                return $(entity)[0x10][0x20][0x18][4 * 4].i32;
            case "Dominator":
                return $(entity)[0x10][0x20][0x18][5 * 4].i32;
            case "ExampleComponent":
                return $(entity)[0x10][0x20][0x18][6 * 4].i32;
            case "MapInfo":
                return $(entity)[0x10][0x20][0x18][7 * 4].i32;
            case "Namable":
                return $(entity)[0x10][0x20][0x18][8 * 4].i32;
            case "PlayerInfo":
                return $(entity)[0x10][0x20][0x18][9 * 4].i32;
            case "Position":
                return $(entity)[0x10][0x20][0x18][10 * 4].i32;
            case "Renderable":
                return $(entity)[0x10][0x20][0x18][11 * 4].i32;
            case "Tagged":
                return $(entity)[0x10][0x20][0x18][12 * 4].i32;
            case "Tank":
                return $(entity)[0x10][0x20][0x18][13 * 4].i32;
            case "TeamInfo":
                return $(entity)[0x10][0x20][0x18][14 * 4].i32;
            default:
                return 0;
        }
    }


    /**
     * You need to free the returned ptr and ptr.$
     */
    static createComponentList({
        createBasic,
        createCPUControllable,
        createCannon,
        createCollidable,
        createDestroyable,
        createDominator,
        createExampleComponent,
        createMapInfo,
        createNamable,
        createPlayerInfo,
        createPosition,
        createRenderable,
        createTagged,
        createTank,
        createTeamInfo
    }) {
        let at = -1;
        const data = [];
        if (createBasic) {
            data.push((0 - at) ^ 1);
            at = 0;
        }
        if (createCPUControllable) {
            data.push((1 - at) ^ 1);
            at = 1;
        }
        if (createCannon) {
            data.push((2 - at) ^ 1);
            at = 2;
        }
        if (createCollidable) {
            data.push((3 - at) ^ 1);
            at = 3;
        }
        if (createDestroyable) {
            data.push((4 - at) ^ 1);
            at = 4;
        }
        if (createDominator) {
            data.push((5 - at) ^ 1);
            at = 5;
        }
        if (createExampleComponent) {
            data.push((6 - at) ^ 1);
            at = 6;
        }
        if (createMapInfo) {
            data.push((7 - at) ^ 1);
            at = 7;
        }
        if (createNamable) {
            data.push((8 - at) ^ 1);
            at = 8;
        }
        if (createPlayerInfo) {
            data.push((9 - at) ^ 1);
            at = 9;
        }
        if (createPosition) {
            data.push((10 - at) ^ 1);
            at = 10;
        }
        if (createRenderable) {
            data.push((11 - at) ^ 1);
            at = 11;
        }
        if (createTank) {
            data.push((12 - at) ^ 1);
            at = 12;
        }
        if (createTagged) {
            data.push((13 - at) ^ 1);
            at = 13;
        }
        if (createTeamInfo) {
            data.push((14 - at) ^ 1);
            at = 14;
        }
        data.push(1);
        const binview = Module.exports.malloc(12);
        $(binview)[0].i32 = Module.exports.malloc(data.length);
        Module.HEAPU8.set(data, $(binview)[0].i32);
        $(binview)[4].i32 = data.length;
        $(binview)[8].i32 = 0;
        return binview;
    }
}

const Decoder = new TextDecoder();
const Encoder = new TextEncoder();

const getter = ({ ptr }, prop) => {
    switch(prop) {
        case "at":
        case "ptr": return ptr;
        case "u8": return Module.HEAPU8[ptr];
        case "i8": return Module.HEAP8[ptr];
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
    if (to === undefined || to === null) return true;
    switch(prop) {
        case "u8":
            Module.HEAPU8[ptr] = to;
            return true;
        case "i8": 
            Module.HEAP8[ptr] = to;
            return true;
        case "u16":
            Module.HEAPU16[ptr >> 1] = to;
            return true;
        case "i16":
            Module.HEAP16[ptr >> 1] = to;
            return true;
        case "u32": 
            Module.HEAPU32[ptr >> 2] = to;
            return true;
        case "$": 
        case "i32":
            Module.HEAP32[ptr >> 2] = to;
            return true;
        case "u64": 
            Module.HEAPU64[ptr >> 3] = to;
            return true;
        case "f32": 
            Module.HEAPF32[ptr >> 2] = to;
            return true;
        case "f64":
            Module.HEAPF64[ptr >> 3] = to;
            return true;
        case "i64": 
            Module.HEAP64[ptr >> 3] = to;
            return true;
        case "u64": 
            Module.HEAPU64[ptr >> 3] = to;
            return true;
        case "utf8": {
            const buf = Encoder.encode(to.toString());
            Module.HEAPU8.set(buf, ptr);
            Module.HEAPU8[ptr + buf.byteLength] = 0;
            return true;
        }
        case "cstr": {
            const textBuf = Encoder.encode(to.toString());
            const len = textBuf.length;
            if(Module.HEAPU8[(ptr + 11) >> 0] === 0x80 && Module.HEAP32[ptr >> 2] < Module.HEAPU8 && Module.HEAP32[ptr >> 2] > DYNAMIC_TOP_PTR) Module.exports.free(Module.HEAP32[ptr >> 2]);
            Module.HEAPU8.set(new Uint8Array(12), ptr);
            if(len < 11) {
                Module.HEAPU8.set(textBuf, ptr);
                Module.HEAPU8[ptr + 11] = len;
                return true;
            }
            const strPtr = Module.exports.malloc(len + 1);
            Module.HEAPU8.set(textBuf, strPtr);
            Module.HEAPU8[strPtr + len] = 0;
            Module.HEAP32.set([strPtr, len, -0x7FFFFFE0], ptr >> 2);
            return true;
        }
        default:
            console.warn("Invalid property " + prop);
            return true;
    }
}

window.$ = ptr => new Proxy({ ptr }, { get: getter, set: setter });

$.write = (ptr, type, value) => {
    switch (type) {
        case "struct":
            return $.writeStruct(ptr, value);
        case "vector":
            return new $Vector(ptr, value.type, value.typeSize).push(...value.entries);
        case "cstr":
            Module.HEAP32.set([0, 0, 0], )
        default:
            return $(ptr)[type] = value;
    }
}

$.writeStruct = (ptr, fields) => {
    for (const {
            offset,
            type,
            value
        }
        of fields)
        $.write(ptr + offset, type, value);
}
