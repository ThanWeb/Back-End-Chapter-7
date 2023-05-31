const { Car } = require("../models");
const CarController = require("./CarController");

describe('#handleListCars', () => {
  it('should call res.status(200) and res.json with car list', async () => {
    const name = "Duster 360"
    const price = 300000
    const size = "MEDIUM"

    const mockRequest = {query: {page: 1, pageSize: 1}};
    const cars = [];
    const meta = {
      pagination: {
        page: 1,
        pageCount: 2,
        pageSize: 1,
        count: 2
      }
    }

    for (let i = 0; i < 2; i++) {
      const car = new Car({ id: i + 1, name, price, size });
      cars.push(car);
    }

    const mockCarModel = { findAll: jest.fn().mockReturnValue(cars), count: jest.fn().mockReturnValue(2) };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleListCars(mockRequest, mockResponse);

    expect(mockCarModel.findAll).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({cars, meta});
  });
});

describe('#handleGetCar', () => {
  it('should call res.status(200) and res.json spesific car', async () => {
    const cars = []
    const carsData = [
      {
        id: 1,
        name: "Duster 360",
        price: 300000,
        size: "MEDIUM",
      },
      {
        id: 2,
        name: "Duster 360",
        price: 300000,
        size: "MEDIUM",
      }
    ];

    for (let i = 0; i < carsData.length; i++) {
      const car = new Car({ id: i + 1, name: carsData[i].name, price: carsData[i].price, size: carsData[i].size });
      cars.push(car);
    }

    const mockRequest = {
      params: {
        id: 1
      }
    }
    const mockCarModel = { findByPk: jest.fn().mockReturnValue(cars[0]) };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleGetCar(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(cars[0]);
  });
});

describe('#handleCreateCar', () => {
  it('should call res.status(201) and res.json created car', async () => {
    const name = "Duster 360"
    const price = 300000
    const size = "MEDIUM"

    const mockRequest = {
      body: {
        name,
        price,
        size
      },
    };

    const car = new Car({ name, price, size });
    const mockCarModel = { create: jest.fn().mockReturnValue(car) };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleCreateCar(mockRequest, mockResponse);

    expect(mockCarModel.create).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(car);
  });

  it('should call res.status(422) and res.json error name and error message', async () => {
    const err = new Error("Something");
    const name = "Duster 360"
    const price = 300000
    const size = "MEDIUM"
    const image = "image.png"
    const isCurrentlyRented = false

    const mockRequest = {
      body: {
        name,
        price,
        size,
        image,
        isCurrentlyRented
      },
    };

    const mockCarModel = {
      create: jest.fn().mockReturnValue(Promise.reject(err)),
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleCreateCar(mockRequest, mockResponse);

    expect(mockCarModel.create).toHaveBeenCalledWith({
      name,
      price,
      size,
      image,
      isCurrentlyRented
    });
    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  });
});

describe('#handleUpdateCar', () => {
  it('should call res.status(200) and res.json updated car', async () => {
    const name = "Duster 360"
    const price = 300000
    const size = "MEDIUM"
    const image = "image.png"
    const isCurrentlyRented = false

    const mockRequest = {
      params: {
        id: 1
      },
      body: {
        name,
        price,
        size,
        image,
        isCurrentlyRented
      },
    };

    const mockCar = new Car({ name, price, size });
    mockCar.update = jest.fn().mockReturnThis();

    const mockCarModel = {};
    mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

    const mockResponse = {};
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn().mockReturnThis();

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleUpdateCar(mockRequest, mockResponse);

    expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockCar.update).toHaveBeenCalledWith({ name, price, size, image, isCurrentlyRented });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCar);
  });

  it('should call res.status(422) and res.json error name and error message', async () => {
    const err = new Error("Something");
    const name = "Duster 360"
    const price = 300000
    const size = "MEDIUM"
    const image = "image.png"
    const isCurrentlyRented = false

    const mockRequest = {
      body: {
        name,
        price,
        size,
        image,
        isCurrentlyRented
      },
    };

    const mockCarModel = {
      create: jest.fn().mockReturnValue(Promise.reject(err)),
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleCreateCar(mockRequest, mockResponse);

    expect(mockCarModel.create).toHaveBeenCalledWith({
      name,
      price,
      size,
      image,
      isCurrentlyRented
    });
    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  });
});

describe('#handleDeleteCar', () => {
  it('should call res.status(204)', async () => {
    const name = "Duster 360"
    const price = 300000
    const size = "MEDIUM"

    const mockRequest = {
      params: {
        id: 1,
      },
    };

    const mockCar = new Car({ name, price, size });
    mockCar.destroy = jest.fn();

    const mockCarModel = {};
    mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

    const mockResponse = {};
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.end = jest.fn().mockReturnThis();

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleDeleteCar(mockRequest, mockResponse);

    expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockCar.destroy).toHaveBeenCalledWith();
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.end).toHaveBeenCalled();
  });

  it('should call res.status(422) and res.json error name and error message', async () => {
    const err = new Error("Not found!");

    const mockRequest = {
      params: {
        id: 1,
      },
    };

    const mockCarModel = {};
    mockCarModel.findByPk = jest.fn(() => Promise.reject(err));

    const mockResponse = {};
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn().mockReturnThis();

    const carController = new CarController({ carModel: mockCarModel });
    await carController.handleDeleteCar(mockRequest, mockResponse);

    expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  });
});