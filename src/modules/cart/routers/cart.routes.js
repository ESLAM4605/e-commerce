import { Router } from "express";
import { authenticate, authorize } from "../../auth/auth.middlewares.js";
import { ROLES } from "../../../utils/enums.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  applyCoupon,
} from "../controllers/cart.controller.js";
import { assertCart } from "../middlewares/cart.middleware.js";

const router = Router();

router.route("/").get(authenticate, authorize(ROLES.USER), assertCart, getCart);
router
  .route("/adding")
  .put(authenticate, authorize(ROLES.USER), assertCart, addToCart);
router
  .route("/removing")
  .put(authenticate, authorize(ROLES.USER), assertCart, removeFromCart);
router
  .route("/coupon")
  .put(authenticate, authorize(ROLES.USER), assertCart, applyCoupon);

export default router;
