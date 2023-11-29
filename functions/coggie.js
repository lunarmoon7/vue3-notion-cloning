exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: 'coggie',
      age: 25,
      email: 'zentechie7@gmail.com',
    }),
  };
};
