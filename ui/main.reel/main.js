/**
    @module "ui/main.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/main.reel".Main
    @extends module:ui/component.Component
*/
exports.Main = Montage.create(Component, /** @lends module:"ui/main.reel".Main# */ {

    flowRibbon: {
        serializable: true,
        value: null
    },

    pageWidth: {
        value: 800
    },

    pointInCircleAt: { // returns a point in a unit radius circle with center at origin for a given angle
        value: function (angle) {
            return [Math.cos(angle), Math.sin(angle)];
        }
    },

    tangentInCircleAt: { // returns normalized tangent vector for a point in a circle at a given angle
        value: function (angle) {
            return [-Math.sin(angle), Math.cos(angle)];
        }
    },

    scaleVector: {
        value: function (vector, scale) {
            return [
                vector[0] * scale,
                vector[1] * scale
            ];
        }
    },

    templateDidLoad: {
        value: function () {
            var pagesKnots = [],
                evenPagesKnots = [],
                bezierHandlerLength = .130976446, // magic number, optimized length of a handler to create a 16-segments cubic bezier unit radius circle
                point,
                tangent,
                angle,
                halfPageWidth = 1000,
                i,
                k=0,
                self = this;

            for (i = -7; i <= 15; i++) {
                angle = Math.PI - i * Math.PI / 8;
                point = this.scaleVector(this.pointInCircleAt(angle), halfPageWidth);
                tangent = this.scaleVector(this.tangentInCircleAt(angle), halfPageWidth * bezierHandlerLength);
                pagesKnots.push(
                    {
                        "knotPosition": [point[0], (i-4)*141, point[1]],
                        "previousHandlerPosition": [point[0] + tangent[0], (i-4)*141-47, point[1] + tangent[1]],
                        "nextHandlerPosition": [point[0] - tangent[0], (i-4)*141+47, point[1] - tangent[1]],
                        "previousDensity": 1,
                        "nextDensity": 1,
                        "rotateY": Math.PI/2 - angle,
                        "rotateX": -Math.PI/16 + angle / 8,
                        "opacity": ((i > 1) && (i < 7)) ? .999 : (11 - Math.abs(i - 4)) / 11
                    }
                );
            }
            this.flowRibbon.paths = [
                {
                    "knots": pagesKnots,
                    "headOffset": 11,
                    "tailOffset": 11,
                    "units": {
                        "rotateY": "rad",
                        "rotateX": "rad",
                        "opacity": ""
                    }
                }
            ];
        }
    }

});
