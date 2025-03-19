import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  }); // jwt.sign(payload, secret key, options)

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // in milliseconds
    httpOnly: true, // prevent XSS attacks - cross-site scripting attacks, Cookie cannot be accessed via JavaScript
    sameSite: 'strict', // Prevents cross-site request forgery (CSRF) - meaning frontend and backend must be on the same domain for the browser to send the cookie.
    secure: process.env.NODE_ENV !== 'development',
  });

  return token;
};
