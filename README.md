<br><br>
<div align="center">
<img src="./icon.png" width="20%" />
<h3> diep custom </h3>
<p> A recreation of diep's physics, protocol, and backend in Typescript </p>
</div>
<br>

## Running backend

First, download the client with
```bash
$ node client/pull.js
```

Then run the server with:
```bash
$ npm run server
```
This builds and runs the server.

After downloading the client and running the server, content will be served at `localhost:8080` on your computer. The port will default to 8080, and you may override it with `process.env.PORT`.

Consult `src/config.ts` for configuration, and `package.json` for environ variable setup.

## Discord Chat

For support or discussion, please join our [online Discord chat](https://discord.gg/SyxWdxgHnT).


## Contribution

All issues should be relate to critical bugs, stat related inconsistencies, or undefined/misdefined behavior.

### Pull Requests

When making a pull request, please indicate whether you are either:
  1. Patching an issue documented in Issues
  2. Fixing a documentation related error (grammar, syntax, etc in markdown or comments)
  
If the reason for your pull request differs from these two, then summarize both the issue and the changes you made.

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
