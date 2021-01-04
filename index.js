//Import some assets from Vortex we'll need.
const path = require('path');
// Nexus Mods domain for the game. e.g. nexusmods.com/bloodstainedritualofthenight
const GAME_ID = 'cyberpunk2077';
//Steam Application ID, you can get this from https://steamdb.info/apps/
const STEAMAPP_ID = '1091500';
//GOG Application ID, you can get this from https://www.gogdb.org/
const GOGAPP_ID = '1423049311';
const { fs, log, util } = require('vortex-api');

function main(context) {
	//This is the main function Vortex will run when detecting the game extension. 
	context.registerGame({
        id: GAME_ID,
        name: 'Cyberpunk 2077',
        mergeMods: true,
        queryPath: findGame,
        supportedTools: [],
        queryModPath: () => '',
        logo: 'gameart.jpg',
        executable: () => 'bin/x64/Cyberpunk2077.exe',
        requiredFiles: [
          'bin/x64/Cyberpunk2077.exe'
        ],
        setup: undefined,
        environment: {
          SteamAPPId: STEAMAPP_ID,
        },
        details: {
          steamAppId: STEAMAPP_ID,
          gogAppId: GOGAPP_ID,
        },
      });

    return true
}

function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID, GOGAPP_ID])
        .then(game => game.gamePath);
}

function prepareForModding(discovery) {
    return fs.readdirAsync(path.join(discovery.path));
}

module.exports = {
    default: main,
  };