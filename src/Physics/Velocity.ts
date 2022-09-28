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
import Vector, { VectorAbstract } from "./Vector";

export default class Velocity extends Vector {
    private previousPosition = new Vector();
    public position = new Vector();
    private firstTime = true;

    public updateVelocity() {
        this.x = this.position.x - this.previousPosition.x;
        this.y = this.position.y - this.previousPosition.y;
    }

    public setPosition(newPosition: VectorAbstract) {
        this.previousPosition.set(this.position);
        this.position.set(newPosition);
        if (this.firstTime) {
            this.previousPosition.set(newPosition);
            this.firstTime = false;
        }
        this.updateVelocity();
    }
}
