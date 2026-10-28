import mongoose from 'mongoose';

/**
 * Route-Specific Task ID Validation Middleware
 * Checks whether the incoming req.params.id is a valid 24-character hexadecimal MongoDB ObjectId.
 * Returns HTTP 400 with { error: 'Invalid task ID' } if malformed.
 */
const validateTaskId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid task ID'
    });
  }

  next();
};

export default validateTaskId;
