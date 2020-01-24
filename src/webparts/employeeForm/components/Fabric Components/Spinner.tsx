import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { IStackProps, Stack } from 'office-ui-fabric-react/lib/Stack';
import styles from '../EmployeeForm.module.scss';
export const SpinnerComponent: React.StatelessComponent = () => {
    const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };

    const tokens = {
        sectionStack: {
            childrenGap: 10
        },
        spinnerStack: {
            childrenGap: 20
        }
    };
    
    return (
        <Stack tokens={tokens.sectionStack} className={styles.spinner}>
            <Stack {...rowProps} tokens={tokens.spinnerStack}>
                <Spinner size={SpinnerSize.large} label="Wait, wait..." ariaLive="assertive" labelPosition="right" />
            </Stack>
        </Stack>
    );
};