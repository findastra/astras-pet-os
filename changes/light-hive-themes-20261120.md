# Light Hive: themes that follow the music (2026-11-20)

Astra: "I want you to make the lights change depending on the music ... jsut general themes woirks. like lightening
for thunderstorms ... yes do those other things yes"

- Sync my lights (`apps/rgbee-sync-my-lights-20261108.html`) gets Themes: Storm, Rainforest, Party, Chill, Fire, with
  "Follow the music". The helper plays them, so they keep going with the page closed; Send or Lights off stops them.
- Govee lights count as reached by Bluetooth (light-hive-helper 1.1, findastra/rgbee, same day).
- System Map: the sync tool and light-hive-helper texts say themes, Bluetooth and the light-hive MCP.
- Pages rebuilt with `npm run build`.

Claude Opus 5.5 (`claude-opus-5-5`), 2026-11-20.

## rgbee-color-corrector (same night)

Astra: "cant even identify which nodes and mitigate it? ... also make the tool the rgbee-color-corrector on the agent
hub". New Light Hive tool `apps/rgbee-color-corrector-20261120.html` (System Map node `rgbee-color-corrector`): mark
the Light Strip sections whose LEDs lost a colour (under the desk lost red, the corner by the mirror lost green), find a
section on the wall, and light-hive-helper 1.1 sends those sections only the colours they can still show. Rainforest
storm also joins the themes.

## light-hive-server (same night)

Astra: "Let's go with Light Hive server. Remember to push the date, light hive server dash, and then that number that the
date is that the server was last updated." light-hive-helper is now **light-hive-server**, Light Hive's server; its
program file carries the date it was last updated (`light-hive-server-20261120.exe`, findastra/rgbee `server/`). System
Map node, the tools' text and the port watch use the new name; the file pages read (`light-hive-helper-data.js`) keeps
its old name so every page still finds the server.
