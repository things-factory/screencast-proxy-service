var mdns = require('mdns')
var browser
var services = {}
process.on('bootstrap-module-middleware' as any, async app => {
  /* app에 middleware를 추가할 수 있다. */
  browser = mdns.createBrowser(mdns.tcp('thingsfactory'))

  browser.on('serviceUp', service => {
    services[service.name] = service
    ;(global as any).screencastServices = [...Object.values(services)]
  })
  browser.on('serviceDown', service => {
    delete services[service.name]
    ;(global as any).screencastServices = [...Object.values(services)]
  })

  browser.start()
})

process.on('exit' as any, code => {
  if (browser) {
    browser.stop()
    browser = null
  }
})
