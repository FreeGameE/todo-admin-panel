class TokenManager {
  #accessToken: string | null = null;

  setToken(token: string) {
    this.#accessToken = token;
  }

  getToken(): string | null {
    return this.#accessToken;
  }

  clearToken() {
    this.#accessToken = null;
  }
}

export const tokenManager = new TokenManager();
