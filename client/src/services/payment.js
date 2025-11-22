import api from "./api";

export const paymentAPI = {
  createPaymentIntent: (courseId) => api.post("/payment/create-payment-intent", { courseId }),
  getPaymentHistory: () => api.get("/payment/history"),
  getPaymentDetails: (paymentId) => api.get(`/payment/${paymentId}`),
};
