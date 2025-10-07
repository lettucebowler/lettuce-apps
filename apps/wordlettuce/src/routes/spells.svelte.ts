export class NewGameCountdownTimer {
  #value = $state(0);
  #countdownInterval: NodeJS.Timeout | undefined = $state(
    setInterval(() => {
      this.#updateValue();
    }, 1000),
  );

  #updateValue() {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    this.#value = Math.round((tomorrow.getTime() - new Date().getTime()) / 1000);
  }

  get value() {
    return this.#value;
  }
  pause() {
    clearInterval(this.#countdownInterval);
    this.#countdownInterval = undefined;
  }
  start() {
    this.#updateValue();
    if (!this.#countdownInterval) {
      this.#countdownInterval = setInterval(() => {
        this.#updateValue();
      }, 1000);
    }
  }
}

type ExpiringStringInit = {
  duration?: number;
};
export class ExpiringString {
  #value = $state('');
  #timeout: NodeJS.Timeout | undefined = $state();
  #duration = 4000;

  constructor({ duration = 4000 }: ExpiringStringInit = {}) {
    this.#duration = duration;
  }

  get value() {
    return this.#value;
  }

  write(input = '') {
    this.#value = input;
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
    this.#timeout = setTimeout(() => {
      this.#value = '';
    }, this.#duration);
  }
}
