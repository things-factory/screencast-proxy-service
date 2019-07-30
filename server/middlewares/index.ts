var bonjour = require('bonjour')()
process.on('bootstrap-module-middleware' as any, app => {
  /* app에 middleware를 추가할 수 있다. */
  var browser = bonjour.find(
    {
      type: 'thingsfactory',
      protocol: 'tcp'
    },
    service => {
      ;(global as any).screencastServices = browser.services
    }
  )

  browser.start()
})
