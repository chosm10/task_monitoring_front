module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/production-sub-path/'
  : '/Users/Administrator/Desktop/dist/',
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{proxy: 'http://10.103.200.52:8081'} 
}
