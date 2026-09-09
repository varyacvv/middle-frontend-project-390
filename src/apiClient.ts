import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || `Ошибка запроса (${status})`;
      const customError = new Error(message);
      (customError as { status?: number }).status = status;
      throw customError;
    } else if (error.request) {
      throw new Error("Сервер недоступен");
    } else {
      throw new Error("Ошибка выполнения запроса");
    }
  },
);

export default apiClient;
