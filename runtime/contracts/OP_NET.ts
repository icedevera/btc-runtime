import { IBTC } from '../interfaces/IBTC';
import { Address, ADDRESS_BYTE_LENGTH } from '../types/Address';
import { Blockchain } from '../env';
import { BytesWriter } from '../buffer/BytesWriter';
import { encodeSelector, Selector } from '../math/abi';
import { Revert } from '../types/Revert';
import { MAX_EVENT_DATA_SIZE, NetEvent } from '../events/NetEvent';
import { Calldata } from '../types';

export class OP_NET implements IBTC {
    public get address(): Address {
        return Blockchain.contractAddress;
    }

    public get contractDeployer(): Address {
        return Blockchain.contractDeployer;
    }

    public onDeployment(_calldata: Calldata): void {}

    public onExecutionCompleted(): void {}

    public execute(method: Selector, _calldata: Calldata): BytesWriter {
        let response: BytesWriter;

        switch (method) {
            case encodeSelector('deployer'):
                response = new BytesWriter(ADDRESS_BYTE_LENGTH);
                response.writeAddress(this.contractDeployer);
                break;
            default:
                throw new Revert('Method not found');
        }

        return response;
    }

    protected emitEvent(event: NetEvent): void {
        if (event.length > MAX_EVENT_DATA_SIZE) {
            throw new Error('Event data length exceeds maximum length.');
        }

        Blockchain.emit(event);
    }

    protected isSelf(address: Address): boolean {
        return this.address === address;
    }

    protected onlyDeployer(caller: Address): void {
        if (this.contractDeployer !== caller) {
            throw new Revert('Only owner can call this method');
        }
    }
}
