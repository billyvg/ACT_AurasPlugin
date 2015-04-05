// fiddle: http://jsfiddle.net/v1ddnsvh/8/
/* global window */

var IMAGE_PATH = 'images';

var React = window.React;


    function Auras() {"use strict";
        this.$Auras_auras = {};
    }

    Object.defineProperty(Auras.prototype,"add",{writable:true,configurable:true,value:function(aura) {"use strict";
        this.$Auras_auras[aura] = true;
    }});

    Object.defineProperty(Auras.prototype,"remove",{writable:true,configurable:true,value:function(aura) {"use strict";
        this.$Auras_auras[aura] = false;
    }});

    Object.defineProperty(Auras.prototype,"has",{writable:true,configurable:true,value:function(aura) {"use strict";
        return this.$Auras_auras[aura];
    }});



    function Stance() {"use strict";
        this.$Stance_stance = {};
    }

    Object.defineProperty(Stance.prototype,"setStance",{writable:true,configurable:true,value:function(stance, timer) {"use strict";
        if (this.clearStanceId) {
            clearTimeout(this.clearStanceId);
        }

        this.$Stance_stance = {};
        this.$Stance_stance[stance] = true;

        this.clearStanceId = setTimeout(function() {
            this.$Stance_stance = {};
        }.bind(this), timer || 10000);
    }});

    Object.defineProperty(Stance.prototype,"inStance",{writable:true,configurable:true,value:function(stance) {"use strict";
        return !!this.$Stance_stance[stance];
    }});


var stances = new Stance();
var auras = new Auras();

var ____Classi=React.Component;for(var ____Classi____Key in ____Classi){if(____Classi.hasOwnProperty(____Classi____Key)){SpriteTexture[____Classi____Key]=____Classi[____Classi____Key];}}var ____SuperProtoOf____Classi=____Classi===null?null:____Classi.prototype;SpriteTexture.prototype=Object.create(____SuperProtoOf____Classi);SpriteTexture.prototype.constructor=SpriteTexture;SpriteTexture.__superConstructor__=____Classi;function SpriteTexture(){"use strict";if(____Classi!==null){____Classi.apply(this,arguments);}}
    Object.defineProperty(SpriteTexture.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
        var visible = !this.props.visible ? ' hidden' : '';

        return (
            React.createElement("div", {className: ("texture sprite " + this.props.position + visible), 
                style: {
                    backgroundImage: ("url(images/textures/" + this.props.name + ".png)")
                }}
            )
        );
    }});

SpriteTexture.defaultProps = {
    visible: false
};


var ____Classj=React.Component;for(var ____Classj____Key in ____Classj){if(____Classj.hasOwnProperty(____Classj____Key)){Texture[____Classj____Key]=____Classj[____Classj____Key];}}var ____SuperProtoOf____Classj=____Classj===null?null:____Classj.prototype;Texture.prototype=Object.create(____SuperProtoOf____Classj);Texture.prototype.constructor=Texture;Texture.__superConstructor__=____Classj;function Texture(){"use strict";if(____Classj!==null){____Classj.apply(this,arguments);}}
    Object.defineProperty(Texture.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
        var visible = !this.props.visible ? ' hidden' : '';

        return (
            React.createElement("div", {className: ("texture " + this.props.position + visible)}, 
                React.createElement("img", {src: ("images/textures/" + this.props.name + ".png")})
            )
        );
    }});

Texture.defaultProps = {
    visible: false
};

var ____Classk=React.Component;for(var ____Classk____Key in ____Classk){if(____Classk.hasOwnProperty(____Classk____Key)){SpellTimer[____Classk____Key]=____Classk[____Classk____Key];}}var ____SuperProtoOf____Classk=____Classk===null?null:____Classk.prototype;SpellTimer.prototype=Object.create(____SuperProtoOf____Classk);SpellTimer.prototype.constructor=SpellTimer;SpellTimer.__superConstructor__=____Classk;function SpellTimer(){"use strict";if(____Classk!==null){____Classk.apply(this,arguments);}}
	Object.defineProperty(SpellTimer.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
        // for now parse logs in here
        if (this.props.logInfo.logLine.indexOf('You move into Raptor Form') > -1) {
            stances.setStance('raptor');
        }
        else if (this.props.logInfo.logLine.indexOf('You move into Coeurl Form') > -1) {
            stances.setStance('coeurl');
        }
        else if (this.props.logInfo.logLine.indexOf('You move into Opo-opo Form') > -1) {
            stances.setStance('opo');
        }
        else if (this.props.logInfo.logLine.indexOf('You gain the effect of Freecure') > -1) {
            auras.add('freecure');
        }
        else if (this.props.logInfo.logLine.indexOf('You gain the effect of Overcure') > -1) {
            auras.add('overcure');
        }
        else if (this.props.logInfo.logLine.indexOf('You lose the effect of Freecure') > -1) {
            auras.remove('freecure');
        }
        else if (this.props.logInfo.logLine.indexOf('You lose the effect of Overcure') > -1) {
            auras.remove('overcure');
        }

        return (
            React.createElement("div", {className: "texture-container"}, 
                React.createElement(SpriteTexture, {position: "left", visible: auras.has('freecure'), name: "Aura3"}), 
                React.createElement(SpriteTexture, {position: "right", visible: auras.has('overcure'), name: "Aura3"}), 
                React.createElement(Texture, {position: "left", visible: stances.inStance('opo'), name: "Aura65"}), 
                React.createElement(Texture, {position: "middle", visible: stances.inStance('raptor'), name: "Aura66"}), 
                React.createElement(Texture, {position: "right", visible: stances.inStance('coeurl'), name: "Aura67"})
            )
        );
	}});



/*
 * Touch of Death - 30s
 * Fracture - 18s
 *
 * Demolish - 18s
 *
 * Debuffs:
 *
 * Dragon Kick - 15s
 *
 *
 *
 */
