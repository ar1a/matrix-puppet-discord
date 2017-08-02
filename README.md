# matrix-puppet-discord

## Installing

 * Clone matrix-puppet-bridge, use the development branch and run `npm link`
* Clone matrix-puppet-discord, use the development branch, run `npm link matrix-puppet-bridge` and then `npm link`
* Clone this, run `npm link matrix-puppet-bridge`, `npm link matrix-puppet-discord` and then `npm install` and `npm start`.

Add this to your matrix-puppet-server's config.json

```
  "networks": {
    "discord": {
      "identityPairs": {
        "<arbitrary identifier>": {
          "matrixPuppet": "<matrix username>",
          "thirdParty": {
              "token": "<USER TOKEN>",
              "guilds": [
                  "<guild ids here to bridge>"
              ]
          }
        }
      },
        "deduplication": {
            "tag": " \ufff0",
            "pattern": " \ufff0$"
        }
    }
  }
```
