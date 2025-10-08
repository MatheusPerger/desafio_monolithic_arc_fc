import InvoiceFacadeInterface from "./invoice.facade.interface";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.usecase.dto";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.usecase.dto";

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _findInvoiceUseCase: FindInvoiceUseCase;
    private _generateInvoiceUseCase: GenerateInvoiceUseCase;

    constructor(
        findInvoiceUseCase: FindInvoiceUseCase,
        generateInvoiceUseCase: GenerateInvoiceUseCase
    ) {
        this._findInvoiceUseCase = findInvoiceUseCase;
        this._generateInvoiceUseCase = generateInvoiceUseCase;
    }

    async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        return this._findInvoiceUseCase.execute(input);
    }

    async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        return this._generateInvoiceUseCase.execute(input);
    }
}
