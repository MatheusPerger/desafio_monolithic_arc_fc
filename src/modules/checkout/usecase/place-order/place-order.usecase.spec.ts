import { number } from "yup";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";

describe("PlaceOrderUseCase unit test", () => {

    const mockDate = new Date(2000, 1, 1, 1);
    
    describe("validateProducts method", () => {
        // @ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when products is empty", async () => {
            const input = { clientId: "0", products: [] as any[] };

            await expect(
                // @ts-expect-error - spy on private method
                placeOrderUseCase.validateProducts(input)
            ).rejects.toThrow("No products selected");
        });

        it("should throw an error when product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) => {
                    return Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    });
                }),
                find: jest.fn(),
            };

            // @ts-expect-error - force set productFacade
            placeOrderUseCase._productFacade = mockProductFacade;

            let input = { clientId: "0", products: [{ productId: "1" }] };

            await expect(
                // @ts-expect-error - spy on private method
                placeOrderUseCase.validateProducts(input)
            ).rejects.toThrow("Product 1 is not available in stock");

            input = { clientId: "0", products: [{ productId: "0" }, { productId: "1" }] };

            await expect(
                // @ts-expect-error - spy on private method
                placeOrderUseCase.validateProducts(input)
            ).rejects.toThrow("Product 1 is not available in stock");
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = { clientId: "0", products: [{ productId: "2" }, { productId: "1" }] };

            await expect(
                // @ts-expect-error - spy on private method
                placeOrderUseCase.validateProducts(input)
            ).rejects.toThrow("Product 1 is not available in stock");
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe("getProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        // @ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should return the product when found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase._catalogFacade = mockCatalogFacade;

            await expect(
                // @ts-expect-error - spy on private method
                placeOrderUseCase.getProduct("0")
            ).rejects.toThrow("Product not found");
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "1",
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100
                }),
            };

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase._catalogFacade = mockCatalogFacade;

            expect(
                // @ts-expect-error - spy on private method
                await placeOrderUseCase.getProduct("1")
            ).toEqual(
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100
                })
            );

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("execute method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
                add: jest.fn(),
            };

            // @ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            // @ts-expect-error - force set clientFacade
            placeOrderUseCase._clientFacade = mockClientFacade;

            const input = {
                clientId: "0",
                products: [{ productId: "1" }],
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Client not found");
        });

        it("should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
                add: jest.fn(),
            };

            // @ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            // @ts-expect-error - force set clientFacade
            placeOrderUseCase._clientFacade = mockClientFacade;

            const mockValidateProducts = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-expect-error - not return never
                .mockRejectedValue(new Error("No products selected"));

            const input = {
                clientId: "1",
                products: [] as any[]
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("No products selected");
            expect(mockValidateProducts).toHaveBeenCalled();
        });

        describe("place an order", () => {

            const clientProps = {
                id: "1",
                name: "Client 1",
                document: "12345678900",
                email: "client1@example.com",
                street: "123 Main St",
                number: "100",
                complement: "Apt 1",
                city: "Anytown",
                state: "CA",
                zipCode: "12345"
            };
            
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
                add: jest.fn(),
            };

            const mockPaymentFacade = {
                process: jest.fn(),
            }

            const mockCheckoutRepository = {
                addOrder: jest.fn(),
                findOrder: jest.fn(),
            };

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({id: "1i"}),
                find: jest.fn(),
            };

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade,
                null,
                null,
                mockCheckoutRepository,
                mockInvoiceFacade,
                mockPaymentFacade
            );

            const products = {
                "1": { id: new Id("1"), name: "Product 1", description: "Product 1 description", salesPrice: 40 },
                "2": { id: new Id("2"), name: "Product 2", description: "Product 2 description", salesPrice: 30 },
            };

            const mockValidateProducts = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-expect-error - not return never
                .mockResolvedValue(null);
            
            const mockGetProduct = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                // @ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => { 
                    return Promise.resolve(products[productId]);
                });


            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        { productId: "1" },
                        { productId: "2" },
                    ],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([{ productId: "1" }, { productId: "2" }]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            });

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        { productId: "1" },
                        { productId: "2" },
                    ],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([{ productId: "1" }, { productId: "2" }]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.street,
                    number: clientProps.number,
                    complement: clientProps.complement,
                    city: clientProps.city,
                    state: clientProps.state,
                    zipCode: clientProps.zipCode,
                    items: [
                        {
                            id: products["1"].id.id,
                            name: products["1"].name,
                            price: products["1"].salesPrice,
                        },
                        {
                            id: products["2"].id.id,
                            name: products["2"].name,
                            price: products["2"].salesPrice,
                        },
                    ]
                });
            });
        });
    });
});