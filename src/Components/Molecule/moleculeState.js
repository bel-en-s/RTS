const sumArrays = (arrays) => arrays.reduce((p, arr) => arr.map((x, i) => x + p[i]), new Array(arrays[0].length).fill(0));
const diff = (arr1, arr2) => arr1.map((x, i) => x - arr2[i]);
const prod = (arr, value) => arr.map(x => x * value);
const div = (arr, value) => arr.map(x => x / value);
const abs = (arr) => Math.sqrt(arr.reduce((p, x, i) => p + x * x, 0))

export const updateState = (oldState, time, delta, uPointer) => {

    const newState = {
        spheres: oldState.spheres.map((old, i, arr) => {

            const getResultantForce = (i, spheres, time, position, velocity, acceleration, mass, radius, color) => {

                const sphere = spheres[i];

                const getIntraSpheresForce = () => {
                    let res = [0, 0, 0];
                    for (let j = 0; j < spheres.length; j++) {
                        if (j !== i) {
                            res = sumArrays([res, sphere.getIntraSpheresForce(time, position, velocity, acceleration, mass, radius, color, spheres[j])])
                        }
                    }
                    return res;
                };


                return sumArrays([
                    sphere.getInternalForce(time, position, velocity, acceleration, mass, radius, color),
                    sphere.getDragForce(time, position, velocity, acceleration, mass, radius, color),
                    sphere.getCenterForce(time, position, velocity, acceleration, mass, radius, color),
                    sphere.getMouseForce(time, position, velocity, acceleration, mass, radius, color, [uPointer.x, uPointer.y, 0]),
                    getIntraSpheresForce(),
                ])
            };

            const newSphere = { ...old }
            const { position, velocity, acceleration, mass, radius, color } = newSphere.lastState;

            const newColor = newSphere.getColor(time, position, velocity, acceleration, mass, radius, color);
            const newRadius = newSphere.getColor(time, position, velocity, acceleration, mass, radius, color);
            const newMass = newSphere.getMass(time, position, velocity, acceleration, mass, radius, color);
            const resForce = getResultantForce(i, arr, time, position, velocity, acceleration, mass, radius, color);
            const newAcceleration = sumArrays([acceleration, prod(div(resForce, newMass), delta)]);
            const newVelocity = sumArrays([velocity, prod(newAcceleration, delta)]);
            const newPosition = sumArrays([position, prod(newVelocity, delta)]);

            newSphere.lastState.color = newColor;
            newSphere.lastState.radius = newRadius;
            newSphere.lastState.mass = newMass;
            newSphere.lastState.force = resForce;
            newSphere.lastState.acceleration = newAcceleration;
            newSphere.lastState.velocity = newVelocity;
            newSphere.lastState.position = newPosition;
            return newSphere;
        })
    }
    return newState;
}

export const getInitialState = (state) => {

    return {
        spheres: [
            {
                lastState: {
                    position: [0.45, 0.55, 0],
                    velocity: [0.0, 0, 0],
                    acceleration: [0, 0, 0],
                    mass: 50.1,
                    radius: 0.2,
                    color: "#5CC0FF",
                },
                //getRadius: (t, p, v, a, m, r, c) => 0.12 + Math.cos(t / 8) * 0.05,
                getRadius: (t, p, v, a, m, r, c) => 0.1,
                getMass: (t, p, v, a, m, r, c) => 5.2,
                getDragForce: (t, p, v, a, m, r, c) => prod(v, -1800 * abs(v) * abs(v)),
                getInternalForce: (t, p, v, a, m, r, c) => {
                    const target = [(0.5 + 0.12 * Math.sin(t / 3 + 1)), (0.5 + 0.18 * Math.cos(t)), 0];
                    const d = diff(target, p);
                    return prod(d, 0.05);
                },
                getIntraSpheresForce: (t, p, v, a, m, r, c, other) => {
                    const d = diff(other.lastState.position, p);
                    const f = prod(d, (abs(d) - 0.08));
                    return f;
                },
                getCenterForce: (t, p, v, a, m, r, c) => {
                    const target = [0.5, 0.5, 0];
                    const d = diff(target, p);
                    return prod(d, 0.0);
                },
                getMouseForce: (t, p, v, a, m, r, c, mousePos) => {
                    const d = diff(mousePos, p)
                    const mod = abs(diff(mousePos, p)) * 1000;
                    return [0,0,0]
                    return prod(d, -10000 / Math.max(mod * mod, 0.000001));
                },
                getColor: (t, p, v, a, m, r, c) => "#5CC0FF",
            },
            {
                lastState: {
                    position: [0.55, 0.55, 0],
                    velocity: [0, 0, 0],
                    acceleration: [0, 0, 0],
                    mass: 40,
                    radius: 0.25,
                    color: "#5C78FF",
                },
                //getRadius: (t, p, v, a, m, r, c) => 0.15 + Math.cos(t /3) * 0.02,
                getMass: (t, p, v, a, m, r, c) => 5.2,
                getDragForce: (t, p, v, a, m, r, c) => prod(v, -1800 * abs(v) * abs(v)),
                getInternalForce: (t, p, v, a, m, r, c) => {
                    const target = [(0.5 + 0.14 * Math.sin(2 * t / 5 + 1)), (0.5 + 0.18 * Math.cos(-t)), 0];
                    const d = diff(target, p)
                    return prod(d, 0.05);
                },
                getIntraSpheresForce: (t, p, v, a, m, r, c, other) => {
                    const d = diff(other.lastState.position, p);
                    const f = prod(d, (abs(d) - 0.08))
                    return f;
                },
                getCenterForce: (t, p, v, a, m, r, c) => {
                    const target = [0.5, 0.5, 0];
                    const d = diff(target, p);
                    return prod(d, 0.0);
                },
                getMouseForce: (t, p, v, a, m, r, c, mousePos) => {
                    const d = diff(mousePos, p)
                    const mod = abs(diff(mousePos, p)) * 1000;
                    return [0,0,0]
                    return prod(d, -10000 / Math.max(mod * mod, 0.000001));
                },
                getColor: (t, p, v, a, m, r, c) => "#5C78FF",
            },
            {
                lastState: {
                    position: [0.5, 0.45, 0],
                    velocity: [0.0, 0, 0],
                    acceleration: [0, 0, 0],
                    mass: 30,
                    radius: 0.18,
                    color: "#F538FF",
                },
                //getRadius: (t, p, v, a, m, r, c) => 0.12 + Math.cos(t /6) * 0.015,
                getRadius: (t, p, v, a, m, r, c) => 0.1,
                getMass: (t, p, v, a, m, r, c) => 5.2,
                getDragForce: (t, p, v, a, m, r, c) => prod(v, -1800 * abs(v) * abs(v)),
                getInternalForce: (t, p, v, a, m, r, c) => {
                    const target = [(0.5 + 0.14 * Math.sin(-1.5 * t / 3 + 1)), (0.5 - 0.18 * Math.cos(-2 * t)), 0];
                    const d = diff(target, p)
                    return prod(d, 0.05);
                },
                getIntraSpheresForce: (t, p, v, a, m, r, c, other) => {
                    const d = diff(other.lastState.position, p);
                    const f = prod(d, (abs(d) - 0.08))
                    return f;
                },
                getCenterForce: (t, p, v, a, m, r, c) => {
                    const target = [0.5, 0.5, 0];
                    const d = diff(target, p);
                    return prod(d, 0.0);
                },
                getMouseForce: (t, p, v, a, m, r, c, mousePos) => {
                    const d = diff(mousePos, p)
                    const mod = abs(diff(mousePos, p)) * 1000;
                    return [0,0,0]
                    return prod(d, -10000 / Math.max(mod * mod, 0.000001));
                },
                getColor: (t, p, v, a, m, r, c) => "#F538FF",
            },
        ],
        interSpheresForce: (p1, p2) => 3
    }
};