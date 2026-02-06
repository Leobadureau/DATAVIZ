window.addEventListener('DOMContentLoaded', () => {
  const car1 = document.querySelector('.car1 .car');
  const car2 = document.querySelector('.car2 .car');

  if (!car1 || !car2) return;

  const trackLength = window.innerWidth + 200;

  let pos1 = -150;
  let pos2 = -150;

  let speed1 = 0.3;
  let speed2 = 0.3;

  let targetSpeed1 = speed1;
  let targetSpeed2 = speed2;

  const speedChangeInterval = 1000;
  let lastSpeedChangeTime = 0;

  const maxSpeedDelta = 0.05;
  const lerpFactor = 0.01;

  const maxPositionGap = 200;    // Écart max "normal"
  const maxAllowedGap = 350;     // Écart max toléré (au-delà correction renforcée)
  const baseCorrectionStrength = 0.001;

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function clampSpeedChange(current, target, maxDelta) {
    const delta = target - current;
    if (Math.abs(delta) > maxDelta) {
      return current + Math.sign(delta) * maxDelta;
    }
    return target;
  }

  let lastTimestamp = null;

  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!lastSpeedChangeTime) lastSpeedChangeTime = timestamp;
    if (timestamp - lastSpeedChangeTime > speedChangeInterval) {
      targetSpeed1 = 0.2 + Math.random() * 0.3;
      targetSpeed2 = 0.2 + Math.random() * 0.3;
      lastSpeedChangeTime = timestamp;
    }

    const gap = pos1 - pos2;

    // Calcul force correction selon écart
    let correctionStrength = baseCorrectionStrength;

    if (Math.abs(gap) > maxPositionGap) {
      // On augmente la correction plus fort dès que l'écart dépasse maxPositionGap
      // Plus l'écart est grand, plus la correction est forte (linéaire jusqu'à maxAllowedGap)
      let excessGap = Math.min(Math.abs(gap) - maxPositionGap, maxAllowedGap - maxPositionGap);
      let excessRatio = excessGap / (maxAllowedGap - maxPositionGap);
      correctionStrength += excessRatio * 0.01; // + correction jusqu'à 0.011 max environ
    }

    // Direction de la correction (vers rapprochement)
    const correction = Math.min(Math.max(gap / maxAllowedGap, -1), 1) * correctionStrength;

    targetSpeed1 = Math.min(Math.max(targetSpeed1 - correction, 0.1), 0.6);
    targetSpeed2 = Math.min(Math.max(targetSpeed2 + correction, 0.1), 0.6);

    speed1 = lerp(speed1, clampSpeedChange(speed1, targetSpeed1, maxSpeedDelta), lerpFactor);
    speed2 = lerp(speed2, clampSpeedChange(speed2, targetSpeed2, maxSpeedDelta), lerpFactor);

    pos1 += speed1 * delta;
    pos2 += speed2 * delta;

    if (pos1 > trackLength || pos2 > trackLength) {
      pos1 = -150;
      pos2 = -150;
      speed1 = 0.3;
      speed2 = 0.3;
      targetSpeed1 = speed1;
      targetSpeed2 = speed2;
    }

    car1.style.transform = `translateX(${pos1}px)`;
    car2.style.transform = `translateX(${pos2}px)`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
