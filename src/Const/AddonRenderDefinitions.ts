import { PI2 } from "../util";
import { Color } from "./Enums";
import { addonId, barrelAddonId } from "./TankDefinitions";

/**
 * The root AddonRenderDefinition will be applied on the tank render.
 * The AddonRenderDefinition is currently only applicable on the client!
 * You will need to define this seperately from your actual Addons. This may change in the future.
 * This does not differenciate between Tank and Barrel Addons. We let the client decide what to do.
 * Relations, Position, Physics and Style Components are always created, while the Barrel Component only gets created if it is defined in the AddonRenderDefinition.
 * There are no default values at the root level, unset values will not be overwritten.
 */
export interface AddonRenderDefinition {
    children?: AddonRenderDefinition[];
    position?: {
        xOffset?: number; // default: 0.0
        yOffset?: number; // default: 0.0
        angle?: number; // default: 0.0
        isAngleAbsolute?: boolean; // default: false (explaination: false means relative angle to parent)
    };
    physics?: {
        sides?: number; // default: 1
        size?: number; // default: 0.0
        width?: number; // default: 0.0 (explaination: used for trapezoid and rectangle rendering)
        isTrapezoid?: boolean; // default: false (explaination: renders a rectangle as an isosceles trapezoid)
    };
    style?: {
        color?: Color; // default: 0 (explaination: 0 means Color.Border) 
        borderWidth?: number; // default: 7.5 (explaination: canvas stroke width)
        opacity?: number; // default: 1.0
        isVisible?: boolean; // default: true
        renderFirst?: boolean; // default: false (explaination: eg. team bases are rendered first / below everything else)
        isStar?: boolean; // default: false (explaination: eg. traps are rendered as stars)
        isCachable?: boolean; // default: true (explaination: The rendered object can be stored as an image / pattern and be drawn faster on subsequent frames)
        showsAboveParent?: boolean; // default: false
    };
    barrel?: {
        trapezoidDirection?: number; // default: 0.0
    };
};

/**
 * These are used to define how custom addons will look like on the client (think Upgrade Buttons / Tank Wheel)
 */
const AddonRenderDefinitions: Partial<Record<(addonId | barrelAddonId), AddonRenderDefinition>> = {
    "auto2": {
        children: [{
            children: [{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0 // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 2, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 2) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 2) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }, {
                children: [{
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0,
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0,
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                position: {
                    angle: 1 * PI2 / 2,
                    xOffset: Math.cos(1 * PI2 / 2) * 40,
                    yOffset: Math.sin(1 * PI2 / 2) * 40
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0.01
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "weirdspike": {
        children: [{
            physics: {
                sides: 3,
                size: 55 * 1.5 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true
            }
        }, {
            physics: {
                sides: 3,
                size: 55 * 1.5 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true,
                angle: Math.PI / 3
            }
        }]
    }
};

export default AddonRenderDefinitions;
