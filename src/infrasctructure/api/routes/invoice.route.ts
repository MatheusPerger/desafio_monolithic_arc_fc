import express, { Request, Response } from 'express';
import FindInvoiceUseCase from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import { FindInvoiceUseCaseInputDTO } from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase.dto';

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    const useCase = new FindInvoiceUseCase(new InvoiceRepository());

    try {
        const input: FindInvoiceUseCaseInputDTO = {
            id: id
        }

        const invoice = await useCase.execute(input);
        res.send(invoice);
    } catch (error) {
        res.status(500).send(error);
    }
});
