// fiddle: http://jsfiddle.net/v1ddnsvh/8/
/* global window */

var IMAGE_PATH = 'images';

var React = window.React;

var SkillDb = {
    'dragon kick': {
        timer: 15000
    },
    'twin snakes': {
        timer: 15000
    },
    'demolish': {
        timer: 21000
    },
    'steel peak': {
        cooldown: 40000
    },
    'howling fist': {
        cooldown: 60000
    },

    'internal release': {
        cooldown: 60000
    },
    'blood for blood': {
        cooldown: 60000
    },
    'life surge': {
        cooldown: 50000
    },

    'leg sweep': {
        cooldown: 20000
    },
    'heavy thrust': {
        timer: 20000
    },
    'phlebotomize': {
        timer: 18000
    },
    'true thrust': {
        timer: 7500
    },
    'vorpal thrust': {
        timer: 7500
    },
    'full thrust': {
        timer: 7500
    },
    'impulse drive': {
        timer: 30000
    },
    'disembowel': {
        timer: 30000
    },
    'chaos thrust': {
        timer: 30000
    }
};

var DragoonRotation = [
    {
        condition: function()  {
            return skills.remaining('heavy thrust') <= 5000;
        },
        name: 'heavy thrust'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 && skills.remaining('impulse drive') <= 5000;
        },
        name: 'impulse drive'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 &&
                (skills.remaining('impulse drive') <= 5000 || skills.remaining('disembowel') <= 5000);
        },
        name: 'disembowel'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 &&
                (skills.remaining('impulse drive') <= 5000 || skills.remaining('disembowel') <= 5000 || skills.remaining('chaos thrust') <= 5000);
        },
        name: 'chaos thrust'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 2500 &&
                skills.remaining('chaos thrust') >= 7500 &&
                skills.remaining('phlebotomize') <= 1000;
        },
        name: 'phlebotomize'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 5000 &&
                skills.remaining('chaos thrust') >= 5000 &&
                skills.remaining('phlebotomize') >= 1000 &&
                skills.remaining('true thrust') <= 0;
        },
        name: 'true thrust'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 5000 &&
                skills.remaining('chaos thrust') >= 5000 &&
                skills.remaining('phlebotomize') >= 1000 &&
                (skills.remaining('vorpal thrust') <= 0 || skills.remaining('true thrust') <= 0);
        },
        name: 'vorpal thrust'
    },
    {
        condition: function()  {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 5000 &&
                skills.remaining('chaos thrust') >= 5000 &&
                skills.remaining('phlebotomize') >= 1000 &&
                (skills.remaining('vorpal thrust') <= 0 || skills.remaining('true thrust') <= 0 || skills.remaining('full thrust') <= 0);
        },
        name: 'full thrust'
    }
];

var RotationDb = {
    "dragoon": DragoonRotation
};


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
        return !!this.$Auras_auras[aura];
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



    function Skills() {"use strict";
        this.$Skills_skills = {};
    }

    Object.defineProperty(Skills.prototype,"use",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();

        if (SkillDb[skill]) {
            if (this.$Skills_skills[skill] && this.$Skills_skills[skill].timerId) {
                clearTimeout(this.$Skills_skills[skill].timerId);
            }

            this.$Skills_skills[skill] = {
                started: +new Date()
            };

            this.timeout(skill);
        }
        else {
            //console.warn('"' + skill + '" has no DB entry');
        }
    }});

    Object.defineProperty(Skills.prototype,"reset",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();
        this.$Skills_skills[skill] = null;
    }});

    Object.defineProperty(Skills.prototype,"remaining",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();

        if (this.$Skills_skills[skill] && SkillDb[skill].timer) {
            return SkillDb[skill].timer - (+new Date() - this.$Skills_skills[skill].started);
        }

        return 0;
    }});

    Object.defineProperty(Skills.prototype,"expired",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();

        if (this.$Skills_skills[skill] && SkillDb[skill].timer) {
            return (+new Date() - this.$Skills_skills[skill].started) > SkillDb[skill].timer;
        }

        return true;
    }});

    Object.defineProperty(Skills.prototype,"cooldown",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();

        if (this.$Skills_skills[skill] && SkillDb[skill].cooldown) {
            return SkillDb[skill].cooldown - (+new Date() - this.$Skills_skills[skill].started);
        }

        return 0;
    }});

    Object.defineProperty(Skills.prototype,"ready",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();

        if (this.$Skills_skills[skill] && SkillDb[skill].cooldown) {
            return (+new Date() - this.$Skills_skills[skill].started) > SkillDb[skill].cooldown;
        }

        return true;
    }});
    Object.defineProperty(Skills.prototype,"timeout",{writable:true,configurable:true,value:function($Skills_skill) {"use strict";
        var skill = $Skills_skill.toLowerCase();

        if (SkillDb[skill] && this.$Skills_skills[skill]) {
            this.$Skills_skills[skill].timerId = setTimeout(function()  {
               this.reset(skill)
            }.bind(this), SkillDb[skill].timer);
        }
    }});


var stances = new Stance();
var auras = new Auras();
var skills = new Skills();

document.addEventListener("auraUpdate", function(e) {
    var aura;

    if (e.detail && e.detail.aura) {
        aura = e.detail.aura;

        if (aura.action === 'gain') {
            auras.add(aura.name.toLowerCase());
        }
        else {
            auras.remove(aura.name.toLowerCase());
        }

        renderApp();
    }
});
document.addEventListener("stanceUpdate", function(e) {
    if (e.detail && e.detail.stance) {
        stances.setStance(e.detail.stance.name.toLowerCase());
        renderApp();
    }
});

document.addEventListener("skillUpdate", function(e) {
    if (e.detail && e.detail.skill) {
        //stances.setStance(e.detail.stance.name.toLowerCase());
        skills.use(e.detail.skill.name);
    }
});

var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){SkillIcon[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;SkillIcon.prototype=Object.create(____SuperProtoOf____Class0);SkillIcon.prototype.constructor=SkillIcon;SkillIcon.__superConstructor__=____Class0;function SkillIcon(){"use strict";if(____Class0!==null){____Class0.apply(this,arguments);}}
    Object.defineProperty(SkillIcon.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
        var visible = !this.props.visible ? ' invisible' : '';

        return (
            React.createElement("div", {className: ("skill-icon-container " + visible)}, 
                React.createElement("img", {className: "skill-icon", src: ("images/skills/" + this.props.name + ".png")})
            )
        );
    }});


var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){SpriteTexture[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;SpriteTexture.prototype=Object.create(____SuperProtoOf____Class1);SpriteTexture.prototype.constructor=SpriteTexture;SpriteTexture.__superConstructor__=____Class1;function SpriteTexture(){"use strict";if(____Class1!==null){____Class1.apply(this,arguments);}}
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


var ____Class2=React.Component;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){Texture[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;Texture.prototype=Object.create(____SuperProtoOf____Class2);Texture.prototype.constructor=Texture;Texture.__superConstructor__=____Class2;function Texture(){"use strict";if(____Class2!==null){____Class2.apply(this,arguments);}}
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

var ____Class3=React.Component;for(var ____Class3____Key in ____Class3){if(____Class3.hasOwnProperty(____Class3____Key)){SpellTimer[____Class3____Key]=____Class3[____Class3____Key];}}var ____SuperProtoOf____Class3=____Class3===null?null:____Class3.prototype;SpellTimer.prototype=Object.create(____SuperProtoOf____Class3);SpellTimer.prototype.constructor=SpellTimer;SpellTimer.__superConstructor__=____Class3;function SpellTimer(){"use strict";if(____Class3!==null){____Class3.apply(this,arguments);}}
  Object.defineProperty(SpellTimer.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
    // for now parse logs in here
    return (
      React.createElement("div", {className: "texture-container"}, 
        
          auras.has('cleric stance') ?
            React.createElement("div", {style: {'font-size': 24 + 'px', 'font-weight': 'bold', color: '#ff69b4'}}, 
              "YOURE IN CLERIC STANCE RETARD"
            )
            : null, 
        

        React.createElement("div", {className: "texture-side"}, 
          React.createElement("div", {className: "texture-list"}, 
            React.createElement(SpriteTexture, {position: "left", visible: auras.has('freecure'), name: "Aura3"}), 
            
              stances.inStance('opo-opo form') && skills.remaining('dragon kick') <= 5000 ?
                React.createElement(SpriteTexture, {position: "left", visible: true, name: "Aura1"})
              : React.createElement(SpriteTexture, {position: "left", visible: stances.inStance('opo-opo form'), name: "Aura28"})
            
          )
        ), 

        React.createElement("div", {className: "texture-middle"}, 
          
            stances.inStance('raptor form') && skills.remaining('twin snakes') <= 5000 ?
              React.createElement(SpriteTexture, {position: "up", visible: true, name: "Aura1"})
            : React.createElement(SpriteTexture, {position: "up", visible: stances.inStance('raptor form'), name: "Aura28"})
          
        ), 

        React.createElement("div", {className: "texture-side"}, 
          React.createElement("div", {className: "texture-list"}, 
            React.createElement(SpriteTexture, {position: "right", visible: auras.has('overcure'), name: "Aura3"}), 

            
              stances.inStance('coeurl form') && skills.remaining('demolish') <= 4000 ?
                React.createElement(SpriteTexture, {position: "right", visible: true, name: "Aura1"})
                : React.createElement(SpriteTexture, {position: "right", visible: stances.inStance('coeurl form'), name: "Aura28"})
            
          )
        )
      )
    );
  }});


var ____Class4=React.Component;for(var ____Class4____Key in ____Class4){if(____Class4.hasOwnProperty(____Class4____Key)){RotationHelper[____Class4____Key]=____Class4[____Class4____Key];}}var ____SuperProtoOf____Class4=____Class4===null?null:____Class4.prototype;RotationHelper.prototype=Object.create(____SuperProtoOf____Class4);RotationHelper.prototype.constructor=RotationHelper;RotationHelper.__superConstructor__=____Class4;function RotationHelper(){"use strict";if(____Class4!==null){____Class4.apply(this,arguments);}}
    Object.defineProperty(RotationHelper.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
        return (
            React.createElement("div", {className: "skill-icons"}, 
                this.props.job ?
                    RotationDb[this.props.job].map(function(rotation, index)  {
                        return React.createElement(SkillIcon, {visible: rotation.condition(), name: rotation.name, key: this.props.job + '-' + index});
                    }.bind(this))
                        :
                    Object.keys(RotationDb).map(function(job, i)  {
                        return RotationDb[job].map(function(rotation, index)  {
                            return React.createElement(SkillIcon, {visible: rotation.condition(), name: rotation.name, key: job + '-' + index});
                        });
                    })
                
            )
        );
    }});


RotationHelper.defaultProps = {
};
