# embark-solium
The official [Solium](https://github.com/duaraghav8/Solium) Plugin for the [Embark Framework](https://github.com/iurimatias/embark-framework)

## Install
Make sure you have [embark](https://www.npmjs.com/package/embark) installed globally.

Traverse to your Embark Project Directory, then run `npm install --save embark-solium`.

## Use
- In your `embark.json`, add `embark-solium` to the list of plugins:
```json
"plugins": {
    "embark-solium": {}
}
```
- (Assuming `embark simulator` is already running), launch the Embark Dashboard using `embark run`.
- On the console, run `solium --init`. This will create `.soliumrc.json` & `.soliumignore` in the **root directory**.

You're all set! Now every time you make changes to any solidity file, Solium produces the lint issues in the Embark Console.

If you'd like to know which version of Solium `embark-solium` is running, simply run `solium --help`

## Roadmap
- [ ] Enable Solium's autofixing feature
- [ ] Allow user to change location of Solium config files
- [ ] Tests!

## Links
- Solium: [User Documentation](http://solium.readthedocs.io/en/latest/user-guide.html)
- Solium: List of [core](http://solium.readthedocs.io/en/latest/user-guide.html#list-of-core-rules) & [security](https://www.npmjs.com/package/solium-plugin-security#list-of-rules) rules applied
- Embark: [Plugin Documentation](http://embark.readthedocs.io/en/latest/plugins.html)
