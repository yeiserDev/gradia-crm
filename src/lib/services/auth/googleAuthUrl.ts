export const startGoogleLogin = (): void => {
  // Redirigir directamente al backend de AUTH
  window.location.href = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/google`;
};
