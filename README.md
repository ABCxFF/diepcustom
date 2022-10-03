<br><br>
<div align="center">
<img src="./icon.png" width="20%" />
<h3> diep custom </h3>
<p> A recreation of diep's physics, protocol, and backend in TypeScript </p>
</div>
<br>

## Running backend

Starting a simple server instance (builds and runs):
```bash
$ npm run server
```

To connect to the server, open up a diep.io client from the version, build hash [`6f59094d60f98fafc14371671d3ff31ef4d75d9e`](https://static.diep.io/build_6f59094d60f98fafc14371671d3ff31ef4d75d9e.wasm.js) (August 2020), and redirect the WebSocket messages to `localhost:8080/game/diepio-ffa`.

As of now we are not providing the client files needed to serve. In the future we will provide a script that overrides your connection to the custom game server. In the near future we will provide a glitch.me link, so that people can remix their own version of the server and try out custom changes.

Consult `src/config.ts` for configuration, and `package.json` for environ variable setup.

## Discord Chat

For support or discussion, please join our [online Discord chat](https://discord.gg/SyxWdxgHnT).


## Contribution

All issues should be relate to critical bugs, stat related inconsistencies, or undefined or misdefined behavior.

All pull requests should be made to address these issues.

## License

All files are GNU AGPLv3
> DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
> Copyright (C) 2022 ABCxFF (github.com/ABCxFF)
> 
> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU Affero General Public License as published
> by the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.
> 
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
> GNU Affero General Public License for more details.
> 
> You should have received a copy of the GNU Affero General Public License
> along with this program. If not, see <https://www.gnu.org/licenses/>
