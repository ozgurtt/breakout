/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Couchfriends
 * www.couchfriends.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Ball object
 * @constructor
 */
BreakOut.Paddle = function () {

    BreakOut.Element.call(this);

    this.name = 'paddle';

    this.team = 'A';

    this.color = randomColor().replace(/#/, '0x');

    this.texture = 'paddle001.png';

    this.speed = {
        x: 0
    };

    // List of effects that applied to the paddle. Like 'sticky', 'frozen'
    this.effects = [];

};

BreakOut.Paddle.prototype = Object.create(BreakOut.Element.prototype);

BreakOut.Paddle.prototype.init = function (settings) {

    this.texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + this.texture);
    this.object = new PIXI.Sprite(this.texture);
    //var normalMapTexture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + "brick-normal.png");
    //this.object.normalTexture = normalMapTexture;
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;
    var ballLight = new PIXI.lights.PointLight(this.color, 1);
    this.object.tint = this.color;
    this.object.addChild(ballLight);

};

BreakOut.Paddle.prototype.setSpeed = function (x) {

    this.speed.x = x;

};

BreakOut.Paddle.prototype.applyEffect = function (effect) {

    switch (effect) {
        case 'freeze':
            var timeout = 240; // in fps
            var effectObject = {
                effect: 'freeze',
                endTimer: BreakOut.timer + timeout,
                object: ''
            };
            var found = false;
            for (var i = 0; i < this.effects.length; i++) {
                if (this.effects[i].effect == 'freeze') {
                    effectObject.endTimer = (this.effects[i].endTimer + timeout);
                    effectObject.object = this.effects[i].object;
                    this.effects.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (found == false) {
                // add freezing effect
                var texture = PIXI.Texture.fromImage(BreakOut.settings.assetDir + 'effect-freeze.png');
                var object = new PIXI.Sprite(texture);
                object.anchor.x = .5;
                object.anchor.y = .5;
                object.position.y = 8;
                effectObject.object = object;
                this.object.addChild(object);

            }
            this.effects.push(effectObject);
            break;
        default:
            console.log(effect);
    }

};

/**
 * Remove one or more effects
 */
BreakOut.Paddle.prototype.removeEffect = function (effect) {

    var effects = [];
    if (typeof effect == 'string') {
        effect = [effect];
    }
    for (var i = 0; i < effect.length; i++) {
        for (var i = 0; i < this.effects.length; i++) {
            if (this.effects[i].effect == effect[i]) {
                // Might wanna do something
                if (this.effects[i].object != '') {
                    this.object.removeChild(this.effects[i].object);
                }
                continue;
            }
            effects.push(this.effects[i]);
        }
    }
    this.effects = effects;
};

BreakOut.Paddle.prototype.update = function (time) {

    if (!BreakOut.Element.prototype.update.call(this, time)) {
        return false;
    }
    var speedX = this.speed.x;

    var removeEffects = [];
    for (var i = 0; i < this.effects.length; i++) {
        if (this.effects[i].endTimer < BreakOut.timer) {
            removeEffects.push(this.effects[i].effect);
            continue;
        }
        if (this.effects[i].endTimer - BreakOut.timer < 120 && this.effects[i].object != '') {
            var visible = true;
            if (BreakOut.timer % 20 < 5) {
                visible = false;
            }
            this.effects[i].object.visible = visible;
        }
        if (this.effects[i].effect == 'freeze') {
            speedX *= .5;
        }
    }
    if (removeEffects.length > 0) {
        this.removeEffect(removeEffects);
    }
    this.object.position.x += speedX;
    if (this.object.position.x < 0) {
        this.object.position.x = 0;
    }
    if (this.object.position.x > BreakOut.settings.width) {
        this.object.position.x = BreakOut.settings.width;
    }
    return true;
};