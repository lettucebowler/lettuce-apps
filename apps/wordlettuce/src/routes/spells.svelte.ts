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
