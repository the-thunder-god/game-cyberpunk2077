const path = require('path');
const { fs, log, util } = require('vortex-api');
const winapi = require('winapi-bindings');
// Nexus Mods domain for the game. e.g. nexusmods.com/bloodstainedritualofthenight
const GAME_ID = 'cyberpunk2077';
//Steam Application ID, you can get this from https://steamdb.info/apps/
const STEAMAPP_ID = '1091500';
//GOG Application ID, you can get this from https://www.gogdb.org/
const GOGAPP_ID = '1423049311';
//Epic Application ID
const EPICAPP_ID = 'Ginger';

function main(context) {
  //This is the main function Vortex will run when detecting the game extension. 
	context.registerGame({
        id: GAME_ID,
        name: 'Cyberpunk 2077',
        mergeMods: true,
        queryPath: findGame,
        queryModPath: () => '',
        logo: 'gameart.jpg',
        executable: () => 'bin/x64/Cyberpunk2077.exe',
        requiredFiles: [
          'bin/x64/Cyberpunk2077.exe'
        ],
        supportedTools: [],
        requiresLauncher: requiresGoGLauncher,
        setup: prepareForModding,
        environment: {
          SteamAPPId: STEAMAPP_ID
        },
        details: {
          steamAppId: STEAMAPP_ID,
          gogAppId: GOGAPP_ID,
          epicAppId: EPICAPP_ID
        }
      });

    return true
}

function findGame() {
  try {
    const instPath = winapi.RegGetValue(
      'HKEY_LOCAL_MACHINE',
      'SOFTWARE\\WOW6432Node\\GOG.com\\Games\\' + GOGAPP_ID,
      'PATH');
    if (!instPath) {
      throw new Error('empty registry key');
    }
    console.log("Install Path: " + instPath.value)
    return Promise.resolve(instPath.value);
  } catch (err) {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID,GOGAPP_ID,EPICAPP_ID])
      .then(game => game.gamePath);
  }    
}

function requiresGoGLauncher() {
  return util.GameStoreHelper.isGameInstalled(GOGAPP_ID, 'gog')
    .then(gog => gog
      ? { launcher: 'gog', addInfo: GOGAPP_ID }
      : undefined);
}

function prepareForModding(discovery) {
    return fs.readdirAsync(path.join(discovery.path));
}

module.exports = {
    default: main,
  };