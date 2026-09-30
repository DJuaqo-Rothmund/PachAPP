// Metro también observa ../src para compartir datos, tipos y reglas del juego con la web.
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
config.watchFolders = [path.resolve(__dirname, '../src')]
// Resolver siempre desde mobile/node_modules para no mezclar dependencias de la web.
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')]

module.exports = config
