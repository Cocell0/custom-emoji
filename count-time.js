function countTime(startTime) {
  const elapsed = (Date.now() - startTime) / 1000;

  if (elapsed <= 60) {
    return `${elapsed.toFixed(2)} seconds`;
  } else if (elapsed <= 3600) {
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    return `${minutes} minutes, and ${seconds} seconds`;
  } else {
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = Math.floor(elapsed % 60);
    return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
  }
}

module.exports = countTime;