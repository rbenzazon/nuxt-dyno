// Bilinear interpolation for a 2D grid
export function bilinearInterpolation(xArr, yArr, values, x, y) {
	// Find indices for x and y
	let xi = xArr.findIndex((v) => v >= x);
	if (xi === -1) xi = xArr.length - 1;
	if (xi === 0) xi = 1;
	let yi = yArr.findIndex((v) => v >= y);
	if (yi === -1) yi = yArr.length - 1;
	if (yi === 0) yi = 1;

	const x0 = xArr[xi - 1],
		x1 = xArr[xi];
	const y0 = yArr[yi - 1],
		y1 = yArr[yi];
	const Q11 = values[xi - 1][yi - 1];
	const Q12 = values[xi - 1][yi];
	const Q21 = values[xi][yi - 1];
	const Q22 = values[xi][yi];
	const denom = (x1 - x0) * (y1 - y0);
	if (denom === 0) {
		return values[xi][yi];
	}
	const f =
		Q11 * (x1 - x) * (y1 - y) + Q21 * (x - x0) * (y1 - y) + Q12 * (x1 - x) * (y - y0) + Q22 * (x - x0) * (y - y0);
	return f / denom;
}

export function torqueAt(profile, throttleVal, rpmVal) {
	const { rpm, baseTorque, throttle, afr } = profile;
	// Clamp throttle and rpm to valid ranges
	throttleVal = Math.max(0, Math.min(100, throttleVal));
	rpmVal = Math.max(0, Math.min(10000, rpmVal));

	/*// Minimum idle torque logic
	const idleRpmThreshold = 800;
	const idleTorque = 80; // Nm, matches baseTorque[0]
	if (throttleVal === 0 && rpmVal > 0 && rpmVal <= idleRpmThreshold) {
		// Linearly decrease idle torque from idleTorque at 0 rpm to 0 at idleRpmThreshold
		return idleTorque * (1 - rpmVal / idleRpmThreshold);
	}*/

	// Use bilinear interpolation for baseTorque map
	return {
		torque: bilinearInterpolation(throttle, rpm, baseTorque, throttleVal, rpmVal),
		afr: bilinearInterpolation(throttle, rpm, afr, throttleVal, rpmVal),
	};
}
