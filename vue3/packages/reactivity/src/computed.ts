import { isFunction } from "@vue/shared";
import { isThisTypeNode } from "typescript";
import { effect, track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from "./operators";

class computedRefImpl {
    public _dirty = true;

    public _value;

    public effect;

    constructor(getter, public setter) {
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(this, TriggerOpTypes.SET, 'value')
                }
            }
        })
    }

    get value() {
        if (this._dirty) {
            this._value = this.effect()
            this._dirty = false
        }
        track(this, TrackOpTypes.GET, 'value')
        return this._value
    }

    set value(newValue) {
        this.setter(newValue)
    }
}

export function computed(getterOpOptions) {
    let getter;
    let setter;

    if (isFunction(getterOpOptions)) {
        getter = getterOpOptions;
        setter = () => {
            console.warn('computed value must be readonly')
        }
    } else {
        getter = getterOpOptions.get;
        setter = getterOpOptions.set;
    }

    return new computedRefImpl(getter, setter)
}