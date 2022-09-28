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

import { FieldGroupID } from "../Native/Entity";
import { RelationField, BarrelField, PhysicsField, HealthField, UnusedField, ArenaField, NameField, CameraField, PositionField, StyleField, ScoreField, TeamField } from "../Native/FieldGroups";

/** A type with field names. */
export type FieldName = (RelationField | BarrelField | PhysicsField | HealthField | UnusedField | ArenaField | NameField | CameraField | PositionField | StyleField | ScoreField | TeamField);
/**
 * Format of storing fields in the field list (`List`).
 */
export type FieldDef = {
    name: FieldName,
    group: FieldGroupID,
    encType: "vu" | "stringNT" | "entid" | "float" | "vi",
    amount?: number,
    id: number,
    default: number | string | null,
    index: number,
}

/**
 * Total list of all fields.
 * ```ts
 * An array of {
 *  name: FieldName,
 *  group: FieldGroupID,
 *  encType: "vu" | "stringNT" | "entid" | "float" | "vi",
 *  amount?: number,
 *  id: number,
 *  default: number | string | null,
 *  index: number,
 * }
 * ```
 */
export const List: Record<FieldName, FieldDef> = JSON.parse(`{"y":{"name":"y","group":10,"id":1,"encType":"vi","default":0,"index":0},"x":{"name":"x","group":10,"id":0,"encType":"vi","default":0,"index":1},"angle":{"name":"angle","group":10,"id":2,"encType":"radians","default":0,"index":2},"size":{"name":"size","group":3,"id":2,"encType":"float","default":0,"index":3},"player":{"name":"player","group":9,"id":2,"encType":"entid","default":null,"index":4},"GUI":{"name":"GUI","group":7,"id":0,"encType":"vu","default":2,"index":5},"color":{"name":"color","group":11,"id":1,"encType":"vu","default":0,"index":6},"scoreboardColors":{"name":"scoreboardColors","group":7,"id":8,"amount":10,"encType":"vu","default":13,"index":7},"killedBy":{"name":"killedBy","group":9,"id":16,"encType":"stringNT","default":"","index":8},"playersNeeded":{"name":"playersNeeded","group":7,"id":13,"encType":"vi","default":0,"index":9},"sides":{"name":"sides","group":3,"id":1,"encType":"vu","default":0,"index":10},"mothership":{"name":"mothership","group":14,"id":3,"encType":"vu","default":0,"index":11},"healthbar":{"name":"healthbar","group":4,"id":0,"encType":"vu","default":0,"index":12},"scoreboardTanks":{"name":"scoreboardTanks","group":7,"id":10,"amount":10,"encType":"vi","default":0,"index":13},"respawnLevel":{"name":"respawnLevel","group":9,"id":15,"encType":"vi","default":0,"index":14},"levelbarProgress":{"name":"levelbarProgress","group":9,"id":6,"encType":"float","default":0,"index":15},"spawnTick":{"name":"spawnTick","group":9,"id":17,"encType":"vi","default":0,"index":16},"absorbtionFactor":{"name":"absorbtionFactor","group":3,"id":4,"encType":"float","default":1,"index":17},"leaderX":{"name":"leaderX","group":7,"id":11,"encType":"float","default":0,"index":18},"maxHealth":{"name":"maxHealth","group":4,"id":2,"encType":"float","default":1,"index":19},"styleFlags":{"name":"styleFlags","group":11,"id":0,"encType":"vu","default":1,"index":20},"unknown":{"name":"unknown","group":6,"id":0,"encType":"vi","default":0,"index":21},"trapezoidalDir":{"name":"trapezoidalDir","group":2,"id":3,"encType":"float","default":0,"index":22},"motion":{"name":"motion","group":10,"id":3,"encType":"vu","default":0,"index":23},"scoreboardNames":{"name":"scoreboardNames","group":7,"id":6,"amount":10,"encType":"stringNT","default":"","index":24},"scorebar":{"name":"scorebar","group":9,"id":14,"encType":"float","default":0,"index":25},"mothershipY":{"name":"mothershipY","group":14,"id":2,"encType":"float","default":0,"index":26},"scoreboardSuffixes":{"name":"scoreboardSuffixes","group":7,"id":9,"amount":10,"encType":"stringNT","default":"","index":27},"nametag":{"name":"nametag","group":8,"id":0,"encType":"vu","default":0,"index":28},"movementSpeed":{"name":"movementSpeed","group":9,"id":20,"encType":"float","default":2.55,"index":29},"leaderY":{"name":"leaderY","group":7,"id":12,"encType":"float","default":0,"index":30},"bottomY":{"name":"bottomY","group":7,"id":4,"encType":"float","default":0,"index":31},"team":{"name":"team","group":0,"id":2,"encType":"entid","default":null,"index":32},"level":{"name":"level","group":9,"id":4,"encType":"vi","default":0,"index":33},"teamColor":{"name":"teamColor","group":14,"id":0,"encType":"vu","default":0,"index":34},"FOV":{"name":"FOV","group":9,"id":3,"encType":"float","default":0.35,"index":35},"statLimits":{"name":"statLimits","group":9,"id":11,"amount":8,"encType":"vi","default":0,"index":36},"leftX":{"name":"leftX","group":7,"id":1,"encType":"float","default":0,"index":37},"scoreboardScores":{"name":"scoreboardScores","group":7,"id":7,"amount":10,"encType":"float","default":0,"index":38},"statLevels":{"name":"statLevels","group":9,"id":10,"amount":8,"encType":"vi","default":0,"index":39},"tankOverride":{"name":"tankOverride","group":9,"id":19,"encType":"stringNT","default":"","index":40},"tank":{"name":"tank","group":9,"id":5,"encType":"vi","default":53,"index":41},"borderThickness":{"name":"borderThickness","group":11,"id":2,"encType":"vi","default":480,"index":42},"deathTick":{"name":"deathTick","group":9,"id":18,"encType":"vi","default":-1,"index":43},"width":{"name":"width","group":3,"id":3,"encType":"float","default":0,"index":44},"statsAvailable":{"name":"statsAvailable","group":9,"id":8,"encType":"vi","default":0,"index":45},"shooting":{"name":"shooting","group":2,"id":0,"encType":"vu","default":0,"index":46},"levelbarMax":{"name":"levelbarMax","group":9,"id":7,"encType":"float","default":0,"index":47},"name":{"name":"name","group":8,"id":1,"encType":"stringNT","default":"","index":48},"owner":{"name":"owner","group":0,"id":1,"encType":"entid","default":null,"index":49},"health":{"name":"health","group":4,"id":1,"encType":"float","default":1,"index":50},"cameraY":{"name":"cameraY","group":9,"id":13,"encType":"float","default":0,"index":51},"opacity":{"name":"opacity","group":11,"id":3,"encType":"float","default":1,"index":52},"reloadTime":{"name":"reloadTime","group":2,"id":1,"encType":"float","default":15,"index":53},"statNames":{"name":"statNames","group":9,"id":9,"amount":8,"encType":"stringNT","default":"","index":54},"cameraX":{"name":"cameraX","group":9,"id":12,"encType":"float","default":0,"index":55},"mothershipX":{"name":"mothershipX","group":14,"id":1,"encType":"float","default":0,"index":56},"GUIunknown":{"name":"GUIunknown","group":9,"id":0,"encType":"vu","default":2,"index":57},"parent":{"name":"parent","group":0,"id":0,"encType":"entid","default":null,"index":58},"zIndex":{"name":"zIndex","group":11,"id":4,"encType":"vu","default":0,"index":59},"camera":{"name":"camera","group":9,"id":1,"encType":"vu","default":0,"index":60},"rightX":{"name":"rightX","group":7,"id":3,"encType":"float","default":0,"index":61},"pushFactor":{"name":"pushFactor","group":3,"id":5,"encType":"float","default":8,"index":62},"objectFlags":{"name":"objectFlags","group":3,"id":0,"encType":"vu","default":0,"index":63},"scoreboardAmount":{"name":"scoreboardAmount","group":7,"id":5,"encType":"vu","default":0,"index":64},"ticksUntilStart":{"name":"ticksUntilStart","group":7,"id":14,"encType":"float","default":250,"index":65},"topY":{"name":"topY","group":7,"id":2,"encType":"float","default":0,"index":66},"score":{"name":"score","group":13,"id":0,"encType":"float","default":0,"index":67}}`);

/**
 * Takes in a list of field names, and orders them by the field order, then returns it back.
 */
export const order = (names: FieldName[]) => names.sort((n1, n2) => {
    try {
        return List[n1].index - List[n2].index;
    } catch (err) {
        console.log(n1, n2)
        throw err
    }
});