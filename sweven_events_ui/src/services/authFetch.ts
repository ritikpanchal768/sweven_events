export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
