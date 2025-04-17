let accesToken: string | null = null;

export const tokenManager = {
  setToken: (token: string) => {
    accesToken = token;
  },
  getToken: () => accesToken,
  clearToken: () => {accesToken = null}
}