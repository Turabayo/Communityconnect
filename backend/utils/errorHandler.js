class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.status = 400;
    }
  }
  
  class InternalServerError extends Error {
    constructor(message) {
      super(message);
      this.status = 500;
    }
  }
  
  const handleError = (err, res) => {
    const { message, status } = err;
    res.status(status || 500).json({ error: message });
  };
  
  module.exports = {
    BadRequestError,
    InternalServerError,
    handleError,
  };
  