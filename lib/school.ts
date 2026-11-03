// Fish school simulation: no DOM, so it can run and be measured anywhere.
// Each fish steers by the classic flocking rules (separation, alignment, cohesion), plus its own
// wander and a slowly rotating current that takes the school through every direction in turn.
// Steering only ever turns a fish; speed comes from its size, its swim rhythm and how startled it is.
// A school may have one shark: it patrols slowly, hunts now and then, and what it eats is replaced.

/** Points along each fish's backbone, head first. */
export const SPINE_POINTS = 12;

export interface Fish {
  /** head position and velocity, px and px/s, relative to the school's home area */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** nose to base of the tail, px */
  size: number;
  tone: "crimson" | "blue";
  /** 0–1 opacity: smaller fish sit deeper in the water */
  depth: number;
  /** tail beat, radians; advances faster the harder the fish swims */
  phase: number;
  /** signed turn rate, radians/s, smoothed; the drawing flares the inside fin with it */
  turn: number;
  /** 0–1; a scare spikes it, then it fades and spreads to neighbours */
  startle: number;
  /** x, y pairs from head to tail */
  spine: number[];
  wander: number;
  rhythm: number;
}

export interface Shark {
  fish: Fish;
  /** the fish it is chasing, if any */
  prey: Fish | null;
  /** seconds until the next hunt */
  rest: number;
  /** seconds spent on this chase */
  chase: number;
  /** 0–1, how far its jaws are open */
  gape: number;
  /** 0–1, spikes on a catch: the head shake */
  chomp: number;
}

/** A puff of bubbles where a fish was caught. */
export interface Burst {
  x: number;
  y: number;
  /** seconds since the catch */
  age: number;
}

export interface School {
  fish: Fish[];
  shark: Shark | null;
  bursts: Burst[];
  /** seconds until each eaten fish's replacement swims in */
  arrivals: number[];
  time: number;
  /** where the current's rotation starts, so schools aren't in step with each other */
  flowOffset: number;
  rand: () => number;
}

export interface Point {
  x: number;
  y: number;
}

const FLOW_FORCE = 16;
const WANDER_FORCE = 42;
const SEPARATION_FORCE = 260;
const ALIGNMENT = 0.6;
const COHESION = 0.12;
const CONTAIN_FORCE = 130;
const FLEE_FORCE = 1400;
const FLEE_RADIUS = 150;
const MAX_TURN = 2.4;
const STARTLE_TURN = 7;
const STARTLE_SPEED = 2.6;

const SHARK_MIN = 84;
const SHARK_MAX = 140;
const PATROL_SPEED = 42;
const HUNT_SPEED = 205;
const PATROL_TURN = 1.5;
const HUNT_TURN = 4.2;
const PURSUIT_FORCE = 520;
/** Longest a chase lasts before the shark gives up. */
const CHASE_SECONDS = 5;
const REST_AFTER_CATCH = [16, 14];
const REST_AFTER_MISS = [5, 5];
const ARRIVAL_SECONDS = 7;
export const BURST_SECONDS = 1.1;

function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function makeFish(
  rand: () => number,
  x: number,
  y: number,
  heading: number,
  size: number,
): Fish {
  const step = size / (SPINE_POINTS - 1);
  return {
    x,
    y,
    vx: Math.cos(heading) * 30,
    vy: Math.sin(heading) * 30,
    size,
    tone: rand() > 0.35 ? "crimson" : "blue",
    depth: Math.min(1, 0.6 + ((size - 24) / 50) * 0.4),
    phase: rand() * Math.PI * 2,
    turn: 0,
    startle: 0,
    spine: Array.from({ length: SPINE_POINTS * 2 }, (_, i) =>
      i % 2 === 0
        ? x - Math.cos(heading) * step * (i / 2)
        : y - Math.sin(heading) * step * ((i - 1) / 2),
    ),
    wander: rand() * Math.PI * 2,
    rhythm: rand() * Math.PI * 2,
  };
}

function fishSize(rand: () => number) {
  return rand() > 0.75 ? 46 + rand() * 28 : 24 + rand() * 16;
}

export function createSchool(
  seed: number,
  count: number,
  width: number,
  height: number,
  withShark = false,
): School {
  const rand = seeded(seed);
  const fish = Array.from({ length: count }, () =>
    makeFish(
      rand,
      rand() * width,
      rand() * height,
      rand() * Math.PI * 2,
      fishSize(rand),
    ),
  );
  // small fish first, so the big ones are drawn on top
  fish.sort((a, b) => a.size - b.size);
  const sharkSize = Math.max(
    SHARK_MIN,
    Math.min(SHARK_MAX, Math.min(width, height) * 0.45),
  );
  return {
    fish,
    shark: withShark
      ? {
          fish: makeFish(
            rand,
            rand() * width,
            rand() * height,
            rand() * Math.PI * 2,
            sharkSize,
          ),
          prey: null,
          rest: 16 + rand() * 8,
          chase: 0,
          gape: 0,
          chomp: 0,
        }
      : null,
    bursts: [],
    arrivals: [],
    time: 0,
    flowOffset: rand() * Math.PI * 2,
    rand,
  };
}

/** Gentle inside the margin, growing fast past the edge, so fish curve back instead of bouncing. */
function contain(position: number, extent: number, margin: number) {
  if (position < margin) {
    const t = (margin - position) / margin;
    return CONTAIN_FORCE * t * (1 + t * t);
  }
  if (position > extent - margin) {
    const t = (position - (extent - margin)) / margin;
    return -CONTAIN_FORCE * t * (1 + t * t);
  }
  return 0;
}

/** Each backbone point trails the one ahead at a fixed distance, so turns travel down the body. */
function followHead(f: Fish) {
  const link = f.size / (SPINE_POINTS - 1);
  f.spine[0] = f.x;
  f.spine[1] = f.y;
  for (let i = 2; i < f.spine.length; i += 2) {
    const dx = f.spine[i] - f.spine[i - 2];
    const dy = f.spine[i + 1] - f.spine[i - 1];
    const d = Math.hypot(dx, dy) || 1;
    f.spine[i] = f.spine[i - 2] + (dx / d) * link;
    f.spine[i + 1] = f.spine[i - 1] + (dy / d) * link;
  }
}

/** Forces can only turn a fish, and only so fast: it can't pivot on the spot. */
function swim(
  f: Fish,
  ax: number,
  ay: number,
  dt: number,
  maxTurn: number,
  targetSpeed: number,
) {
  const heading = Math.atan2(f.vy, f.vx);
  const wanted = Math.atan2(f.vy + ay * dt, f.vx + ax * dt);
  const delta = Math.atan2(
    Math.sin(wanted - heading),
    Math.cos(wanted - heading),
  );
  const limit = maxTurn * dt;
  const turned = Math.max(-limit, Math.min(limit, delta));
  const next = heading + turned;
  f.turn += (turned / dt - f.turn) * Math.min(1, dt * 6);

  const current = Math.hypot(f.vx, f.vy);
  const speed = current + (targetSpeed - current) * Math.min(1, dt * 2.5);
  f.vx = Math.cos(next) * speed;
  f.vy = Math.sin(next) * speed;
  f.x += f.vx * dt;
  f.y += f.vy * dt;
  f.phase += Math.min(40, 6 + (speed / f.size) * 9.4) * dt;
  followHead(f);
}

function stepShark(
  school: School,
  dt: number,
  width: number,
  height: number,
  margin: number,
) {
  const shark = school.shark;
  if (!shark) return;
  const { rand } = school;
  const f = shark.fish;

  if (!shark.prey) {
    shark.rest -= dt;
    if (shark.rest <= 0 && school.fish.length > 2) {
      // the closest fish in the school
      let best = Number.POSITIVE_INFINITY;
      for (const o of school.fish) {
        const d = Math.hypot(o.x - f.x, o.y - f.y);
        const inside = o.x > 0 && o.x < width && o.y > 0 && o.y < height;
        if (inside && d < best) {
          best = d;
          shark.prey = o;
        }
      }
      shark.chase = 0;
    }
  }

  f.wander += (rand() - 0.5) * 3 * Math.sqrt(dt);
  let ax = Math.cos(f.wander) * 30 + contain(f.x, width, margin);
  let ay = Math.sin(f.wander) * 30 + contain(f.y, height, margin);
  let gapeTarget = 0;
  const prey = shark.prey;

  if (prey) {
    shark.chase += dt;
    const dx = prey.x + prey.vx * 0.25 - f.x;
    const dy = prey.y + prey.vy * 0.25 - f.y;
    const d = Math.hypot(dx, dy) || 1;
    ax += (dx / d) * PURSUIT_FORCE;
    ay += (dy / d) * PURSUIT_FORCE;
    const reach = Math.hypot(prey.x - f.x, prey.y - f.y);
    if (reach < 120) gapeTarget = 1;

    if (reach < f.size * 0.14 + prey.size * 0.35) {
      school.fish.splice(school.fish.indexOf(prey), 1);
      school.bursts.push({ x: prey.x, y: prey.y, age: 0 });
      school.arrivals.push(ARRIVAL_SECONDS);
      shark.prey = null;
      shark.chomp = 1;
      shark.rest = REST_AFTER_CATCH[0] + rand() * REST_AFTER_CATCH[1];
    } else if (
      shark.chase > CHASE_SECONDS ||
      f.x < -60 ||
      f.y < -60 ||
      f.x > width + 60 ||
      f.y > height + 60
    ) {
      shark.prey = null;
      shark.rest = REST_AFTER_MISS[0] + rand() * REST_AFTER_MISS[1];
    }
  }

  shark.gape += (gapeTarget - shark.gape) * Math.min(1, dt * 7);
  shark.chomp = Math.max(0, shark.chomp - dt * 1.4);
  swim(
    f,
    ax,
    ay,
    dt,
    shark.prey ? HUNT_TURN : PATROL_TURN,
    shark.prey ? HUNT_SPEED : PATROL_SPEED,
  );
}

export function stepSchool(
  school: School,
  dt: number,
  width: number,
  height: number,
  pointer: Point | null,
) {
  school.time += dt;
  const { fish, time, rand, shark } = school;
  const flow = school.flowOffset + time * 0.13 + 1.1 * Math.sin(time * 0.07);
  const flowX = Math.cos(flow) * FLOW_FORCE;
  const flowY = Math.sin(flow) * FLOW_FORCE;
  const margin = Math.min(width, height) * 0.2;

  stepShark(school, dt, width, height, margin);

  for (const b of school.bursts) b.age += dt;
  school.bursts = school.bursts.filter((b) => b.age < BURST_SECONDS);

  // replacements swim in from just outside the area
  for (let i = school.arrivals.length - 1; i >= 0; i--) {
    school.arrivals[i] -= dt;
    if (school.arrivals[i] > 0) continue;
    school.arrivals.splice(i, 1);
    const fromSide = rand() > 0.5;
    const near = rand() > 0.5;
    const x = fromSide ? (near ? -60 : width + 60) : rand() * width;
    const y = fromSide ? rand() * height : near ? -60 : height + 60;
    const heading = Math.atan2(height / 2 - y, width / 2 - x);
    fish.unshift(makeFish(rand, x, y, heading, fishSize(rand)));
  }

  for (const f of fish) {
    let aliX = 0;
    let aliY = 0;
    let cohX = 0;
    let cohY = 0;
    let sepX = 0;
    let sepY = 0;
    let neighbours = 0;

    for (const o of fish) {
      if (o === f) continue;
      const dx = o.x - f.x;
      const dy = o.y - f.y;
      const range = (f.size + o.size) * 2.2 + 40;
      const d2 = dx * dx + dy * dy;
      if (d2 > range * range) continue;
      const d = Math.sqrt(d2) || 1;
      neighbours++;
      aliX += o.vx;
      aliY += o.vy;
      cohX += o.x;
      cohY += o.y;
      const personal = (f.size + o.size) * 0.75;
      if (d < personal) {
        sepX -= (dx / d) * (1 - d / personal);
        sepY -= (dy / d) * (1 - d / personal);
      }
      // fright spreads through the school, weakening with each fish it passes
      f.startle = Math.max(f.startle, o.startle * 0.8);
    }

    f.wander += (rand() - 0.5) * 6 * Math.sqrt(dt);
    let ax = flowX + Math.cos(f.wander) * WANDER_FORCE;
    let ay = flowY + Math.sin(f.wander) * WANDER_FORCE;
    if (neighbours > 0) {
      ax += (aliX / neighbours - f.vx) * ALIGNMENT;
      ay += (aliY / neighbours - f.vy) * ALIGNMENT;
      ax += (cohX / neighbours - f.x) * COHESION + sepX * SEPARATION_FORCE;
      ay += (cohY / neighbours - f.y) * COHESION + sepY * SEPARATION_FORCE;
    }
    ax += contain(f.x, width, margin);
    ay += contain(f.y, height, margin);

    if (pointer) {
      const dx = f.x - pointer.x;
      const dy = f.y - pointer.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < FLEE_RADIUS) {
        const near = 1 - d / FLEE_RADIUS;
        ax += (dx / d) * near * FLEE_FORCE;
        ay += (dy / d) * near * FLEE_FORCE;
        f.startle = Math.max(f.startle, near);
      }
    }

    // keep clear of the shark at all times; bolt when it is hunting
    if (shark) {
      const dx = f.x - shark.fish.x;
      const dy = f.y - shark.fish.y;
      const d = Math.hypot(dx, dy) || 1;
      const fear = shark.fish.size * 1.3 + 50;
      if (d < fear) {
        const near = 1 - d / fear;
        ax += (dx / d) * near * 500;
        ay += (dy / d) * near * 500;
        f.startle = Math.max(f.startle, near * (shark.prey ? 0.8 : 0.2));
      }
    }

    // burst and glide around a cruising speed
    const cruise = 24 + f.size * 0.55;
    const target =
      cruise *
      (1 + 0.3 * Math.sin(time * 0.9 + f.rhythm)) *
      (1 + STARTLE_SPEED * f.startle);
    swim(f, ax, ay, dt, MAX_TURN + STARTLE_TURN * f.startle, target);
    f.startle = Math.max(0, f.startle - dt * 0.9);
  }
}
