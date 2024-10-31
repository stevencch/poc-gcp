const inventoryRes = [
  {
    storeKey: 'a6e1e625d3b8499fafb64ab91d4f1abf',
    products: [
      {
        productId: 2669677,
        availableQty: 9,
      },
    ],
  },
  {
    storeKey: 'ead3de48eff247518b3fe820c8c077e0',
    products: [
      {
        productId: 2669677,
        availableQty: 4,
      },
    ],
  },
  {
    storeKey: 'ef104bbd5fa04a26a69339e72222ccec',
    products: [
      {
        productId: 2669677,
        availableQty: 0,
      },
    ],
  },
  {
    storeKey: 'dc186fb1f06a4412b9d7d9bc1bef95ec',
    products: [
      {
        productId: 2669677,
        availableQty: 7,
      },
    ],
  },
];

module.exports = [
  {
    id: 'search-inventory', // route id
    url: '/v1/cw_au/stores/stock/search', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: inventoryRes, // body to send
        },
      },
      {
        id: 'error', // variant id
        type: 'json', // variant handler id
        options: {
          status: 400, // status to send
          // body to send
          body: {
            message: 'Error',
          },
        },
      },
      // { // example of using middleware
      //   id: "specific", // variant id
      //   type: "middleware", // variant handler id
      //   options: {
      //     // Express middleware to execute
      //     middleware: (req, res) => {
      //       const storeKeys = req.params.storeKeys;

      //       if (storeKeys.includes('cwr-cw-au-store-100')) {
      //         res.status(200);
      //         res.send(inventoryRes);
      //       } else {
      //         res.status(404);
      //         res.send({
      //           message: "stock not found",
      //         });
      //       }
      //     },
      //   },
      // },
    ],
  },
];
