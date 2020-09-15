var mdns = require('mdns')
var browser
var services = {}

process.on('bootstrap-module-middleware' as any, async (app) => {
  try {
    var sequence = [
      mdns.rst.DNSServiceResolve(),
      'DNSServiceGetAddrInfo' in mdns.dns_sd
        ? mdns.rst.DNSServiceGetAddrInfo()
        : mdns.rst.getaddrinfo({ families: [4] }),
      mdns.rst.makeAddressesUnique(),
    ]

    browser = mdns.createBrowser(mdns.tcp('thingsfactory'), { resolverSequence: sequence })

    browser.on('serviceUp', (service) => {
      services[service.name] = service
      ;(global as any).screencastServices = [...Object.values(services)]
    })
    browser.on('serviceDown', (service) => {
      delete services[service.name]
      ;(global as any).screencastServices = [...Object.values(services)]
    })

    browser.start()
  } catch (e) {
    console.error(e)
  }
})

process.on('exit' as any, (code) => {
  if (browser) {
    browser.stop()
    browser = null
  }
})
