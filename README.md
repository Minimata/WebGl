# WebGl

A repository to store and improve exercises for Stephane Gobron's WebGL courses.

A good praactice would be to gently migrate to a more ES6 syntax.

## conventions

Files added should be named : YOURNAME_CHX, with X the number of the chapter.
For exemple, I named my personnal files ALEX_CH04 for the fourth chapter.
Feel free to separate JS from HTML and to store your personnal js files in jsExos directory instead of js directory.

## What changed from Gobron's repo ?

### webglTools

Complete refactor of the file.
This means no multiple "return" in a file, no "break" in "for" loop, just plain nice written JS, with a proper renderLoop method.
This also means : exception throwing to give better Debug options in your console.

### webgl-debug.js

Define methods to catch errors and exceptions to throw in case of errors caught.

###common-functions.js

deleted useless code and arguments.

## How to get it working on your project

Copy my webglTools.js from sharedJs directory and use it to overwrite the old one.
Include webgl-debug.js in your html code.
Put your calls to any webglTools.js (usually in initWebGl method) in a try - catch block.

That's it ! You're ready to go !

## Recommendations

Install WebGL Inspector for further debug (available as add-on in Chrome and Firefox at least). Google it yourself, I'm lazy.

Please criticize the refactored code if you think you can improve it.

Ask me (@Minimata) to be a contributor if you want.
