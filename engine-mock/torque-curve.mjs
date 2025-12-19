export function torqueAt(throttleVal, rpmVal) {
	const rpm = [0, 800, 1500, 2500, 3500, 4500, 5500, 6500,7500,8500,10000];
  const baseTorque = [0, 350, 420, 480, 520, 540, 520, 450,400,300,0];
  const throttle = [0, 20, 40, 60, 80, 100];
  // Clamp throttle and rpm to valid ranges
  throttleVal = Math.max(0, Math.min(100, throttleVal));
  rpmVal = Math.max(0, Math.min(10000, rpmVal));

	// Minimum idle torque logic
	const idleRpmThreshold = 800;
	const idleTorque = 80; // Nm, matches baseTorque[0]
	if (throttleVal === 0 && rpmVal > 0 && rpmVal <= idleRpmThreshold) {
		// Linearly decrease idle torque from idleTorque at 0 rpm to 0 at idleRpmThreshold
		return idleTorque * (1 - rpmVal / idleRpmThreshold);
	}

	// Find throttle indices
	let tIdx = throttle.findIndex((t) => t >= throttleVal);
	if (tIdx === -1) tIdx = throttle.length - 1;
	if (tIdx === 0) return interpRpm(rpmVal, 0);

	// Find rpm indices
	function interpRpm(rpmVal, tIdx) {
		let rIdx = rpm.findIndex((r) => r >= rpmVal);
		if (rIdx === -1) rIdx = rpm.length - 1;
		if (rIdx === 0) return baseTorque[0] * (throttle[tIdx] / 100);

		// Linear interpolation between rpm[rIdx-1] and rpm[rIdx]
		const r0 = rpm[rIdx - 1],
			r1 = rpm[rIdx];
		const t0 = baseTorque[rIdx - 1] * (throttle[tIdx] / 100);
		const t1 = baseTorque[rIdx] * (throttle[tIdx] / 100);
		return t0 + ((t1 - t0) * (rpmVal - r0)) / (r1 - r0);
	}

	// Interpolate between throttle[tIdx-1] and throttle[tIdx]
	const t0 = throttle[tIdx - 1],
		t1 = throttle[tIdx];
	const v0 = interpRpm(rpmVal, tIdx - 1);
	const v1 = interpRpm(rpmVal, tIdx);
	return v0 + ((v1 - v0) * (throttleVal - t0)) / (t1 - t0);
}
