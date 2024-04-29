import app from './app';

// Starting the Express server
app.listen(3000, '0.0.0.0', () => {
  console.log(`Listening at http://0.0.0.0:3000`);
});
