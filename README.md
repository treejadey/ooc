The OOC alias, referred to by "$$ooc" in the chat, allows you to store text
messages into the custom channel data.

Due to limitations of Supibot, it is not possible to know who was the author of
the actual message you add. It only saves the person who actually ADDED the
message.

The data of the saved messages is unique for each channel. This means that if
you pin a message in `#pajlada`, and then you pin a different message in
`#supinic`, each channel will only have 1 message: the message you added in the
respective channel.

# How to build

Assuming you already have `pnpm`, which you should have.

```sh
$ pnpm run build
```

After you build the project, you will find a `main.js` file in the `dist/`
directory. While you are most of the way there, before you can shove the
JavaScript code into a gist, and call it a day, you need to do a little bit of
manual work.

If you'll look into the `main.js` file, you will see a lot of code. What should
interest you, of course, is the fact that, by default, `esbuild`, the bundler
required for this thing to work, wraps all of the code in an Immediately
Executed Function Expression.

Instead of just running all of the code willy-nilly, the proper way to do things
in Supibot, is to define a function which will serve as the main entrypoint, and
run that within $js. This means, that, for the code to work correctly, you need
to get rid of the Immediately Executed Function Expression.

What this means for you, is that you will see something like:

```
"use strict";
(() => {
  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/Maybe.js
  var Maybe = {}
  // blahblahblah insert more stuff here
})();
```

In the code. For things to work, you need to nuke this thing out of orbit, so it
will look something like this instead:

```
"use strict";

  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/Maybe.js
  var Maybe = {}
  // blahblahblah insert more stuff here
```

After you're done, you can shove all of the code into a gist, and then create a
supibot alias, which should look something like this:

```
$alias create ooc-devel js importGist:!!!INSERT_A_GIST_ID_HERE_PLEASE!!! errorInfo:true function:"main(args)" ${0+}
```

And that's it, congratulations, you won.
