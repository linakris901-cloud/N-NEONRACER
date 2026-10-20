# Third-party notices

## Steve-IX/Speed_Racer_Game — `car.js`

Repository: https://github.com/Steve-IX/Speed_Racer_Game
Source file: https://github.com/Steve-IX/Speed_Racer_Game/blob/main/car.js
Copyright (c) 2024 Steve-IX
License: MIT License

Adapted portions: the rounded car-body path (`drawCarShape`) and the windshield, headlight, taillight, racing-stripe and chrome-bumper layout (`drawCarDetails`). Adapted functions are in `js/game.js` as `githubCarShape` and `githubCarDetails`; they are used to draw traffic cars and vans. The rest of NEON RACER ULTIMATE is a separate implementation.

MIT License

Copyright (c) 2024 Steve-IX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Player vehicle renderer

The player's in-race car renderer also uses the adapted `githubCarShape` and `githubCarDetails` functions from the MIT-licensed `Steve-IX/Speed_Racer_Game` source listed above. The player-specific renderer adds model-specific neon liveries, wheel details, glass reflections, and nitro effects. The garage uses this same renderer to create local canvas previews for each selectable car, so no remote image hotlinks are required. The original attribution and MIT notice are retained.
