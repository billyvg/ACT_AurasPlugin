// fiddle: http://jsfiddle.net/v1ddnsvh/8/
/* global window */

var IMAGE_PATH = 'images';

var React = window.React;

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
        return this._auras[aura];
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

var stances = new Stance();
var auras = new Auras();

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
            <div className="texture-container">
                <SpriteTexture position="left" visible={auras.has('freecure')} name="Aura3" />
                <SpriteTexture position="right" visible={auras.has('overcure')} name="Aura3" />
                <Texture position="left" visible={stances.inStance('opo')} name="Aura65" />
                <Texture position="middle" visible={stances.inStance('raptor')} name="Aura66" />
                <Texture position="right" visible={stances.inStance('coeurl')} name="Aura67" />
            </div>
        );
	}
}


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
