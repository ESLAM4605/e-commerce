import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { AppError, catchError } from "../../../utils/error.handler.js";
import productModel from "../models/product.model.js";
import reviewModel from "../models/review.model.js";

export const getReviews = catchError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);
  const apiFeatures = new ApiFeatures(reviewModel.find(), req.query).paginate(
    10
  );
  const reviews = await apiFeatures.query;
  res.json({ reviews });
});

export const addReview = catchError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);

  const addedReview = await reviewModel.findOne({
    user_id: req.user.id,
    product_id: product._id,
  });

  if (addedReview) throw new AppError("Review already exists", 400);

  const review = await reviewModel.create({
    ...req.body,
    user_id: req.user.id,
    product_id: product._id,
  });
  res.json({ review });
});

export const updateReview = catchError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) throw new AppError("Invalid product slug", 404);

  const review = await reviewModel.findOneAndUpdate(
    {
      user_id: req.user.id,
      product_id: product._id,
    },
    req.body
  );

  if (!review) throw new AppError("Review doesn't exist", 404);

  res.json({ review });
});

export const deleteReview = catchError(async (req, res) => {
  const { productSlug } = req.params;
  const product = await productModel.findOne({ slug: productSlug });
  if (!product) res.status(404).json({ message: "Product not found" });
  const review = await reviewModel.findByIdAndDelete({
    product_id: product._id,
    user_id: req.user.id,
  });
  res.json({ review });
});
