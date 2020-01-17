import { Form, Control,createFieldClass,controls } from 'react-redux-form';
import {Dropdown} from 'office-ui-fabric-react/lib/Dropdown';
import * as React from 'react';

const FabricField = createFieldClass({
    'Dropdown': controls.select
  }, {
    componentMap: {
        Dropdown: Dropdown
    }
  });

export default FabricField