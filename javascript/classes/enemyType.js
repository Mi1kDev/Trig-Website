// constant variables used in boid calculation
const SEP_DIST = 200
const COHESION = 0.1
const SEP_FORCE = 0.25
const ALIGN_FORCE = 0.05
const TARGETFORCE = 0.1

// construction of the relevant data values of each enemy type
// this constant also acts as the pool from which enemies are randomly selected from
// adding new enemies is therefore easy, as all that needs to be provided is a new key and the relevant data values
export const enemyTypes = {
    // data values defining the "square" enemy
    "square": {
        maxHp: 1,
        damage: 1,
        minDist: 200,
        backOff: 175,
        detection: 250,
        speed: 2.5,
        color: "red",
        width: 32,
        height: 32,
        check: false,
        cohesive: COHESION,
        separationDistance: SEP_DIST,
        separationForce: SEP_FORCE,
        alignForce: ALIGN_FORCE,
        targetForceDampen: TARGETFORCE,
        projectile: {
            speed: 3,
            radius: 7.5,
            color: "red",
            lifetime: 2.25
        },
        gun: {
            shootCd: 2.5,
            multishot: 1,
            burst: 1,
            burstCd: 0,
            spread: 0,
        },
        points: 100,
        money: {
            rangeStart: 500,
            rangeEnd: 750,
        }
    },
    // data values defining the "circle" enemy
    "circle": {
        maxHp: 2,
        damage: 1,
        minDist: 300,
        backOff: 250,
        detection: 350,
        speed: 2.5,
        color: "orange",
        width: 32,
        height: 32,
        check: false,
        cohesive: COHESION,
        separationDistance: SEP_DIST,
        separationForce: SEP_FORCE,
        alignForce: ALIGN_FORCE,
        targetForceDampen: TARGETFORCE,
        projectile: {
            speed: 3.5,
            radius: 7.5,
            color: "orange",
            lifetime: 2
        },
        gun: {
            shootCd: 1.5,
            multishot: 1,
            burst: 2,
            burstCd: 0.35,
            spread: 0,
        },
        points: 250,
        money: {
            rangeStart: 750,
            rangeEnd: 1000,
        }
    },
    // data values defining the "kite" enemy
    "kite": {
        maxHp: 3,
        damage: 1,
        minDist: 400,
        backOff: 380,
        detection: 500,
        speed: 5,
        color: "purple",
        width: 32,
        height: 32,
        check: false,
        cohesive: COHESION,
        separationDistance: SEP_DIST,
        separationForce: SEP_FORCE,
        alignForce: ALIGN_FORCE,
        targetForceDampen: TARGETFORCE,
        projectile: {
            speed: 5,
            radius: 5,
            color: "purple",
            lifetime: 3
        },
        gun: {
            shootCd: 5, 
            multishot: 1,
            burst: 3,
            burstCd: 0.75,
            spread: 0
        },
        points: 400,
        money: {
            rangeStart: 1000,
            rangeEnd: 1500,
        }
    },
    // data values defining the "trapezoid"
    "trapezoid": {
        maxHp: 4,
        damage: 1,
        minDist: 175,
        backOff: 100,
        detection: 150,
        speed: 2,
        color: "green",
        width: 32,
        height: 32,
        check: false,
        cohesive: COHESION,
        separationDistance: SEP_DIST,
        separationForce: SEP_FORCE,
        alignForce: ALIGN_FORCE,
        targetForceDampen: TARGETFORCE,
        projectile: {
            speed: 2.25,
            radius: 10,
            color: "green",
            lifetime: 2,
        },
        gun: {
            shootCd: 7,
            multishot: 3, 
            burst: 1,
            burstCd: 0,
            spread: 20,
        },
        points: 500,
        money: {
            rangeStart: 1500,
            rangeEnd: 3000,
        }
    }
}