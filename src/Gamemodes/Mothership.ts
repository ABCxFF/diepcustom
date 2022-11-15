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

import Client from "../Client";
import { ClientBound, Colors, GUIFlags, MothershipFlags } from "../Const/Enums";
import Mothership from "../Entity/Misc/Mothership";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";


const arenaSize = 11150;
/**
 * Domination Gamemode Arena
 */
export default class MothershipArena extends ArenaEntity {
    /** Blue Team entity */
    public blueTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamBlue);
    /** Red Team entity */
    public redTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamRed);

    public mothershipBlue: Mothership = new Mothership(this);

    public mothershipRed: Mothership = new Mothership(this);

    public constructor(game: GameServer) {
        super(game);

       this.arena.GUI |= GUIFlags.hideScorebar;

       this.blueTeam.team.values.mothership |= MothershipFlags.showArrow;
       this.redTeam.team.values.mothership |= MothershipFlags.showArrow;

       this.updateBounds(arenaSize * 2, arenaSize * 2);

       const { x, y } = this.findSpawnLocation();
        
       this.mothershipBlue.relations.values.team = this.blueTeam;
       this.mothershipBlue.style.values.color = this.blueTeam.team.values.teamColor;
       this.mothershipBlue.position.values.x = 10000;
       this.mothershipBlue.position.values.y = 0;

       this.mothershipRed.relations.values.team = this.redTeam;
       this.mothershipRed.style.values.color = this.redTeam.team.values.teamColor;
       this.mothershipRed.position.values.x = -10000;
       this.mothershipRed.position.values.y = 0;

    }
    public spawnPlayer(tank: TankBody, client: Client) {

         const { x, y } = this.findSpawnLocation();
        
        if (Math.random() < 0.5) {
            tank.relations.values.team = this.blueTeam;
            tank.style.values.color = this.blueTeam.team.values.teamColor;
        } else {
            tank.relations.values.team = this.redTeam;
            tank.style.values.color = this.redTeam.team.values.teamColor;
        }

        tank.position.values.x = x;
        tank.position.values.y = y;

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
	public updateScoreboard(scoreboardPlayers: Mothership[]) {
                        this.arena.scoreboardAmount = 2;
		
			const ms0 = this.mothershipBlue;
			this.blueTeam.team.mothershipX = ms0.position.values.x;
			this.blueTeam.team.mothershipY = ms0.position.values.y;

			const ms1 = this.mothershipRed;
			this.redTeam.team.mothershipX = ms1.position.values.x;
			this.redTeam.team.mothershipY = ms1.position.values.y;

                        const player = this.mothershipBlue
                        const player2 = this.mothershipRed
			/** @ts-ignore */
			if (player.style.values.color === Colors.Tank) this.arena.values.scoreboardColors[0] = Colors.ScoreboardBar;
			/** @ts-ignore */
			else this.arena.values.scoreboardColors[0] = player.style.values.color;
			/** @ts-ignore */
			this.arena.values.scoreboardNames[0] = "BLUE";
			
			/** @ts-ignore */
			this.arena.values.scoreboardScores[0] = player.health.values.health;
			/** @ts-ignore */
			this.arena.values.scoreboardTanks[0] =-1;
                                        this.arena.values.scoreboardSuffixes[0] = " HP"

			/** @ts-ignore */
			if (player2.style.values.color === Colors.Tank) this.arena.values.scoreboardColors[0] = Colors.ScoreboardBar;
			/** @ts-ignore */
			else this.arena.values.scoreboardColors[1] = player2.style.values.color;
			/** @ts-ignore */
			this.arena.values.scoreboardNames[1] = "RED";
			
			/** @ts-ignore */
			this.arena.values.scoreboardScores[1] = player2.health.values.health;
			/** @ts-ignore */
			this.arena.values.scoreboardTanks[1] =-1;
                                        this.arena.values.scoreboardSuffixes[1] = " HP"

	}   
public tick (tick: number) {
   super.tick(tick)
   if (this.mothershipBlue.health.values.health <= 0 && !this.hasFinished) {
        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT("RED HAS WON THE GAME!")
            .u32(0xF14E54)
            .float(-1)
            .stringNT("").send();
 setTimeout(() => {
				this.close();
			}, 10000); 
            this.hasFinished = true;
} else if (this.mothershipRed.health.values.health <= 0 && !this.hasFinished) {
        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT("BLUE HAS WON THE GAME!")
            .u32(0x00B1DE)
            .float(-1)
            .stringNT("").send();

                    			setTimeout(() => {
				this.close();
			}, 10000);
            this.hasFinished = true;
            }
}

}
