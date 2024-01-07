import express from "express";
import { braintreePayment, braintreeToken, getAllPayments, getPaymentByMonthly } from "../controllers/paymentController.js";
import { requredSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

//PAYMENTS ROUTES
//TOKEN
router.get("/braintree/token", braintreeToken)

//PAYMENTS
router.post("/braintree/payment", requredSignIn, braintreePayment);

router.get("/orders/:year/:month", getPaymentByMonthly);
router.get("/get-all/payments", getAllPayments);
export default router;