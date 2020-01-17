import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import * as React from 'react';

const DateComponent = (props)=> {
debugger;
console.log(props.value)
    return (
        <DatePicker defaultValue={new Date()}
        value={props.value}
        {...props} 
        
       
        />
    );

};

export default DateComponent