import { useTonhubConnect } from 'react-ton-x';
import { TxnState } from '../hooks/useSendTxn';
import { Card } from './Card';

export function TransactionWatcher(props: { txnState: TxnState }) {
    if (props.txnState === 'idle') {
        return null;
    }

    let txStatus = '';
    if (props.txnState === 'requested') {
        txStatus = 'Transaction requested';
    }
    if (props.txnState === 'pending') {
        txStatus = 'Transaction pending';
    }
    if (props.txnState === 'success') {
        txStatus = 'Transaction success';
    }
    if (props.txnState === 'error') {
        txStatus = 'Transaction error';
    }

    return (
        <Card title="Transaction status">
            <h3>{txStatus}</h3>
        </Card>
    )
}