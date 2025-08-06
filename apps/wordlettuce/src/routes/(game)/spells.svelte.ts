export function timeUntilNextGame() {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return Math.round((tomorrow.getTime() - new Date().getTime()) / 1000);
}

export function createNewGameCountDownTimer() {
  let value = $state(timeUntilNextGame());
  let countdownInterval: NodeJS.Timeout | undefined = $state(
    setInterval(() => {
      value = timeUntilNextGame();
    }, 1000),
  );

  return {
    get value() {
      return value;
    },
    pause() {
      clearInterval(countdownInterval);
      countdownInterval = undefined;
    },
    start() {
      value = timeUntilNextGame();
      if (!countdownInterval) {
        countdownInterval = setInterval(() => {
          value = timeUntilNextGame();
        }, 1000);
      }
    },
  };
}

export function createExpiringBoolean({ duration = 150 } = {}) {
  let value = $state(false);
  let timeout: NodeJS.Timeout | undefined = $state();

  return {
    get value() {
      return value;
    },
    truthify() {
      value = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        value = false;
      }, duration);
    },
    falsify() {
      value = false;
      if (timeout) {
        clearTimeout(timeout);
      }
    },
  };
}

export function createExpiringString({ duration = 4000 } = {}) {
  let value = $state('');
  let timeout: NodeJS.Timeout | undefined = $state();
  return {
    get value() {
      return value;
    },
    write(input = '') {
      value = input;
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        value = '';
      }, duration);
    },
  };
}
