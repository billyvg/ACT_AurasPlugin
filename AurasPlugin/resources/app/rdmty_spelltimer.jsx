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
        timer: 18000
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
        condition: () => {
            return skills.remaining('heavy thrust') <= 5000;
        },
        name: 'heavy thrust'
    },
    {
        condition: () => {
            return skills.remaining('heavy thrust') >= 2500 && skills.remaining('impulse drive') <= 5000;
        },
        name: 'impulse drive'
    },
    {
        condition: () => {
            return skills.remaining('heavy thrust') >= 2500 &&
                (skills.remaining('impulse drive') <= 5000 || skills.remaining('disembowel') <= 5000);
        },
        name: 'disembowel'
    },
    {
        condition: () => {
            return skills.remaining('heavy thrust') >= 2500 &&
                (skills.remaining('impulse drive') <= 5000 || skills.remaining('disembowel') <= 5000 || skills.remaining('chaos thrust') <= 5000);
        },
        name: 'chaos thrust'
    },
    {
        condition: () => {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 2500 &&
                skills.remaining('chaos thrust') >= 7500 &&
                skills.remaining('phlebotomize') <= 1000;
        },
        name: 'phlebotomize'
    },
    {
        condition: () => {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 5000 &&
                skills.remaining('chaos thrust') >= 5000 &&
                skills.remaining('phlebotomize') >= 1000 && 
                skills.remaining('true thrust') <= 0;
        },
        name: 'true thrust'
    },
    {
        condition: () => {
            return skills.remaining('heavy thrust') >= 2500 &&
                skills.remaining('impulse drive') >= 5000 &&
                skills.remaining('chaos thrust') >= 5000 &&
                skills.remaining('phlebotomize') >= 1000 &&
                (skills.remaining('vorpal thrust') <= 0 || skills.remaining('true thrust') <= 0);
        },
        name: 'vorpal thrust'
    },
    {
        condition: () => {
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

class Auras {
    constructor() {
        this._auras = {};
    }

    add(aura) {
        this._auras[aura] = true;
    }

    remove(aura) {
        this._auras[aura] = false;
    }

    has(aura) {
        return !!this._auras[aura];
    }
}

class Stance {
    constructor() {
        this._stance = {};
    }

    setStance(stance, timer) {
        if (this.clearStanceId) {
            clearTimeout(this.clearStanceId);
        }

        this._stance = {};
        this._stance[stance] = true;

        this.clearStanceId = setTimeout(function() {
            this._stance = {};
        }.bind(this), timer || 10000);
    }

    inStance(stance) {
        return !!this._stance[stance];
    }
}

class Skills {
    constructor() {
        this._skills = {};
    }

    use(_skill) {
        var skill = _skill.toLowerCase();

        if (SkillDb[skill]) {
            if (this._skills[skill] && this._skills[skill].timerId) {
                clearTimeout(this._skills[skill].timerId);
            }

            this._skills[skill] = {
                started: +new Date()
            };

            this.timeout(skill);
        }
        else {
            console.warn('"' + skill + '" has no DB entry');
        }
    }

    reset(_skill) {
        var skill = _skill.toLowerCase();
        this._skills[skill] = null;
    }

    remaining(_skill) {
        var skill = _skill.toLowerCase();

        if (this._skills[skill] && SkillDb[skill].timer) {
            return SkillDb[skill].timer - (+new Date() - this._skills[skill].started);
        }

        return 0;
    }

    expired(_skill) {
        var skill = _skill.toLowerCase();

        if (this._skills[skill] && SkillDb[skill].timer) {
            return (+new Date() - this._skills[skill].started) > SkillDb[skill].timer;
        }

        return true;
    }

    cooldown(_skill) {
        var skill = _skill.toLowerCase();

        if (this._skills[skill] && SkillDb[skill].cooldown) {
            return SkillDb[skill].cooldown - (+new Date() - this._skills[skill].started);
        }

        return 0;
    }

    ready(_skill) {
        var skill = _skill.toLowerCase();

        if (this._skills[skill] && SkillDb[skill].cooldown) {
            return (+new Date() - this._skills[skill].started) > SkillDb[skill].cooldown;
        }

        return true;
    }
    timeout(_skill) {
        var skill = _skill.toLowerCase();

        if (SkillDb[skill] && this._skills[skill]) {
            this._skills[skill].timerId = setTimeout(() => {
               this.reset(skill)
            }, SkillDb[skill].timer);
        }
    }
}

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

class SkillIcon extends React.Component {
    render() {
        var visible = !this.props.visible ? ' invisible' : '';

        return (
            <div className={`skill-icon-container ${visible}`}>
                <img className="skill-icon" src={`images/skills/${this.props.name}.png`} />
            </div>
        );
    }
}

class SpriteTexture extends React.Component {
    render() {
        var visible = !this.props.visible ? ' hidden' : '';

        return (
            <div className={`texture sprite ${this.props.position}${visible}`}
                style={{
                    backgroundImage: `url(images/textures/${this.props.name}.png)`
                }}>
            </div>
        );
    }
}
SpriteTexture.defaultProps = {
    visible: false
};


class Texture extends React.Component {
    render() {
        var visible = !this.props.visible ? ' hidden' : '';

        return (
            <div className={`texture ${this.props.position}${visible}`}>
                <img src={`images/textures/${this.props.name}.png`}/>
            </div>
        );
    }
}
Texture.defaultProps = {
    visible: false
};

class SpellTimer extends React.Component {
	render() {
        // for now parse logs in here
        return (
            <div className="texture-container">
                {auras.has('cleric stance') ?
                    <div style={{'font-size': 24 + 'px', 'font-weight': 'bold', color: '#ff69b4'}}>YOURE IN CLERIC STANCE RETARD</div> : null}

                <SpriteTexture position="left" visible={auras.has('freecure')} name="Aura3" />
                <SpriteTexture position="right" visible={auras.has('overcure')} name="Aura3" />
                <SpriteTexture position="up" visible={stances.inStance('raptor form') && skills.remaining('twin snakes') <- 5000} name="Aura1" />
                <SpriteTexture position="up" visible={stances.inStance('raptor form')} name="Aura28" />
            
                <SpriteTexture position="right" visible={stances.inStance('coeurl form') && skills.remaining('demolish') <= 5000} name="Aura1" />
                <SpriteTexture position="right" visible={stances.inStance('coeurl form')} name="Aura28" />
                <SpriteTexture position="left" visible={stances.inStance('opo-opo form') && skills.remaining('dragon kick') <= 5000} name="Aura1" />
                <SpriteTexture position="left" visible={stances.inStance('opo-opo form')} name="Aura28" />
            </div>
        );
	}
}

class RotationHelper extends React.Component {
    render() {
        return (
            <div className="skill-icons">
                {this.props.job ?
                    RotationDb[this.props.job].map((rotation, index) => {
                        return <SkillIcon visible={rotation.condition()} name={rotation.name} key={this.props.job + '-' + index} />;
                    })
                        :
                    Object.keys(RotationDb).map((job, i) => {
                        return RotationDb[job].map((rotation, index) => {
                            return <SkillIcon visible={rotation.condition()} name={rotation.name} key={job + '-' + index} />;
                        });
                    })
                }
            </div>
        );
    }
}

RotationHelper.defaultProps = {
};
