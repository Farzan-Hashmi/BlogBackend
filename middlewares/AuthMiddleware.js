const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.json({ error: "No token, authorization denied" });
  }

  try {
    const validToken = verify(accessToken, process.env.SECRETKEY); //what verify does is that it takes the header and body from the token in the request. it generates its own signature using the secret and compares it to the signature that came in the jwt token from the request. if both the test and the request signature match, thats good otherwise not.
    //verify also returns the uncoded data from the token or an error

    req.user = validToken; //with req.user we can access the data from any path operation function that has this middleware.
    return next();
  } catch (err) {
    return res.json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
