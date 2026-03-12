export const ROAD_W       = 14;
export const SEG_LEN      = 60;
export const NUM_SEGS     = 24;
export const HALF         = (NUM_SEGS / 2) * SEG_LEN;
export const SPAN         = NUM_SEGS * SEG_LEN;
export const LANE_SPACING = 3.4;
export const LANES        = [-LANE_SPACING, 0, LANE_SPACING];
export const ROAD_LIMIT   = LANE_SPACING + 1.2;

export const MAX_FWD    = 0.55;
export const MAX_REV    = 0.22;
export const ACCEL      = 0.011;
export const DECEL      = 0.007;
export const STAGE1_MAX = 0.20;
export const STAGE2_MAX = 0.40;
export const STAGE3_MAX = MAX_FWD;

export const STEER_ACCEL   = 0.0055;
export const STEER_DAMPING = 0.78;

// Truck body AABB half-extents (world space)
export const TRUCK_HX     = 1.55;
export const TRUCK_HZ     = 5.5;
export const TRUCK_Z_BIAS = 1.85; // body centre is this far ahead of group origin
