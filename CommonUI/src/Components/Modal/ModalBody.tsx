import Alert, { AlertType } from '../Alerts/Alert';
import React, { FunctionComponent, ReactElement } from 'react';

export interface ComponentProps {
    children: Array<ReactElement> | ReactElement;
    error?: string | undefined;
}

const ModalBody: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <div className="modal-body">
            {props.error && (
                <Alert title={props.error} type={AlertType.DANGER} />
            )}
            {props.children}
        </div>
    );
};

export default ModalBody;
